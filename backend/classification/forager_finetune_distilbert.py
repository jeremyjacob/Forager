import json
from transformers import AutoModelForSequenceClassification
from transformers import AutoTokenizer
from transformers import AutoConfig
import torch
# import time
import sys

# Load DistilBERT tokenizer and tokenize (encode) the texts
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

root_dir = "."

# Set the device automatically (GPU or CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define model config
config = AutoConfig.from_pretrained(f"{root_dir}/models/distilbert-forager",
                                    # label2id=label2id,
                                    # id2label=id2label
                                    )

# Load model from file and move to GPU
model = AutoModelForSequenceClassification.from_pretrained(
    f"{root_dir}/models/distilbert-forager", config=config).to(device)


def inference(data):
    inputs = tokenizer(data,
                       padding=True,
                       truncation=True,
                       return_tensors="pt").to(
                           device)  # Move the tensor to the GPU

    # start = time.time()
    # Inference model and get logits
    outputs = model(**inputs)
    # print(f"model() {(time.time() - start) / 1000}ms")

    predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
    return [p[1].item() for p in predictions]


def main():
    while True:
        data = input('')  # get string from node process
        data = json.loads(data)
        output = inference(data)
        sys.stdout.write(json.dumps(output))
        sys.stdout.flush()


if __name__ == "__main__":
    main()
