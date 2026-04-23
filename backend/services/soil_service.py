import tensorflow as tf
import numpy as np
import json
from utils.preprocess import preprocess_image
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

MODEL_PATH = "models/soil_model.h5"
LABELS_PATH = "models/labels.json"

model = None

def get_model():
    global model
    if model is None:
        model = tf.keras.models.load_model(MODEL_PATH)
    return model

with open(LABELS_PATH) as f:
    labels = json.load(f)


def predict_soil(image):
    processed = preprocess_image(image)
    model = get_model()
    preds = model.predict(processed)[0]

    top_index = np.argmax(preds)
    predicted_class = labels[top_index]
    confidence = float(preds[top_index])

    top_indices = preds.argsort()[-2:][::-1]

    top_2 = [
        {"class": labels[i], "confidence": float(preds[i])}
        for i in top_indices
    ]

    return predicted_class, confidence, top_2