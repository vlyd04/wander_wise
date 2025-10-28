import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://newuser:newpassword@localhost/tourismdb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    AMADEUS_CLIENT_ID = os.getenv('AMADEUS_CLIENT_ID')
    AMADEUS_CLIENT_SECRET = os.getenv('AMADEUS_CLIENT_SECRET')
    DEBUG = True
