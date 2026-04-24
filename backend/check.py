
import keras
import numpy as np

print("Keras version:", keras.__version__)

# Load your h5 model
model = keras.models.load_model(
    "models/soil_model.keras",
    compile=False
)

print("✅ Model loaded")
model.summary()

# Save in Keras 3 native format
model.save("models/soil_model.keras")
print("✅ Saved as soil_model.keras")