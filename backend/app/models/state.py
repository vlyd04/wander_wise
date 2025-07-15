from app import db

class State(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    banner_image_url = db.Column(db.String(255))
    map_url = db.Column(db.String(255))

    destinations = db.relationship('Destination', backref='state', lazy=True)