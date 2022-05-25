use crate::config::API_URL;
use crate::types::*;
use crate::{BATCH_SIZE, CLIENT, DOMAINS, MAX_REDIRECTS, QUEUED_MATCHES};
use reqwest::{Client};
use std::collections::{BTreeMap, BTreeSet};
use std::time::Duration;
use clokwerk::{AsyncScheduler, TimeUnits};
use reqwest::redirect::{Action, Attempt};


pub fn start_scheduler() {
    let mut scheduler = AsyncScheduler::new();
    scheduler.every(1.seconds()).run(async || {
        post_results().await;
    });
    tokio::spawn(async move {
        loop {
            scheduler.run_pending().await;
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
    });
}


pub async fn post_results() -> () {
    let queue = QUEUED_MATCHES.lock().unwrap().clone();
    QUEUED_MATCHES.lock().unwrap().clear();

    if queue.len() == 0 { return; }
    // println!("POST QUEUE {:?}", queue);
    println!("POST QUEUE {:?}", queue.len());
    CLIENT
        .post(API_URL.to_owned() + "report")
        .json(&queue)
        .send()
        .await
        .unwrap();
}

pub async fn get_tags<'a>(client: &'static reqwest::Client) -> Result<Tags, reqwest::Error> {
    let url = API_URL.to_owned() + "tags";
    println!("Fetching tags...");
    let res = client.get(url).send().await?;
    if res.status() != 200 {
        panic!("Fetch tags request status {}", res.status())
    }
    let tags = res.json::<Vec<Tag>>().await?;
    let mut hashmap = BTreeMap::new();
    for tag in tags {
        hashmap.insert(tag.name, tag.keywords);
    }
    Ok(hashmap)
}

pub async fn get_domains(client: &Client) -> Result<Vec<Domain>, reqwest::Error> {
    let url = API_URL.to_owned() + &*format!("scrape?limit={}", BATCH_SIZE);
    println!("Fetching domains...");
    let res = client.get(url).send().await?;
    Ok(res.json::<Vec<Domain>>().await?)
}

pub fn add_match(snippet_match: SnippetMatch) {
    // println!("Add tag {:?}", tag_match);
    QUEUED_MATCHES.lock().unwrap().insert(snippet_match);
}

pub fn redirect_policy(attempt: Attempt) -> Action {
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
                    snippets: BTreeSet::new(),
                };
                add_match(tag_match);
            }
        }
        attempt.error("Too many redirects")
    } else if host != prev_host {
        attempt.error("Redirected to a different hostname")
    } else {
        attempt.follow()
    }
}