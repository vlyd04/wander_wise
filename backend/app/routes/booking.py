import os
from flask import Blueprint, request, jsonify
from amadeus import Client, ResponseError

from dotenv import load_dotenv
load_dotenv()

booking_bp = Blueprint('booking', __name__)

# Set your Amadeus API credentials as environment variables for security
AMADEUS_CLIENT_ID = os.getenv('AMADEUS_CLIENT_ID')
AMADEUS_CLIENT_SECRET = os.getenv('AMADEUS_CLIENT_SECRET')

amadeus = Client(
    client_id=AMADEUS_CLIENT_ID,
    client_secret=AMADEUS_CLIENT_SECRET
)

@booking_bp.route('/api/flights', methods=['POST'])
def search_flights():
    data = request.json
    from_city = data.get('from')
    to_city = data.get('to')
    departure_date = data.get('date', '2025-08-12')
    adults = data.get('adults', 1)
    print("Received flight search:", from_city, to_city)
    # Validate input
    if not from_city or not to_city:
        return jsonify({'error': 'Missing required fields: from, to'}), 400
    if len(from_city) != 3 or len(to_city) != 3:
        return jsonify({'error': 'from and to must be IATA codes (3 letters)'}), 400

    try:
        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode=from_city.upper(),
            destinationLocationCode=to_city.upper(),
            departureDate=departure_date,
            adults=adults
        )
        offers = response.data
        print("Amadeus response:", offers)
        if not offers or not isinstance(offers, list):
            return jsonify({'error': 'No flights found for the given criteria.'}), 404
        flights = []
        for offer in offers:
            try:
                itinerary = offer['itineraries'][0]['segments'][0]
                flights.append({
                    'from': itinerary['departure']['iataCode'],
                    'to': itinerary['arrival']['iataCode'],
                    'departure': itinerary['departure']['at'],
                    'arrival': itinerary['arrival']['at'],
                    'airline': itinerary['carrierCode'],
                    'flightNumber': itinerary['number'],
                    'price': offer['price']['total']
                })
            except Exception as e:
                print("Error parsing offer:", offer, e)
        if not flights:
            return jsonify({'error': 'No valid flight offers found.'}), 404
        return jsonify(flights)
    except ResponseError as error:
        print("Amadeus API error:", error)
        return jsonify({'error': str(error)}), 500
    except Exception as e:
        print("Unexpected error:", e)
        return jsonify({'error': 'Unexpected server error.'}), 500

@booking_bp.route('/api/hotels', methods=['POST'])
def search_hotels():
    data = request.json
    destination = data.get('destination')
    date = data.get('date')
    try:
        # Step 1: Get hotels in the city
        hotels_response = amadeus.reference_data.locations.hotels.by_city.get(cityCode=destination)
        hotels_data = hotels_response.data
        hotels = []
        # Step 2: For each hotel, get offers
        for hotel in hotels_data[:5]:  # Limit to 5 hotels for demo/performance
            hotel_id = hotel['hotelId']
            try:
                offers_response = amadeus.shopping.hotel_offers_search.get(hotelIds=hotel_id, checkInDate=date, adults=1)
                offers = offers_response.data[0]['offers'] if offers_response.data and 'offers' in offers_response.data[0] else []
            except Exception:
                offers = []
            hotels.append({
                'name': hotel.get('name'),
                'address': hotel.get('address', {}).get('lines', [''])[0] if hotel.get('address') else '',
                'city': hotel.get('cityCode'),
                'offers': offers,
            })
        return jsonify(hotels)
    except ResponseError as error:
        return jsonify({'error': str(error)}), 500
