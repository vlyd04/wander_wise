# # from flask import Flask, jsonify
# # from flask_cors import CORS
# # import mysql.connector
# # from flask import send_from_directory

# # app = Flask(__name__,static_folder='static')
# # CORS(app)

# # conn = mysql.connector.connect(
# #     host="localhost",
# #     user="newuser",
# #     password="newpassword",
# #     database="tourismdb"
# # )
# # cursor = conn.cursor(dictionary=True)

# # @app.route("/api/destinations")
# # def get_destinations():
# #     cursor.execute("SELECT * FROM destinations")
# #     results = cursor.fetchall()
# #     return jsonify(results)

# # @app.route("/api/experiences")
# # def get_experiences():
# #     cursor.execute("SELECT * FROM experiences")
# #     results = cursor.fetchall()
# #     return jsonify(results)

# # @app.route('/images/<filename>')
# # def serve_image(filename):
# #     return send_from_directory('static/images', filename)

# # if __name__ == "__main__":
# #     app.run(debug=True)


# # # from flask import Flask, request, jsonify
# # # from flask_cors import CORS
# # # import requests

# # # app = Flask(__name__)
# # # CORS(app, resources={r"/*": {"origins": "*"}})

# # # # Replace with your actual Amadeus API credentials
# # # AMADEUS_CLIENT_ID = "fGgf1VfcrMIkMp8d5IlXfw3BjjvkVUJJ"
# # # AMADEUS_CLIENT_SECRET = "kOMCjFGH7ewnD8p6"

# # # def get_amadeus_token():
# # #     url = 'https://test.api.amadeus.com/v1/security/oauth2/token'
# # #     headers = {
# # #         'Content-Type': 'application/x-www-form-urlencoded'
# # #     }
# # #     data = {
# # #         'grant_type': 'client_credentials',
# # #         'client_id':AMADEUS_CLIENT_ID ,
# # #         'client_secret':AMADEUS_CLIENT_SECRET 
# # #     }

# # #     response = requests.post(url, headers=headers, data=data)
# # #     if response.status_code == 200:
# # #         return response.json().get('access_token')
    
# # #     else:
# # #         return None

# # # @app.route("/api/activities", methods=["GET"])
# # # def fetch_amadeus_activities():
# # #     latitude = request.args.get('latitude')
# # #     longitude = request.args.get('longitude')
# # #     radius = request.args.get('radius', 1)

# # #     token = get_amadeus_token()
# # #     if not token:
# # #         return jsonify({"error": "Unable to get access token"}), 500

# # #     url = "https://test.api.amadeus.com/v1/shopping/activities?latitude=441.9028&longitude=12.4964&radius=1"
# # #     headers = {
# # #         "Authorization": f"Bearer {token}",
# # #         "Accept": "application/json"
# # #     }

# # #     response = requests.get(url, headers=headers)
# # #     print("Response from Amadeus:", response.status_code, response.text)
# # #     return jsonify(response.json()), response.status_code

# # # if __name__ == "__main__":
# # #     app.run(debug=True)


from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import mysql.connector
import requests

app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}})  # ✅ Apply CORS to all routes

# Database config
DB_CONFIG = {
    'host': "localhost",
    'user': "newuser",
    'password': "newpassword",
    'database': "tourismdb"
}

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)

@app.route("/api/destinations")
def get_destinations():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM destinations")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)

@app.route("/api/experiences")
def get_experiences():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM experiences")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)




def get_wikipedia_summary(query):
    title = query.strip().title().replace(" ", "_")
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data.get("extract", "Sorry, no summary found.")
    else:
        return "Sorry, I couldn't find information about that place."

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "")
    reply = get_wikipedia_summary(user_input)
    return jsonify({"reply": reply})

@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory('static/images', filename)

if __name__ == "__main__":
    app.run(debug=True)


# from flask import Flask, jsonify, send_from_directory, request
# from flask_cors import CORS
# import mysql.connector
# import openai
# import json
# import os


