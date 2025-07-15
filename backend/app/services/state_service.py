from app.models.state import State
from app.models.destination import Destination
from app import db

def get_all_states():
    return State.query.all()

def get_state_details(state_name):
    state = State.query.filter_by(name=state_name).first()
    return state