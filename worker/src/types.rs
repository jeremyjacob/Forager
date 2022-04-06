use std::collections::{BTreeMap, HashSet};
use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};

pub type Tags = BTreeMap<String, Vec<String>>;
pub type MatchQueue<'a> = Arc<Mutex<HashSet<TagMatch>>>;

#[derive(Debug, Serialize, Deserialize)]
// #[serde(tag = "type")]
pub struct Domain {
    pub _id: String,
    pub domain: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Tag {
    pub name: String,
    pub color: String,
    pub keywords: Vec<String>,
}

#[derive(Debug, Hash, Eq, PartialEq)]
pub struct TagMatch {
    pub id: String,
    pub tag: String,
    pub keyword: String,
}