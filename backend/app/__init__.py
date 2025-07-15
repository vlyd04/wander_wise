from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app)

    from .routes.state_routes import state_bp
    from .routes.destinations import dest_bp
    from .routes.experiences import exp_bp

    app.register_blueprint(state_bp)
    app.register_blueprint(dest_bp)
    app.register_blueprint(exp_bp)

    return app
