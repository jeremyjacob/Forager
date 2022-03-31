use std::borrow::{Borrow, Cow};
use std::collections::{BTreeMap, HashMap};
use std::fmt::format;
use reqwest::{Client, header};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::time::{Duration, SystemTime};
use futures::stream::StreamExt;
use reqwest::redirect::{Action, Attempt, Policy};

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


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let now = SystemTime::now();

    let mut headers = header::HeaderMap::new();
    headers.insert(header::AUTHORIZATION, header::HeaderValue::from_static(API_KEY));
    let client = Client::builder()
        .connect_timeout(Duration::from_secs(TIMEOUT))
        .default_headers(headers)
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0. 4844.82 Safari/537.36")
        .redirect(Policy::custom(redirect_policy))
        .build()?;
    let tags = get_tags(&client).await?;
    let all_keywords = tags.values().flatten().collect::<Vec<_>>();
    let mut tag_lengths = BTreeMap::new();
    for (name, keywords) in tags.iter() {
        tag_lengths.insert(name, keywords.len());
    }
    // println!("{}", all_keywords);
    // return Ok(());

    for i in 0..LIFETIME {
        // let result: Vec<Domain> = get_domains(&client).await?;
        let test_domain = Domain {
            _id: "".to_string(),
            domain: "hbr.org".to_string(),
        };
        let result = vec![test_domain];

        fetch(&client, result, &all_keywords, &tag_lengths).await;

        let elapsed = now.elapsed()?;
        let elapsed_s = elapsed.as_millis() as f64 / 1000.0;
        println!("Completed in {:.2} sec. {} failed. {} completed.", elapsed_s, FAILED.fetch_add(0, Ordering::SeqCst), COMPLETED.fetch_add(0, Ordering::SeqCst));
    };

    // parse_out_tags("test.com".to_string(), "poppy and<style>\nNOPE\n</style> <P>NOPE2</P>pippin <STYLE>NOPE3</STYLE>Education poppy".to_string(), &all_keywords, &tag_lengths);

    Ok(())
}

fn redirect_policy(attempt: Attempt) -> Action {
    // println!("{:?}", attempt);
    if attempt.previous().len() >= MAX_REDIRECTS {
        add_error("", "Too many redirects");
        attempt.error("Too many redirects")
        // } else if attempt.url().host_str() == Some("example.domain") {
        //     // prevent redirects to 'example.domain'
        //     attempt.stop()
    } else { attempt.follow() }
}


async fn fetch(client: &Client, domains: Vec<Domain>, all_keywords: &Vec<&String>, tag_lengths: &BTreeMap<&String, usize>) {
    let fetches = futures::stream::iter(
        domains.into_iter().map(|result| {
            let send_fut = client.get("http://".to_owned() + &result.domain).send();
            println!("REQUEST: {}", &result.domain);
            async move {
                match send_fut.await {
                    Ok(resp) => {
                        match resp.text().await {
                            Ok(text) => {
                                println!("RESPONSE: {} bytes from {}", text.len(), &result.domain);
                                COMPLETED.fetch_add(1, Ordering::SeqCst);
                                parse_out_tags(result.domain, text, all_keywords, tag_lengths);
                            }
                            Err(error) => {
                                println!("ERROR reading {}: {:?}", result.domain, error);
                                add_tag(&result._id, "Unreadable");
                                FAILED.fetch_add(1, Ordering::SeqCst);
                            }
                        }
                    }
                    Err(error) => {
                        println!("ERROR downloading {}: {:?}", result.domain, error);
                        add_tag(&result._id, "Unreachable");
                        FAILED.fetch_add(1, Ordering::SeqCst);
                    }
                }
            }
        })
    ).buffer_unordered(THREADS).collect::<Vec<()>>();
    fetches.await;
    println!("fetches awaited")
}