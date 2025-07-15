from flask import Blueprint, jsonify
from app.services.state_service import get_all_states, get_state_details

state_bp = Blueprint('state_routes', __name__)

@state_bp.route('/states', methods=['GET'])
def get_states():
    states = get_all_states()
    return jsonify([{ 'name': s.name } for s in states])

@state_bp.route('/state/<string:name>', methods=['GET'])
def state_detail(name):
    s = get_state_details(name)
    if s:
        return jsonify({
            'name': s.name,
            'description': s.description,
            'banner_image_url': s.banner_image_url,
            'map_url': s.map_url,
            'experiences': [{ 'id': e.id, 'name': e.name, 'description': e.description } for d in s.destinations for e in d.experiences if e]
        })
    return jsonify({ 'error': 'State not found' }), 404