import os
from app import create_app
from flask_cors import CORS

app = create_app()
CORS(app)  # Enable CORS for all routes

if __name__ == "__main__":
    # Use environment variables with defaults for flexibility
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")  # Allow external connections
    debug = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
    
    app.run(
        host=host,
        port=port,
        debug=debug
    )


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
