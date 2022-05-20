#![feature(async_closure)]

//
use clokwerk::{AsyncScheduler, TimeUnits};
use futures::stream::StreamExt;
use reqwest::header::HeaderMap;
use reqwest::redirect::{Action, Attempt, Policy};
use reqwest::{header, Client};
use static_init::dynamic;
use std::collections::{BTreeMap, HashSet};
use std::sync::{Arc, Mutex};
use std::time::{Duration, SystemTime};

use crate::communication::*;
use crate::config::*;
use crate::parsing::parse_out_tags;
use crate::types::*;
use std::env;

mod communication;
mod config;
mod parsing;
mod types;

#[dynamic]
static QUEUED_MATCHES: MatchQueue<'static> = Arc::new(Mutex::new(HashSet::new()));

#[dynamic]
static DOMAINS: Arc<Mutex<Vec<Domain>>> = Arc::new(Mutex::new(Vec::new()));

#[dynamic]
static API_KEY: String =
    env::var("FORAGER_API_KEY").expect("Environment variable FORAGER_API_KEY is missing! ");

#[dynamic]
static HEADERS: HeaderMap = {
    let mut h = header::HeaderMap::new();
    h.insert(
        header::AUTHORIZATION,
        header::HeaderValue::from_static(&API_KEY),
    );
    h
};

#[dynamic] //
static CLIENT: reqwest::Client = Client::builder()
    // .connect_timeout(Duration::from_secs(TIMEOUT))
    .timeout(Duration::from_secs(TIMEOUT))
    .default_headers(HEADERS.to_owned())
    .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0. 4844.82 Safari/537.36")
    .redirect(Policy::custom(redirect_policy))
    .danger_accept_invalid_certs(env::var("DISABLE_SSL").is_ok())
    .build().unwrap();

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let tags = get_tags(&CLIENT).await?;
    let all_keywords = tags.values().flatten().collect::<Vec<_>>();
    let mut tag_lengths = BTreeMap::new();
    for (name, keywords) in tags.iter() {
        tag_lengths.insert(name, keywords.len());
    }

    // println!("{}", all_keywords);
    // return Ok(());

    {
        let mut scheduler = AsyncScheduler::new();
        scheduler.every(1.seconds()).run(async || {
            // println!("Sched HEAD");
            post_results().await;
            QUEUED_MATCHES.lock().unwrap().clear();
        });
        tokio::spawn(async move {
            loop {
                scheduler.run_pending().await;
                tokio::time::sleep(Duration::from_millis(100)).await;
            }
        });
    }

    println!("Scraping...");
    for i in 1..LIFETIME {
        let now = SystemTime::now();
        let result: Vec<Domain> = get_domains(&CLIENT).await?;
        DOMAINS.lock().unwrap().clone_from(&result);
        // println!("Domains {:?}", result);
        // let test_domain = Domain {
        //     _id: "".to_string(),
        //     domain: "hbr.org".to_string(),
        // };
        // let result = vec![test_domain];

        fetch_all(result, &all_keywords, &tag_lengths).await;
        // println!("{:?}", &all_keywords);

        let elapsed = now.elapsed()?;
        let elapsed_s = elapsed.as_millis() as f64 / 1000.0;
        println!(
            "Completed age in {:.2} sec. {} failed. {} completed.",
            i + 1,
            LIFETIME,
            elapsed_s,
        );
    }

    // parse_out_tags("test.com".to_string(), "poppy and<style>\nNOPE\n</style> <P>NOPE2</P>pippin <STYLE>NOPE3</STYLE>Education poppy".to_string(), &all_keywords, &tag_lengths);
    // println!("{:?}", QUEUED_MATCHES.lock().unwrap());
    // post_results(&CLIENT, &QUEUED_MATCHES);
    Ok(())
}

fn redirect_policy(attempt: Attempt) -> Action {
    // println!("{:?}", attempt);
    let host = attempt.url().host_str().unwrap_or("A");
    let prev_host = {
        let first = attempt.previous().first();
        match first {
            None => "B",
            Some(url) => {
                url.host_str().unwrap_or("B") // different}
            }
        }
    };

    if attempt.previous().len() >= MAX_REDIRECTS {
        // add_error("", "Too many redirects");
        // let tag_match = TagMatch {
        //     id: "".to_string(),
        //     tag: "".to_string(),
        //     keyword: "".to_string()
        // }
        let domain = attempt.url().domain().unwrap_or("");
        let search_result = DOMAINS
            .lock()
            .unwrap()
            .binary_search_by_key(&domain, |d| &*d.domain);
        match search_result {
            Err(_) => {}
            Ok(index) => {
                let tag_match = SnippetMatch {
                    _id: DOMAINS.lock().unwrap().get(index).unwrap()._id.clone(),
                    snippets: vec![],
                };
                add_tag(tag_match);
            }
        }
        attempt.error("Too many redirects")
    } else if host != prev_host {
        attempt.error("Redirected to a different hostname")
    } else {
        attempt.follow()
    }
}

async fn fetch_all<'a, 's>(
    domains: Vec<Domain>,
    all_keywords: &'a Vec<&String>,
    tag_lengths: &'a BTreeMap<&String, usize>,
) {
    let fetches = futures::stream::iter(domains.into_iter().enumerate().map(|(index, result)| {
        let send_fut = CLIENT.get("http://".to_owned() + &result.domain).send();
        println!("REQUEST: {} i:{}", &result.domain, index);
        async move {
            match send_fut.await {
                Ok(resp) => {
                    match resp.text().await {
                        Ok(text) => {
                            println!(
                                "RESPONSE: {} bytes from {} i:{}",
                                text.len(),
                                &result.domain,
                                index
                            );
                            let tags = parse_out_tags(result._id, &text, all_keywords);
                            // println!("FOUND {}: {:?}", result.domain, tags);
                            QUEUED_MATCHES.lock().unwrap().extend(tags);
                        }
                        Err(error) => {
                            // println!("ERROR reading {} i:{} {:?}", result.domain, index, error);
                            let tag_match = SnippetMatch {
                                _id: result._id,
                                snippets: vec![],
                            };
                            add_tag(tag_match);
                        }
                    }
                }
                Err(error) => {
                    // println!("ERROR downloading {} i:{} {:?}", result.domain, index, error);
                    let tag_match = SnippetMatch {
                        _id: result._id,
                        snippets: vec![],
                    };
                    add_tag(tag_match);
                }
            }
        }
    }))
        .buffer_unordered(THREADS)
        .collect::<Vec<()>>();
    fetches.await;
}
