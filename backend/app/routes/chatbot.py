from flask import Blueprint, request, jsonify
from chatbot.retriever import get_response

chatbot_bp=Blueprint('chatbot',__name__)

@chatbot_bp.route('/',methods=['POST'])
def chat():
    user_query=request.json.get('message')
    response=get_response(user_query)
    return jsonify({"reply":response})