# # === App Setup ===
# app = Flask(__name__, static_folder='static')
# CORS(app, resources={r"/chat": {"origins": "http://localhost:5173"}})


# # === Load OpenAI Key from .env ===
# load_dotenv()
# openai.api_key = os.getenv("OPENAI_API_KEY")
# client = OpenAI()

# # === MySQL DB Config (for /api/destinations & /api/experiences) ===
# DB_CONFIG = {
#     'host': "localhost",
#     'user': "newuser",
#     'password': "newpassword",
#     'database': "tourismdb"
# }

# def get_connection():
#     return mysql.connector.connect(**DB_CONFIG)

# # === API: Destinations from MySQL ===
# @app.route("/api/destinations")
# def get_destinations():
#     conn = get_connection()
#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM destinations")
#     results = cursor.fetchall()
#     cursor.close()
#     conn.close()
#     return jsonify(results)

# # === API: Experiences from MySQL ===
# @app.route("/api/experiences")
# def get_experiences():
#     conn = get_connection()
#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM experiences")
#     results = cursor.fetchall()
#     cursor.close()
#     conn.close()
#     return jsonify(results)

# # === Serve Images ===
# @app.route('/images/<filename>')
# def serve_image(filename):
#     return send_from_directory('static/images', filename)

# # === Load Local JSON Data for Chatbot ===
# with open('travel_data.json', 'r') as f:
#     travel_data = json.load(f)

# # === Helper: Match Destinations and Experiences from JSON ===
# def find_matches(user_input):
#     matched_dest = next(
#         (d for d in travel_data['destinations'] if d['title'].lower().split(',')[0] in user_input.lower()), 
#         None
#     )

#     matched_experiences = [
#         e for e in travel_data['experiences'] 
#         if any(word in user_input.lower() for word in e['title'].lower().split())
#     ]

#     return matched_dest, matched_experiences

# # === AI Chat Endpoint ===
# # @app.route('/chat', methods=['POST'])
# # def chat():
# #     user_input = request.json.get('message')

# #     dest, experiences = find_matches(user_input)

# #     context = ""
# #     if dest:
# #         context += f"""Destination Info:
# # Name: {dest['title']}
# # Description: {dest['description']}
# # Image: {dest['image_url']}
# # """
# #     if experiences:
# #         context += "\nExperiences:\n"
# #         for e in experiences:
# #             context += f"- {e['title']}: {e['description']}\n"

# #     if not context:
# #         context = "No direct match found in local data. Answer using general Indian tourism knowledge."

# #     prompt = f"""
# # You are a helpful Indian travel assistant. Use this data to answer the user's question.

# # Context:
# # {context}

# # User Question: {user_input}
# # """

# #     response = openai.ChatCompletion.create(
# #         model="gpt-4",
# #         messages=[
# #             {"role": "system", "content": "You help users explore Indian destinations and travel experiences."},
# #             {"role": "user", "content": prompt}
# #         ]
# #     )

# #     return jsonify({"reply": response.choices[0].message.content})



# @app.route('/chat', methods=['POST'])
# def chat():
#     user_input = request.json.get('message')

#     dest, experiences = find_matches(user_input)

#     context = ""
#     if dest:
#         context += f"""Destination Info:
# Name: {dest['title']}
# Description: {dest['description']}
# Image: {dest['image_url']}
# """
#     if experiences:
#         context += "\nExperiences:\n"
#         for e in experiences:
#             context += f"- {e['title']}: {e['description']}\n"

#     if not context:
#         context = "No direct match found in local data. Answer using general Indian tourism knowledge."

#     prompt = f"""
# You are a helpful Indian travel assistant. Use this data to answer the user's question.

# Context:
# {context}

# User Question: {user_input}
# """

#     response = client.chat.completions.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {"role": "system", "content": "You help users explore Indian destinations and travel experiences."},
#             {"role": "user", "content": prompt}
#         ]
#     )

#     reply = response.choices[0].message.content
#     return jsonify({"reply": reply})

# # === Run Server ===
# if __name__ == "__main__":
#     app.run(debug=True)
