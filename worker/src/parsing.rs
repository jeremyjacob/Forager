use std::borrow::Cow;
use std::collections::{BTreeMap, HashSet};
use std::time::SystemTime;
use aho_corasick::{AhoCorasickBuilder, Match};
use regex::{Regex};
use crate::{SnippetMatch};

fn is_delimiter(character: char) -> bool {
    character.is_whitespace() && character != ' '
}

fn find_snippet<'a>(cow: &'a Cow<'a, str>, mat: Match) -> &'a str {
    let mut indices = cow.char_indices();
    let start = {
        let mut index: usize = 0;
        for i in (0..mat.start()).rev() {
            let char = indices.nth(i);
            match char {
                None => {}
                Some((i, character)) => {
                    if is_delimiter(character) {
                        index = i;
                        break;
                    }
                }
            }
        }
        index
    };
    // iterate from end of match out
    let end = {
        let mut index: usize = cow.len() - 1;
        for i in mat.end()..cow.len() {
            let char = indices.nth(i);
            match char {
                None => {}
                Some((i, character)) => {
                    if is_delimiter(character) {
                        index = i;
                        break;
                    }
                }
            }
        }
        index
    };
    &cow[start..end]
}

pub fn parse_out_tags<'a>(id: String, body: &String, all_keywords: &Vec<&'a std::string::String>) -> SnippetMatch {
    let mut now = SystemTime::now();
    let tag_stripper = Regex::new(r"(?is:(<!--(.*?)-->)|(<script(.*?)</script>)|(<style(.*?)</style>)|(<(.*?)>))").unwrap(); // doesnt match multiline for some reason #TODO
    // println!("Stripped {} in {:.2}ms", &id, now.elapsed().unwrap().as_nanos() as f64 * 1e-6);
    now = SystemTime::now();
    let cow = tag_stripper.replace_all(body.as_str(), "\n");
    // println!("Replaced {} in {:.2}ms", &id, now.elapsed().unwrap().as_nanos() as f64 * 1e-6);
    now = SystemTime::now();

    let mut snippets = Vec::new();

    // println!("{}", cow);
    let ac = AhoCorasickBuilder::new()
        .ascii_case_insensitive(true)
        .build(all_keywords);
    for mat in ac.find_iter(&*cow) {
        // iterate from start of match out
        let snippet = find_snippet(&cow, mat);
        snippets.push(snippet.to_string());
    }

    // println!("Parsed {} in {:.2}ms", &domain, now.elapsed().unwrap().as_nanos() as f64 * 1e-6);

    SnippetMatch { _id: id.clone(), snippets }
}