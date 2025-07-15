from flask import Blueprint,request,jsonify
from backend.models.user_model import generate_itinerary

itinerary_bp=Blueprint('itinerary',__name__)

@itinerary_bp.route('/',methods=['POST'])
def create_itinerary():
    user_input=request.get_json()
    return jsonify(generate_itinerary(user_input))
