#![feature(async_closure)]
#![feature(iter_advance_by)]

//
use reqwest::header::HeaderMap;
use reqwest::{header, Client};
use static_init::dynamic;
use std::collections::{BTreeMap, BTreeSet, HashSet};
use std::sync::{Arc, Mutex};
use std::time::{Duration, SystemTime};

use crate::communication::*;
use crate::config::*;
use crate::parsing::{fetch_all};
use crate::types::*;
use std::env;
use reqwest::redirect::Policy;

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
    let tags = "checkout, payment, card, processor, processing, order, apologize, sorry, paypal, accept, contact us, purchase";
    let keywords = tags.split(", ").collect::<Vec<&str>>();

    start_scheduler();

    println!("Scraping...");
    for i in 0..LIFETIME {
        let now = SystemTime::now();
        let result: Vec<Domain> = get_domains(&CLIENT).await?;
        // let result: Vec<Domain> = vec![Domain { _id: "623b6ee34ce636977ebe9698".to_string(), domain: "kratomforsale.us".to_string() }];
        DOMAINS.lock().unwrap().clone_from(&result);

        fetch_all(result, &keywords).await;
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
    post_results().await;
    // tokio::time::sleep(Duration::from_secs(5)).await;
    Ok(())
}