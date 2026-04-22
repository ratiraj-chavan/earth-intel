from utils.mappings import SOIL_INFO

def get_crop_recommendation(soil):
    info = SOIL_INFO.get(soil, {})
    return {
        "crops": info.get("crops", []),
        "fertilizers": info.get("fertilizers", [])
    }