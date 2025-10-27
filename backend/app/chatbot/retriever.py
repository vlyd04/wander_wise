import json
from datetime import datetime
from ..routes.opentripmap import get_destinations
from ..routes.booking import search_flights, search_hotels

def load_travel_data():
    try:
        with open('travel_data.json', 'r') as f:
            return json.load(f)
    except:
        return {}

def get_response(user_query):
    query = user_query.lower().strip()
    
    # Handle greetings
    if any(word in query for word in ['hi', 'hello', 'hey']):
        return "Hello! I can help you with information about tourist spots, hotels, and flights. What would you like to know?"

    # Handle location-based queries
    locations = ['kerala', 'delhi', 'mumbai', 'jaipur', 'goa']
    for location in locations:
        if location in query:
            if 'hotel' in query:
                try:
                    hotels = search_hotels(location)
                    return f"Here are some hotels in {location.title()}: {hotels}"
                except:
                    return f"I can help you find hotels in {location.title()}. Please specify your check-in date and budget."
            
            if any(word in query for word in ['spot', 'place', 'visit', 'tourist']):
                try:
                    destinations = get_destinations(city=location)
                    return f"Popular places to visit in {location.title()}: {destinations}"
                except:
                    return f"I can show you popular tourist spots in {location.title()}. Would you like to know about specific attractions?"

            if 'flight' in query:
                return f"I can help you book flights to {location.title()}. Please provide your departure city and travel dates."

    # Handle experience-based queries
    if 'houseboat' in query and 'kerala' in query:
        return "Kerala's houseboats offer a unique experience in the backwaters. You can enjoy traditional Kerala cuisine, overnight stays, and beautiful views of villages and nature. Would you like help booking a houseboat tour?"

    # Default response with suggestion
    return "I can help you with:\n- Finding tourist spots in any city\n- Booking hotels\n- Checking flights\n- Information about local experiences\nPlease ask about any of these topics!"