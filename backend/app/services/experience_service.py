from app.models.experience import Experience
from app import db

def get_all_experiences():
    return Experience.query.all()

def get_experience_details(name):
    return Experience.query.filter_by(name=name).first()