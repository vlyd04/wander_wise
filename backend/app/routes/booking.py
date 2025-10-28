import os
from flask import Blueprint, request, jsonify
from amadeus import Client, ResponseError
from decimal import Decimal
import requests
from datetime import datetime, timedelta

from dotenv import load_dotenv
from ..utils.city_codes import city_to_iata, validate_iata_code, CITY_TO_IATA
load_dotenv()

booking_bp = Blueprint('booking', __name__)

# Set your Amadeus API credentials as environment variables for security
AMADEUS_CLIENT_ID = os.getenv('AMADEUS_CLIENT_ID')
AMADEUS_CLIENT_SECRET = os.getenv('AMADEUS_CLIENT_SECRET')

# Exchange rate API key (you should store this in .env)
EXCHANGE_API_KEY = os.getenv('EXCHANGE_API_KEY')

def get_exchange_rate(from_currency='EUR', to_currency='INR'):
    """Get the current exchange rate from the ExchangeRate-API"""
    try:
        # If you have an API key, use the live API
        if EXCHANGE_API_KEY:
            url = f"https://v6.exchangerate-api.com/v6/{EXCHANGE_API_KEY}/latest/{from_currency}"
            response = requests.get(url)
            if response.ok:
                data = response.json()
                return Decimal(str(data['conversion_rates'][to_currency]))
        
        # Fallback to a recent fixed rate if API is not available
        return Decimal('89.50')  # EUR to INR (you should update this regularly)
    except Exception as e:
        print(f"Error fetching exchange rate: {e}")
        return Decimal('89.50')  # Fallback to fixed rate

amadeus = Client(
    client_id=AMADEUS_CLIENT_ID,
    client_secret=AMADEUS_CLIENT_SECRET,
    hostname='test'  # Use test environment
)

