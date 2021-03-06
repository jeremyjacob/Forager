use std::collections::{BTreeMap, BTreeSet, HashSet};
use std::hash::Hash;
use std::sync::{Arc, Mutex};
use serde::{Deserialize, Serialize};

pub type Tags = BTreeMap<String, Vec<String>>;
pub type MatchQueue<'a> = Arc<Mutex<HashSet<SnippetMatch>>>;

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

#[derive(Debug, Eq, Hash, PartialEq, Serialize, Clone)]
pub struct SnippetMatch {
    pub _id: String,
    pub snippets: BTreeSet<String>,
}