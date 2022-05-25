use std::borrow::Cow;
use std::collections::{BTreeSet, HashSet};
use std::time::SystemTime;
use aho_corasick::{AhoCorasickBuilder, Match};
use regex::{Regex};
use futures::stream::StreamExt;
use crate::{add_match, CLIENT, Domain, SnippetMatch, THREADS};

fn is_delimiter(character: char) -> bool {
    character.is_whitespace() && character != ' '
}

fn find_snippet<'a>(cow: &'a Cow<'a, str>, mat: Match) -> &'a str {
    let mut start_uindex = 0;
    for (i, (char_pos, _)) in cow.char_indices().enumerate() {
        if char_pos < mat.start() { continue; }
        start_uindex = i;
        break;
    }

    let mut snippet_start = 0;
    let mut snippet_end = 0;
    for (char_pos, char) in cow.char_indices().rev() {
        if char_pos > mat.start() { continue; };
        if is_delimiter(char) {
            snippet_start = char_pos;
            break;
        }
    }
    for (char_pos, char) in cow.char_indices() {
        if char_pos < mat.start() { continue; };
        if is_delimiter(char) {
            snippet_end = char_pos;
            break;
        }
    }

    // println!("start_char_pos: {} end_char_pos: {}", snippet_start, snippet_end);
    &cow[snippet_start..snippet_end]
}

pub fn parse_out_tags<'a>(id: String, body: &String, keywords: &Vec<&'a str>) -> SnippetMatch {
    let mut now = SystemTime::now();
    let tag_stripper = Regex::new(r"(?is:(<!--(.*?)-->)|(<script(.*?)</script>)|(<style(.*?)</style>)|(<(.*?)>))").unwrap(); // doesnt match multiline for some reason #TODO
    // println!("Stripped {} in {:.2}ms", &id, now.elapsed().unwrap().as_nanos() as f64 * 1e-6);
    now = SystemTime::now();
    let cow = tag_stripper.replace_all(body.as_str(), "\n");
    // println!("Replaced {} in {:.2}ms", &id, now.elapsed().unwrap().as_nanos() as f64 * 1e-6);
    now = SystemTime::now();

    let mut snippets = BTreeSet::new();

    // println!("{}", cow);
    let ac = AhoCorasickBuilder::new()
        .ascii_case_insensitive(true)
        .build(keywords);
    for mat in ac.find_iter(&*cow) {
        // iterate from start of match out
        let snippet = find_snippet(&cow, mat);
        snippets.insert(snippet.trim().to_string());
    }

    // println!("Parsed {} in {:.2}ms", &domain, now.elapsed().unwrap().as_nanos() as f64 * 1e-6);

    SnippetMatch { _id: id.clone(), snippets }
}

pub async fn fetch_all(
    domains: Vec<Domain>,
    keywords: &Vec<&str>,
) {
    let fetches = futures::stream::iter(domains.into_iter().enumerate().map(|(index, result)| {
        let send_fut = CLIENT.get("http://".to_owned() + &result.domain).send();
        // println!("REQUEST: {} i:{}", &result.domain, index);
        async move {
            match send_fut.await {
                Ok(resp) => {
                    match resp.text().await {
                        Ok(text) => {
                            let snippet_match = parse_out_tags(result._id, &text, keywords);
                            let count = snippet_match.snippets.len();
                            // if count > 0 { println!("FOUND {}: {:?}", result.domain, count); }
                            // println!("FOUND {}: {:?}", result.domain, count);
                            add_match(snippet_match);
                        }
                        Err(error) => {
                            // println!("ERROR reading {} i:{} {:?}", result.domain, index, error);
                            let blank_snippet = SnippetMatch {
                                _id: result._id,
                                snippets: BTreeSet::new(),
                            };
                            add_match(blank_snippet);
                        }
                    }
                }
                Err(error) => {
                    // println!("ERROR downloading {} i:{} {:?}", result.domain, index, error);
                    let blank_snippet = SnippetMatch {
                        _id: result._id,
                        snippets: BTreeSet::new(),
                    };
                    add_match(blank_snippet);
                }
            }
        }
    }))
        .buffer_unordered(THREADS)
        .collect::<Vec<()>>();
    fetches.await;
}
