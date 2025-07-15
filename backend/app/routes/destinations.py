from flask import Blueprint, jsonify
from app.services.destination_services import get_destinations_by_state

dest_bp = Blueprint('destination_routes', __name__)

@dest_bp.route('/destinations/state/<string:state_name>', methods=['GET'])
def destinations_by_state(state_name):
    dests = get_destinations_by_state(state_name)
    return jsonify([{
        'id': d.id,
        'name': d.name,
        'description': d.description,
        'image_url': d.image_url
    } for d in dests])