@booking_bp.route('/api/flights', methods=['POST'])
def search_flights():
    try:
        data = request.json
        print("Received request data:", data)
        
        # Get input
        from_location = data.get('from', '').strip()
        to_location = data.get('to', '').strip()
        
        # Use tomorrow's date if not provided
        default_date = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        departure_date = data.get('date', default_date)
        adults = data.get('adults', 1)

        # Input validation
        if not from_location or not to_location:
            return jsonify({'error': 'Missing required fields: from, to'}), 400

        # Convert city names to IATA codes if needed
        if not validate_iata_code(from_location):
            from_iata, from_city = city_to_iata(from_location)
            if not from_iata:
                return jsonify({
                    'error': f'Could not find airport code for "{from_location}". Please try a different city name or use IATA code.',
                    'suggestions': list(CITY_TO_IATA.keys())[:5]
                }), 400
            from_location = from_iata
        
        if not validate_iata_code(to_location):
            to_iata, to_city = city_to_iata(to_location)
            if not to_iata:
                return jsonify({
                    'error': f'Could not find airport code for "{to_location}". Please try a different city name or use IATA code.',
                    'suggestions': list(CITY_TO_IATA.keys())[:5]
                }), 400
            to_location = to_iata

        print(f"Processing flight search: {from_location} to {to_location} on {departure_date}")

        # Make sure we have IATA codes in uppercase
        from_location = from_location.upper()
        to_location = to_location.upper()
        
        print(f"Searching flights with IATA codes: {from_location} to {to_location}")
        
        # Search flights
        try:
            response = amadeus.shopping.flight_offers_search.get(
                originLocationCode=from_location,
                destinationLocationCode=to_location,
                departureDate=departure_date,
                adults=adults,
                max=5  # Limit to 5 results for faster response
            )
            
            if not response.data:
                return jsonify({
                    'error': f'No flights found from {from_location} to {to_location} on {departure_date}',
                    'message': 'Try searching for a different date or check different nearby airports'
                }), 404

            # Get current exchange rate
            exchange_rate = get_exchange_rate()
            print(f"Using EUR to INR exchange rate: {exchange_rate}")
            
            # Process flight offers
            flights = []
            for offer in response.data:
                try:
                    itinerary = offer['itineraries'][0]['segments'][0]
                    price_details = offer['price']
                    
                    # Convert price to Decimal for accurate calculation
                    price_eur = Decimal(str(price_details['total']))
                    price_inr = (price_eur * exchange_rate).quantize(Decimal('0.01'))
                    
                    flights.append({
                        'from': itinerary['departure']['iataCode'],
                        'to': itinerary['arrival']['iataCode'],
                        'departure': itinerary['departure']['at'],
                        'arrival': itinerary['arrival']['at'],
                        'airline': itinerary['carrierCode'],
                        'flightNumber': itinerary['number'],
                        'price': {
                            'EUR': str(price_eur),
                            'INR': str(price_inr)
                        },
                        'duration': itinerary.get('duration', 'N/A'),
                        'aircraft': itinerary.get('aircraft', {}).get('code', 'N/A')
                    })
                except Exception as e:
                    print(f"Error parsing flight offer: {str(e)}")
                    continue

            if not flights:
                return jsonify({'error': 'Could not process flight offers'}), 500
                
            return jsonify(flights)
            
        except ResponseError as error:
            print(f"Amadeus API error: {error}")
            return jsonify({'error': str(error)}), error.response.status_code
            
        except Exception as e:
            print(f"Unexpected error in flight search: {e}")
            return jsonify({'error': 'Internal server error'}), 500
            
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({'error': 'Invalid request data'}), 400
@booking_bp.route('/api/hotels', methods=['POST'])
def search_hotels():
    try:
        data = request.json
        print("Received hotel request data:", data)
        
        # Get and validate input
        city_input = data.get('destination', '').strip()
        check_in_date = data.get('date')
        adults = data.get('adults', 1)

        # Input validation
        if not city_input:
            return jsonify({'error': 'Missing required field: destination'}), 400

        if not check_in_date:
            return jsonify({'error': 'Missing required field: date'}), 400

        # Convert city name to IATA code if needed
        if not validate_iata_code(city_input):
            city_code, city_name = city_to_iata(city_input)
            if not city_code:
                return jsonify({
                    'error': f'Could not find city code for "{city_input}". Please try a different city name or use IATA code.',
                    'suggestions': list(CITY_TO_IATA.keys())[:5]
                }), 400
            destination = city_code
        else:
            destination = city_input.upper()

        print(f"Processing hotel search for {destination} (input: {city_input}) on {check_in_date}")

        try:
            # Step 1: Get hotels in the city
            hotels_response = amadeus.reference_data.locations.hotels.by_city.get(
                cityCode=destination
            )
            
            if not hotels_response.data:
                return jsonify({'error': f'No hotels found in {destination}'}), 404

            hotels = []
            # Step 2: For each hotel, get offers (limit to 5 hotels for performance)
            for hotel in hotels_response.data[:5]:
                hotel_id = hotel['hotelId']
                try:
                    offers_response = amadeus.shopping.hotel_offers_search.get(
                        hotelIds=hotel_id,
                        checkInDate=check_in_date,
                        adults=adults
                    )
                    
                    if offers_response.data and len(offers_response.data) > 0:
                        hotel_data = offers_response.data[0]
                        offers = hotel_data.get('offers', [])
                        
                        # Get current exchange rate
                        exchange_rate = get_exchange_rate(
                            from_currency=hotel_data.get('offers', [{}])[0].get('price', {}).get('currency', 'EUR')
                        )
                        
                        processed_offers = []
                        for offer in offers:
                            try:
                                price_details = offer.get('price', {})
                                original_currency = price_details.get('currency', 'EUR')
                                original_price = Decimal(str(price_details.get('total', '0')))
                                inr_price = (original_price * exchange_rate).quantize(Decimal('0.01'))
                                
                                processed_offers.append({
                                    'id': offer.get('id'),
                                    'price': {
                                        'original': {
                                            'amount': str(original_price),
                                            'currency': original_currency
                                        },
                                        'inr': {
                                            'amount': str(inr_price),
                                            'currency': 'INR'
                                        }
                                    },
                                    'room': {
                                        'type': offer.get('room', {}).get('type', 'Standard Room'),
                                        'description': offer.get('room', {}).get('description', {}).get('text', 'No description available'),
                                        'bedType': offer.get('room', {}).get('bedType', 'Standard'),
                                        'amenities': offer.get('room', {}).get('amenities', [])
                                    }
                                })
                            except Exception as e:
                                print(f"Error processing offer: {e}")
                                continue
                                
                        hotels.append({
                            'id': hotel_id,
                            'name': hotel.get('name', 'Unknown Hotel'),
                            'rating': hotel.get('rating', 'N/A'),
                            'address': hotel.get('address', {}).get('lines', [''])[0] if hotel.get('address') else 'Address not available',
                            'city': hotel.get('cityCode'),
                            'amenities': hotel.get('amenities', []),
                            'offers': processed_offers
                        })
                except Exception as e:
                    print(f"Error fetching offers for hotel {hotel_id}: {str(e)}")
                    continue

            if not hotels:
                return jsonify({'error': f'No available hotels found in {destination} for {check_in_date}'}), 404

            return jsonify(hotels)

        except ResponseError as error:
            print(f"Amadeus API error: {error}")
            return jsonify({'error': str(error)}), error.response.status_code

        except Exception as e:
            print(f"Unexpected error in hotel search: {e}")
            return jsonify({'error': 'Internal server error'}), 500

    except Exception as e:
        print(f"Error processing hotel request: {e}")
        return jsonify({'error': 'Invalid request data'}), 400
