use std::collections::{BTreeMap, HashMap, HashSet};
use std::error::Error;
use reqwest::Client;
use serde_json::json;
use crate::{BATCH_SIZE, CLIENT, QUEUED_MATCHES};
use crate::config::API_URL;
use crate::types::*;

pub async fn post_results() -> Result<(), Box<dyn std::error::Error>> {
    let queue = QUEUED_MATCHES.lock().unwrap().clone();
    if queue.len() == 0 { return Ok(()); }
    let json = serde_json::to_string(&queue)?;
    CLIENT.post("http://localhost:8081/api/report").body(json).send().await?;
    Ok(())
    // println!("POST QUEUE {:?}", queue)
}

pub async fn get_tags<'a>(client: &'static reqwest::Client) -> Result<Tags, reqwest::Error> {
    let url = API_URL.to_owned() + "tags";
    println!("Fetching tags...");
    let res = client.get(url).send().await?;
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

pub async fn add_tag<'a>(tag_match: TagMatch) {
    println!("Add tag {:?}", tag_match);
}

pub async fn add_error(id: &str, error: &str) {}