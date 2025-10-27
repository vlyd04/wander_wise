from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app, 
     resources={
         r"/*": {
             "origins": ["http://localhost:5173", "https://wander-wise-frontend.vercel.app"],
             "allow_headers": ["Content-Type"],
             "methods": ["GET", "POST", "OPTIONS"]
         }
     },
     supports_credentials=True
)


    from .routes.state_routes import state_bp
    from .routes.destinations import dest_bp
    from .routes.experiences import exp_bp
    from .routes.booking import booking_bp
    from .routes.opentripmap import opentrip_bp
    from .routes.chatbot import chatbot_bp  # Import the chatbot blueprint


    app.register_blueprint(state_bp)
    app.register_blueprint(dest_bp)
    app.register_blueprint(exp_bp)
    app.register_blueprint(booking_bp)
    app.register_blueprint(opentrip_bp)
    # Register chatbot blueprint
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')

    return app
