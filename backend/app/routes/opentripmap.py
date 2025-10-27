import os
import requests
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
load_dotenv()

opentrip_bp = Blueprint('opentrip', __name__)
OPENTRIPMAP_API_KEY = os.getenv('OPENTRIPMAP_API_KEY')
BASE_URL = 'https://api.opentripmap.com/0.1/en/places'

# Get list of famous destinations (POIs) in a city or region
@opentrip_bp.route('/api/destinations', methods=['GET'])
def get_destinations():
    # Example: ?city=delhi or ?lon=77.2167&lat=28.6667
    city = request.args.get('city')
    lon = request.args.get('lon')
    lat = request.args.get('lat')
    radius = request.args.get('radius', 10000)
    if city:
        # Geocode city to get lat/lon
        geo_url = f"{BASE_URL}/geoname?name={city}&apikey={OPENTRIPMAP_API_KEY}"
        geo_resp = requests.get(geo_url)
        if geo_resp.status_code != 200:
            return jsonify({'error': 'City not found'}), 404
        geo = geo_resp.json()
        lon, lat = geo['lon'], geo['lat']
    if not lon or not lat:
        return jsonify({'error': 'Missing coordinates'}), 400
    url = f"{BASE_URL}/radius?lon={lon}&lat={lat}&radius={radius}&rate=3&format=json&apikey={OPENTRIPMAP_API_KEY}"
    resp = requests.get(url)
    if resp.status_code != 200:
        return jsonify({'error': 'Failed to fetch destinations'}), 500
    pois = resp.json()
    # Get details for top 10 POIs
    results = []
    for poi in pois[:10]:
        xid = poi['xid']
        detail_url = f"{BASE_URL}/xid/{xid}?apikey={OPENTRIPMAP_API_KEY}"
        detail_resp = requests.get(detail_url)
        if detail_resp.status_code == 200:
            detail = detail_resp.json()
            results.append({
                'name': detail.get('name'),
                'address': detail.get('address', {}),
                'kinds': detail.get('kinds'),
                'description': detail.get('wikipedia_extracts', {}).get('text', ''),
                'image': detail.get('preview', {}).get('source', ''),
                'otm_url': detail.get('otm', '')
            })
    return jsonify(results)

# Get experiences (attractions/activities) in a city or region
@opentrip_bp.route('/api/experiences', methods=['GET'])
def get_experiences():
    # Example: ?city=goa or ?lon=73.8567&lat=15.2993
    city = request.args.get('city')
    lon = request.args.get('lon')
    lat = request.args.get('lat')
    radius = request.args.get('radius', 10000)
    if city:
        geo_url = f"{BASE_URL}/geoname?name={city}&apikey={OPENTRIPMAP_API_KEY}"
        geo_resp = requests.get(geo_url)
        if geo_resp.status_code != 200:
            return jsonify({'error': 'City not found'}), 404
        geo = geo_resp.json()
        lon, lat = geo['lon'], geo['lat']
    if not lon or not lat:
        return jsonify({'error': 'Missing coordinates'}), 400
    # Use 'interesting_places' or 'cultural' or 'other' for experiences
    url = f"{BASE_URL}/radius?lon={lon}&lat={lat}&radius={radius}&kinds=interesting_places,cultural,other&rate=2&format=json&apikey={OPENTRIPMAP_API_KEY}"
    resp = requests.get(url)
    if resp.status_code != 200:
        return jsonify({'error': 'Failed to fetch experiences'}), 500
    pois = resp.json()
    results = []
    for poi in pois[:10]:
        xid = poi['xid']
        detail_url = f"{BASE_URL}/xid/{xid}?apikey={OPENTRIPMAP_API_KEY}"
        detail_resp = requests.get(detail_url)
        if detail_resp.status_code == 200:
            detail = detail_resp.json()
            results.append({
                'name': detail.get('name'),
                'address': detail.get('address', {}),
                'kinds': detail.get('kinds'),
                'description': detail.get('wikipedia_extracts', {}).get('text', ''),
                'image': detail.get('preview', {}).get('source', ''),
                'otm_url': detail.get('otm', '')
            })
    return jsonify(results)
