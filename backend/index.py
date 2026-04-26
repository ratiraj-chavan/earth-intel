import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from flask import Flask
from flask_cors import CORS
from routes.predict import predict_bp
from services.soil_service import get_model  # pre-warm on startup

app = Flask(__name__)
CORS(app)
app.register_blueprint(predict_bp)

# Pre-load model at startup, not on first request
get_model()

@app.route("/")
def home():
    return {"message": "API Running", "status": "warm"}

@app.route("/health")
def health():
    try:
        m = get_model()
        return {"status": "ok", "model_loaded": m is not None}, 200
    except Exception as e:
        return {"status": "error", "detail": str(e)}, 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)