from app import db

destination_experience = db.Table('destination_experience',
    db.Column('destination_id', db.Integer, db.ForeignKey('destination.id')),
    db.Column('experience_id', db.Integer, db.ForeignKey('experience.id'))
)

class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    banner_image_url = db.Column(db.String(255))

    destinations = db.relationship('Destination', secondary=destination_experience, backref='experiences')