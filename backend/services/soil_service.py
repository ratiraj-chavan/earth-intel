import tensorflow as tf
import numpy as np
import json
from utils.preprocess import preprocess_image

MODEL_PATH = "models/soil_model.keras"
LABELS_PATH = "models/labels.json"

model = tf.keras.models.load_model(MODEL_PATH)

with open(LABELS_PATH) as f:
    labels = json.load(f)


def predict_soil(image):
    processed = preprocess_image(image)
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