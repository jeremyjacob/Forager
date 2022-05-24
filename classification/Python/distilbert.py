# Import libraries
# from comet_ml import Experiment
# import numpy as np
# import os
import pandas as pd
# import random
# import seaborn as sns
# import scikitplot as skplt
# from sklearn.metrics import accuracy_score
# from sklearn.metrics import roc_auc_score
# from sklearn.metrics import roc_curve
import tensorflow as tf
# from tensorflow.keras import backend as K
# from tensorflow.keras import initializers
from transformers import DistilBertTokenizerFast
from transformers import TFDistilBertModel, DistilBertConfig

# Import utility functions
from train_utils import batch_encode
from train_utils import focal_loss

tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')

# Load in data
X_train = pd.read_csv(
    'data/processed/unbalanced_dataset/X_train.csv')['comment_text']
X_valid = pd.read_csv(
    'data/processed/unbalanced_dataset/X_valid.csv')['comment_text']
y_train = pd.read_csv(
    'data/processed/unbalanced_dataset/y_train.csv')['isToxic']
y_valid = pd.read_csv(
    'data/processed/unbalanced_dataset/y_valid.csv')['isToxic']

# Load test data
test = pd.read_csv('data/processed/test_merged.csv')
X_test = test['comment_text']
y_test = test['isToxic']

# Check data
print('Our training data has   ', len(X_train.index), ' rows.')
print('Our validation data has ', len(X_valid.index), ' rows.')
print('Our test data has       ', len(X_test.index), ' rows.')

# Define the maximum number of words to tokenize (DistilBERT can tokenize up to 512)
MAX_LENGTH = 128


# Encode X_train
X_train_ids, X_train_attention = batch_encode(tokenizer, X_train.tolist())

# Encode X_valid
X_valid_ids, X_valid_attention = batch_encode(tokenizer, X_valid.tolist())

# Encode X_test
X_test_ids, X_test_attention = batch_encode(tokenizer, X_test.tolist())

DISTILBERT_DROPOUT = 0.2
DISTILBERT_ATT_DROPOUT = 0.2

# Configure DistilBERT's initialization
config = DistilBertConfig(dropout=DISTILBERT_DROPOUT,
                          attention_dropout=DISTILBERT_ATT_DROPOUT,
                          output_hidden_states=True)

# The bare, pre-trained DistilBERT transformer model outputting raw hidden-states
# and without any specific head on top.
distilBERT = TFDistilBertModel.from_pretrained(
    'distilbert-base-uncased', config=config)

# Make DistilBERT layers untrainable
for layer in distilBERT.layers:
    layer.trainable = False

LAYER_DROPOUT = 0.2
LEARNING_RATE = 5e-5
RANDOM_STATE = 42


def build_model(transformer, max_length=MAX_LENGTH):
    """""""""
    Template for building a model off of the BERT or DistilBERT architecture
    for a binary classification task.

    Input:
      - transformer:  a base Hugging Face transformer model object (BERT or DistilBERT)
                      with no added classification head attached.
      - max_length:   integer controlling the maximum number of encoded tokens 
                      in a given sequence.

    Output:
      - model:        a compiled tf.keras.Model with added classification layers 
                      on top of the base pre-trained model architecture.
    """""""""

    # Define weight initializer with a random seed to ensure reproducibility
    weight_initializer = tf.keras.initializers.GlorotNormal(seed=RANDOM_STATE)

    # Define input layers
    input_ids_layer = tf.keras.layers.Input(shape=(max_length,),
                                            name='input_ids',
                                            dtype='int32')
    input_attention_layer = tf.keras.layers.Input(shape=(max_length,),
                                                  name='input_attention',
                                                  dtype='int32')

    # DistilBERT outputs a tuple where the first element at index 0
    # represents the hidden-state at the output of the model's last layer.
    # It is a tf.Tensor of shape (batch_size, sequence_length, hidden_size=768).
    last_hidden_state = transformer(
        [input_ids_layer, input_attention_layer])[0]

    # We only care about DistilBERT's output for the [CLS] token,
    # which is located at index 0 of every encoded sequence.
    # Splicing out the [CLS] tokens gives us 2D data.
    cls_token = last_hidden_state[:, 0, :]

    ##                                                 ##
    ## Define additional dropout and dense layers here ##
    ##                                                 ##

    # Define a single node that makes up the output layer (for binary classification)
    output = tf.keras.layers.Dense(1,
                                   activation='sigmoid',
                                   kernel_initializer=weight_initializer,
                                   kernel_constraint=None,
                                   bias_initializer='zeros'
                                   )(cls_token)

    # Define the model
    model = tf.keras.Model([input_ids_layer, input_attention_layer], output)

    # Compile the model
    model.compile(tf.keras.optimizers.Adam(lr=LEARNING_RATE),
                  loss=focal_loss(),
                  metrics=['accuracy'])

    return model


EPOCHS = 6
BATCH_SIZE = 64
NUM_STEPS = len(X_train.index) // BATCH_SIZE

# Train the model
train_history1 = model.fit(
    x=[X_train_ids, X_train_attention],
    y=y_train.to_numpy(),
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    steps_per_epoch=NUM_STEPS,
    validation_data=([X_valid_ids, X_valid_attention], y_valid.to_numpy()),
    verbose=2
)

# Unfreeze and recompile
FT_EPOCHS = 4
BATCH_SIZE = 64
NUM_STEPS = len(X_train.index)

# Unfreeze distilBERT layers and make available for training
for layer in distilBERT.layers:
    layer.trainable = True

# Recompile model after unfreezing
model.compile(optimizer=tf.keras.optimizers.Adam(lr=2e-5),
              loss=focal_loss(),
              metrics=['accuracy'])

# Train the model
train_history2 = model.fit(
    x=[X_train_ids, X_train_attention],
    y=y_train.to_numpy(),
    epochs=FT_EPOCHS,
    batch_size=BATCH_SIZE,
    steps_per_epoch=NUM_STEPS,
    validation_data=([X_valid_ids, X_valid_attention], y_valid.to_numpy()),
    verbose=2
)
