import keras

model = keras.models.load_model("backend/models/soil_model.keras", compile=False)
model.save("backend/models/soil_model.h5")