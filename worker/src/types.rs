use std::collections::{BTreeMap};
use serde::{Deserialize, Serialize};

pub type Tags = BTreeMap<String, Vec<String>>;

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

#[derive(Debug)]
pub struct TagMatch<'a> {
    pub tag: &'a String,
    pub keyword: &'a String,
}