use crate::config::API_URL;
use crate::types::*;
use crate::{BATCH_SIZE, CLIENT, QUEUED_MATCHES};
use reqwest::Client;
use std::collections::BTreeMap;

pub async fn post_results() -> Result<(), Box<dyn std::error::Error>> {
    let queue = QUEUED_MATCHES.lock().unwrap().clone();
    if queue.len() == 0 {
        return Ok(());
    }
    println!("POST QUEUE {:?}", queue.len());
    // let json = serde_json::to_string(&queue)?;
    println!("POST QUEUE {:?}", queue.len());
    CLIENT
        .post(API_URL.to_owned() + "report")
        .json(&queue)
        .send()
        .await?;
    Ok(())
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
