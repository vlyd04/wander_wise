from app.models.destination import Destination
from app.models.state import State
from app import db

def get_destinations_by_state(state_name):
    state = State.query.filter_by(name=state_name).first()
    return state.destinations if state else []