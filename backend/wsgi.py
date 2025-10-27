import os
import sys

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from app import create_app
from flask import jsonify

app = create_app()

@app.route('/')
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Backend API is running",
        "version": "1.0.0"
    }), 200

if __name__ == "__main__":
    app.run()