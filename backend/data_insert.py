# import json
# import mysql.connector

# # Connect to MySQL
# conn = mysql.connector.connect(
#     host="localhost",
#     user="newuser",
#     password="newpassword",
#     database="tourismdb"
# )
# cursor = conn.cursor()

# # Load JSON data
# with open('travel_data.json', 'r') as file:
#     data = json.load(file)

# # Insert destinations
# for destination in data['destinations']:
#     cursor.execute(
#         "INSERT INTO destinations (title, image_url, description) VALUES (%s, %s, %s)",
#         (destination['title'], destination['image_url'], destination['description'])
#     )

# # Insert experiences
# for experience in data['experiences']:
#     cursor.execute(
#         "INSERT INTO experiences (title, image_url, description) VALUES (%s, %s, %s)",
#         (experience['title'], experience['image_url'], experience['description'])
#     )

# # Commit changes
# conn.commit()

# # Close connection
# cursor.close()
# conn.close()

# print("Data inserted successfully!")
import json
import mysql.connector

# Connect to MySQL
conn = mysql.connector.connect(
    host='localhost',
    user='newuser',
    password='newpassword',
    database='tourismdb'
)
cursor = conn.cursor()

# Load JSON data
with open('travel_data.json', 'r') as file:
    data = json.load(file)

# === DESTINATIONS ===
titles_in_json = [d['title'] for d in data['destinations']]

# Delete destinations not in JSON
cursor.execute("SELECT title FROM destinations")
existing_titles = [row[0] for row in cursor.fetchall()]
for title in existing_titles:
    if title not in titles_in_json:
        cursor.execute("DELETE FROM destinations WHERE title = %s", (title,))

# Insert or update destinations
for d in data['destinations']:
    cursor.execute("""
        INSERT INTO destinations (title, image_url, description)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
            image_url = VALUES(image_url),
            description = VALUES(description)
    """, (d['title'], d['image_url'], d['description']))

# === EXPERIENCES ===
titles_in_json = [e['title'] for e in data['experiences']]

# Delete experiences not in JSON
cursor.execute("SELECT title FROM experiences")
existing_titles = [row[0] for row in cursor.fetchall()]
for title in existing_titles:
    if title not in titles_in_json:
        cursor.execute("DELETE FROM experiences WHERE title = %s", (title,))

# Insert or update experiences
for e in data['experiences']:
    cursor.execute("""
        INSERT INTO experiences (title, image_url, description)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
            image_url = VALUES(image_url),
            description = VALUES(description)
    """, (e['title'], e['image_url'], e['description']))

# Commit and close
conn.commit()
cursor.close()
conn.close()

print("✅ Data synced with JSON successfully!")
