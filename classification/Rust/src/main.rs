use std::error;
use rust_tokenizers::BertTokenizer;
use tch::{nn, Device};
use rust_bert::Config;
use rust_bert::distilbert::{DistilBertModelMaskedLM, DistilBertConfig, DistilBertConfigResources, DistilBertVocabResources, DistilBertModelResources};
use rust_bert::resources::{Resource, download_resource, RemoteResource, LocalResource};

fn main() -> Result<(), Box<dyn error::Error>> {
    println!("Hello, world!");
    let sequence_classification_model = ZeroShotClassificationModel::new(Default::default())?;

    let input_sentence = "Who are you voting for in 2020?";
    let input_sequence_2 = "Our online payments are temporarily out of service.";
    let candidate_labels = &["credit card processing outage"];

    let start = Instant::now();

    let output = sequence_classification_model.predict_multilabel(
        &[input_sentence, input_sequence_2],
        candidate_labels,
        None,
        128,
    );

    let duration = start.elapsed();
    println!("Time elapsed in is: {:?}", duration);
    println!("{:?}", output);
    Ok(())
}
