use std::collections::{BTreeMap, HashSet};
use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};

pub type Tags = BTreeMap<String, Vec<String>>;
pub type MatchQueue<'a> = Arc<Mutex<HashSet<TagMatch>>>;

// #[serde(tag = "type")]
#[derive(Debug, Serialize, Deserialize, Clone)]
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

#[derive(Debug, Hash, Eq, PartialEq, Serialize, Clone)]
pub struct TagMatch {
    pub _id: String,
    pub tag: String,
    pub keyword: String,
}