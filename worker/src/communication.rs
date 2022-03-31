use std::collections::{BTreeMap, HashMap};
use reqwest::Client;
use crate::BATCH_SIZE;
use crate::config::API_URL;
use crate::types::*;

pub async fn get_tags(client: &Client) -> Result<Tags, reqwest::Error> {
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
    let url = API_URL.to_owned() + &*format!("results?limit={}&scrapable=1&stripped=1", BATCH_SIZE);
    println!("Fetching domains...");
    let res = client.get(url).send().await?;
    Ok(res.json::<Vec<Domain>>().await?)
}

pub async fn add_tag<'a>(id: &String, tag_match: TagMatch<'a>) {
    // println!("Add tag {} to {}", tag, id);
}

pub async fn add_error(id: &str, error: &str) {}