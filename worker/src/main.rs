use std::collections::{BTreeMap, HashSet};
use std::sync::{Arc, Mutex};
use reqwest::{Client, header, Url};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::time::{Duration, SystemTime};
use futures::stream::StreamExt;
use reqwest::redirect::{Action, Attempt, Policy};
use clokwerk::{Scheduler, TimeUnits};
use static_init::{dynamic};
use reqwest::header::HeaderMap;

use crate::communication::*;
use crate::config::*;
use crate::parsing::parse_out_tags;
use crate::types::*;

mod config;
mod types;
mod parsing;
mod communication;

static COMPLETED: AtomicUsize = AtomicUsize::new(0);
static FAILED: AtomicUsize = AtomicUsize::new(0);


#[dynamic]
static queued_matches: MatchQueue<'static> = Arc::new(Mutex::new(HashSet::new()));

#[dynamic]
static HEADERS: HeaderMap = {
    let mut h = header::HeaderMap::new();
    h.insert(header::AUTHORIZATION, header::HeaderValue::from_static(API_KEY));
    h
};

#[dynamic]
static CLIENT: reqwest::Client = Client::builder()
    .connect_timeout(Duration::from_secs(TIMEOUT))
    .default_headers(HEADERS.to_owned())
    .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0. 4844.82 Safari/537.36")
    .redirect(Policy::custom(redirect_policy))
    .build().unwrap();

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let now = SystemTime::now();
    let tags = get_tags(&CLIENT).await?;
    let all_keywords = tags.values().flatten().collect::<Vec<_>>();
    let mut tag_lengths = BTreeMap::new();
    for (name, keywords) in tags.iter() {
        tag_lengths.insert(name, keywords.len());
    }
    // println!("{}", all_keywords);
    // return Ok(());
    let mut scheduler = Scheduler::new();
    scheduler.every(1.seconds()).run(|| {
        post_results(&CLIENT, &queued_matches);
        queued_matches.lock().unwrap().clear();
    });
    let thread_handle = scheduler.watch_thread(Duration::from_millis(100));

    for i in 0..LIFETIME {
        let result: Vec<Domain> = get_domains(&CLIENT).await?;
        println!("Domains {:?}", result);
        // let test_domain = Domain {
        //     _id: "".to_string(),
        //     domain: "hbr.org".to_string(),
        // };
        // let result = vec![test_domain];

        fetch_all(result, &all_keywords, &tag_lengths, &queued_matches).await;
        // println!("{:?}", &all_keywords);

        let elapsed = now.elapsed()?;
        let elapsed_s = elapsed.as_millis() as f64 / 1000.0;
        println!("Completed in {:.2} sec. {} failed. {} completed.", elapsed_s, FAILED.fetch_add(0, Ordering::SeqCst), COMPLETED.fetch_add(0, Ordering::SeqCst));
    };

    // parse_out_tags("test.com".to_string(), "poppy and<style>\nNOPE\n</style> <P>NOPE2</P>pippin <STYLE>NOPE3</STYLE>Education poppy".to_string(), &all_keywords, &tag_lengths);
    println!("{:?}", queued_matches.to_owned());
    thread_handle.stop();
    // post_results(&CLIENT, &queued_matches);
    Ok(())
}

fn redirect_policy(attempt: Attempt) -> Action {
    // println!("{:?}", attempt);
    let host = attempt.url().host_str().unwrap_or("A");
    let prev_host = {
        let first = attempt.previous().first();
        match first {
            None => { "B" }
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
        attempt.error("Too many redirects")
    } else if host != prev_host {
        attempt.error("Redirected to a different hostname")
    } else { attempt.follow() }
}


async fn fetch_all<'a, 's>(domains: Vec<Domain>, all_keywords: &'a Vec<&String>, tag_lengths: &'a BTreeMap<&String, usize>, queue: &MatchQueue<'static>) {
    let fetches = futures::stream::iter(
        domains.into_iter().map(|result| {
            let send_fut = CLIENT.get("http://".to_owned() + &result.domain).send();
            // println!("REQUEST: {}", &result.domain);
            async move {
                match send_fut.await {
                    Ok(resp) => {
                        match resp.text().await {
                            Ok(text) => {
                                // println!("RESPONSE: {} bytes from {}", text.len(), &result.domain);
                                COMPLETED.fetch_add(1, Ordering::SeqCst);
                                let tags = parse_out_tags(result._id, &text, all_keywords, tag_lengths);
                                println!("FOUND {}: {:?}", result.domain, tags);
                                queue.lock().unwrap().extend(tags);
                            }
                            Err(error) => {
                                println!("ERROR reading {}: {:?}", result.domain, error);
                                let tag_match = TagMatch {
                                    id: result._id,
                                    tag: "Unreadable".to_string(),
                                    keyword: "".to_string(),
                                };
                                add_tag(tag_match);
                                FAILED.fetch_add(1, Ordering::SeqCst);
                            }
                        }
                    }
                    Err(error) => {
                        println!("ERROR downloading {}: {:?}", result.domain, error);
                        let tag_match = TagMatch {
                            id: result._id,
                            tag: "Unreadable".to_string(),
                            keyword: "".to_string(),
                        };
                        add_tag(tag_match);
                        FAILED.fetch_add(1, Ordering::SeqCst);
                    }
                }
            }
        })
    ).buffer_unordered(THREADS).collect::<Vec<()>>();
    fetches.await;
}