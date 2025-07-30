import os
import json
from flask import Flask, jsonify
from firebase_admin import credentials, initialize_app, firestore

# 🔐 Load Firebase credentials from Vercel environment variable
service_account_info = json.loads(os.environ["FIREBASE_SERVICE_ACCOUNT"])
cred = credentials.Certificate(service_account_info)
default_app = initialize_app(cred)

# 🔥 Firestore client
db = firestore.client()

# 🚀 Create Flask app
app = Flask(__name__)

# 🛣 Example route
@app.route("/")
def index():
    return jsonify({"message": "Smart Bell backend is running!"})

# 🔍 Example Firestore read (adapt or remove if not needed)
@app.route("/events")
def get_events():
    events_ref = db.collection("events")
    docs = events_ref.stream()
    return jsonify([{doc.id: doc.to_dict()} for doc in docs])

# 🧪 If you're running locally
if __name__ == "__main__":
    app.run(debug=True)
