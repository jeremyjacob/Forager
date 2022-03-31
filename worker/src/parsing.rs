use std::borrow::Cow;
use std::cmp::{max, min};
use std::collections::{BTreeMap};
use std::time::SystemTime;
use aho_corasick::{AhoCorasickBuilder, Match};
use regex::{Regex};
use crate::{CONTEXT_LENGTH, TagMatch};

pub fn parse_out_tags<'t>(domain: String, body: String, all_keywords: &Vec<&String>, tag_lengths: &BTreeMap<&String, usize>) -> Vec<String> {
    let mut now = SystemTime::now();
    let tag_stripper = Regex::new(r"(?is:(<!--(.*?)-->)|(<script(.*?)</script>)|(<style(.*?)</style>)|(<(.*?)>))").unwrap(); // doesnt match multiline for some reason #TODO
    println!("Stripped {} in {:.2}ms", &domain, now.elapsed().unwrap().as_nanos() as f64 * 1e-6);
    now = SystemTime::now();
    let cow = tag_stripper.replace_all(body.as_str(), " ");
    println!("Replaced {} in {:.2}ms", &domain, now.elapsed().unwrap().as_nanos() as f64 * 1e-6);
    now = SystemTime::now();

    let matches:

    // println!("{}", cow);
    let ac = AhoCorasickBuilder::new()
        .ascii_case_insensitive(true)
        .build(all_keywords);
    for mat in ac.find_iter(&*cow) {
        // loop tag_lengths to find pattern
        let keyword = *all_keywords.get(mat.pattern()).expect("keyword out of bounds");

        let pattern = mat.pattern() as i32;
        let snippet = &cow[mat.start()..mat.end()];

        // Check if keyword is all caps and discard match if the match isn't all caps
        // println!("match");
        // if keyword == &keyword.to_uppercase() && snippet != snippet.to_uppercase() { continue; }

        match find_tag_name(tag_lengths, pattern) {
            Some(tag) => {
                let tag_match = TagMatch {
                    tag,
                    keyword,
                };
                println!("{:?}", tag_match);

            }
            None => {}
        }
    }

    // println!("Parsed {} in {:.2}ms", &domain, now.elapsed().unwrap().as_nanos() as f64 * 1e-6);

    vec![]
}

fn find_tag_name<'a>(tag_lengths: &'a BTreeMap<&'a String, usize>, pattern: i32) -> Option<&'a String> {
    let mut total_length: i32 = 0;
    for (tag, length) in tag_lengths.iter() {
        total_length += *length as i32;
        if total_length > pattern {
            return Some(*tag);
        }
    }
    println!("find_tag_name {}", total_length);
    None
}


// pub fn make_regex(keywords: &Vec<String>) -> Regex {
// for k in keywords.to_owned().iter_mut() {
// if k == &k.to_uppercase() { *k = format!("((?s){})", k); } // If keyword is all uppercase, only match it as uppercase
// *k = format!(".{{0,{ctx}}}{}.{{0,{ctx}}}", regex::escape(&*k.replace(" ", "( |-|)")), ctx = CONTEXT_LENGTH)
// }
// let regex_string = format!("(?is:exp){}", &keywords.join("|"));
// Regex::new(&*regex_string).unwrap()
// }

