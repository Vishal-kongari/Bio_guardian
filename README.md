from flask import Flask, request, jsonify
import cv2
import numpy as np
import tensorflow as tf
import os
from pymongo import MongoClient
from PIL import Image

# Load pre-trained AI model for species classification
MODEL_PATH = "model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Initialize Flask app
app = Flask(__name__)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["wildlife"]
collection = db["species"]

# Define function to classify species
def classify_species(image_path):
    image = Image.open(image_path).resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    predictions = model.predict(image_array)
    species = "Unknown"  # Placeholder for actual mapping
    status = "Not Endangered" if predictions[0][0] < 0.5 else "Endangered"
    return species, status

# API Endpoint for image classification
@app.route("/classify", methods=["POST"])
def classify():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)
    species, status = classify_species(file_path)
    collection.insert_one({"species": species, "status": status})
    return jsonify({"species": species, "status": status})

# Run the Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
