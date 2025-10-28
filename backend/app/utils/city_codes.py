"""Utility functions for city name to IATA code conversion"""

# Common Indian cities and their IATA codes
CITY_TO_IATA = {
    # Major cities
    'mumbai': 'BOM',
    'delhi': 'DEL',
    'bangalore': 'BLR',
    'bengaluru': 'BLR',
    'chennai': 'MAA',
    'kolkata': 'CCU',
    'hyderabad': 'HYD',
    'ahmedabad': 'AMD',
    'pune': 'PNQ',
    'goa': 'GOI',
    # Tourist destinations
    'jaipur': 'JAI',
    'udaipur': 'UDR',
    'varanasi': 'VNS',
    'kochi': 'COK',
    'thiruvananthapuram': 'TRV',
    'trivandrum': 'TRV',
    'srinagar': 'SXR',
    'leh': 'IXL',
    'port blair': 'IXZ',
    'andaman': 'IXZ',
    # International hubs
    'dubai': 'DXB',
    'singapore': 'SIN',
    'london': 'LHR',
    'new york': 'JFK',
    'paris': 'CDG',
    'bangkok': 'BKK',
}

def city_to_iata(city_name):
    """
    Convert a city name to its IATA code.
    Args:
        city_name (str): Name of the city
    Returns:
        tuple: (iata_code, matched_city) or (None, None) if not found
    """
    if not city_name:
        return None, None
        
    # If it's already an IATA code, validate and return it
    if len(city_name) == 3 and city_name.isalpha():
        return city_name.upper(), None
        
    # Clean input: lowercase and remove extra spaces
    city_name = ' '.join(city_name.lower().split())
    
    # Direct lookup
    if city_name in CITY_TO_IATA:
        return CITY_TO_IATA[city_name], city_name

    # Try partial matches
    for known_city, code in CITY_TO_IATA.items():
        if city_name in known_city or known_city in city_name:
            return code, known_city
            
    return None, None

def validate_iata_code(code):
    """
    Check if a string is a valid IATA code.
    Args:
        code (str): The code to validate
    Returns:
        bool: True if valid IATA code, False otherwise
    """
    if not code:
        return False
    return len(code) == 3 and code.isalpha() and code.isupper()