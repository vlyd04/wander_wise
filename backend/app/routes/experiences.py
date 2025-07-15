from flask import Blueprint, jsonify
from app.services.experience_service import get_all_experiences, get_experience_details

exp_bp = Blueprint('experience_routes', __name__)

@exp_bp.route('/experiences', methods=['GET'])
def get_experiences():
    exps = get_all_experiences()
    return jsonify([{ 'name': e.name } for e in exps])

@exp_bp.route('/experience/<string:name>', methods=['GET'])
def experience_detail(name):
    exp = get_experience_details(name)
    if exp:
        return jsonify({
            'name': exp.name,
            'description': exp.description,
            'banner_image_url': exp.banner_image_url,
            'destinations': [{
                'id': d.id,
                'name': d.name,
                'description': d.description,
                'image_url': d.image_url
            } for d in exp.destinations]
        })
    return jsonify({ 'error': 'Experience not found' }), 404
