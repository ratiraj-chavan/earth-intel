from flask import Blueprint, request, jsonify
from PIL import Image
import io

from services.soil_service import predict_soil
from services.crop_service import get_crop_recommendation

predict_bp = Blueprint("predict", __name__)

@predict_bp.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        image = Image.open(io.BytesIO(file.read())).convert("RGB")

        soil, confidence, top_2 = predict_soil(image)
        rec = get_crop_recommendation(soil)

        return jsonify({
            "prediction": soil,
            "confidence": round(confidence, 3),
            "top_2": top_2,
            "crops": rec["crops"],
            "fertilizers": rec["fertilizers"]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500