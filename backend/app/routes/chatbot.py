from flask import Blueprint, request, jsonify
from app.chatbot.retriever import get_response
from flask_cors import CORS
from ..chatbot.retriever import get_response

chatbot_bp = Blueprint('chatbot', __name__)

# Enable CORS for the chatbot blueprint
CORS(chatbot_bp)

@chatbot_bp.route('', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    try:
        user_query = request.json.get('message', '')
        bot_response = get_response(user_query)
        return jsonify({'reply': bot_response})
    except Exception as e:
        print(f"Error in chatbot: {str(e)}")
        return jsonify({'reply': "I encountered an error. Please try asking in a different way."}), 500