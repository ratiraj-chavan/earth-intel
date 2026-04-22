import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
import json
import os
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

# ---------------- CONFIG ----------------
IMG_SIZE = 224
BATCH_SIZE = 16
EPOCHS_PHASE1 = 8
EPOCHS_PHASE2 = 10

train_dir = "dataset/train"
val_dir = "dataset/test"
output_dir = "outputs"

os.makedirs(output_dir, exist_ok=True)

# ---------------- DATA ----------------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=10,
    zoom_range=0.1,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(rescale=1./255)

train_gen = train_datagen.flow_from_directory(
    train_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=True
)

val_gen = val_datagen.flow_from_directory(
    val_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

# ---------------- SAVE LABELS ----------------
labels = list(train_gen.class_indices.keys())
with open(os.path.join(output_dir, "labels.json"), "w") as f:
    json.dump(labels, f)

print("Classes:", labels)

# ---------------- MODEL ----------------
base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

# Freeze ALL layers initially
for layer in base_model.layers:
    layer.trainable = False

# Custom head
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(64, activation='relu')(x)
x = Dropout(0.3)(x)
output = Dense(len(labels), activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output)

# ---------------- CALLBACKS ----------------
early_stop = EarlyStopping(
    monitor='val_accuracy',
    patience=3,
    restore_best_weights=True
)

checkpoint = ModelCheckpoint(
    os.path.join(output_dir, "soil_model.keras"),
    monitor='val_accuracy',
    save_best_only=True
)

lr_reduce = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.3,
    patience=2,
    min_lr=1e-6
)

callbacks = [early_stop, lr_reduce, checkpoint]

# ---------------- CLASS WEIGHTS ----------------
class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(train_gen.classes),
    y=train_gen.classes
)

class_weights = dict(enumerate(class_weights))
print("Class Weights:", class_weights)

# =========================================================
# 🚀 PHASE 1: FEATURE EXTRACTION
# =========================================================
model.compile(
    optimizer=Adam(learning_rate=1e-3),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print("\n--- PHASE 1 TRAINING ---")
model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS_PHASE1,
    callbacks=callbacks,
    class_weight=class_weights
)

# =========================================================
# 🚀 PHASE 2: FINE-TUNING
# =========================================================
for layer in base_model.layers[-50:]:
    layer.trainable = True

model.compile(
    optimizer=Adam(learning_rate=1e-5),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print("\n--- PHASE 2 FINE-TUNING ---")
model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS_PHASE2,
    callbacks=callbacks,
    class_weight=class_weights
)

# ---------------- EVALUATE ----------------
loss, acc = model.evaluate(val_gen)
print(f"\nFinal Accuracy: {acc*100:.2f}%")