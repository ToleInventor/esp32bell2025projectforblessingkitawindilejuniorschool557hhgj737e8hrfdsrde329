from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_service import db, ensure_collections_exist
from utils import get_today

app = Flask(__name__)
CORS(app)

@app.route("/init", methods=["GET"])
def init():
    ensure_collections_exist()
    return {"status": "Collections ready"}

@app.route("/events", methods=["GET"])
def get_events():
    normal = [doc.to_dict() | {"id": doc.id} for doc in db.collection("normalEvents").get()]
    special = [doc.to_dict() | {"id": doc.id} for doc in db.collection("specialEvents").get()]
    return {"normalEvents": normal, "specialEvents": special}

@app.route("/event", methods=["POST"])
def create_event():
    data = request.json
    event_type = data.get("type")
    payload = data.get("payload")
    if event_type == "normal":
        db.collection("normalEvents").add(payload)
    else:
        db.collection("specialEvents").add(payload)
    return {"status": "Created"}

@app.route("/event/<event_id>", methods=["PUT"])
def update_event(event_id):
    data = request.json
    db.collection(data["collection"]).document(event_id).update(data["update"])
    return {"status": "Updated"}

@app.route("/event/<event_id>", methods=["DELETE"])
def delete_event(event_id):
    col = request.args.get("collection")
    db.collection(col).document(event_id).delete()
    db.collection("esp32").document(f"{col}_{event_id}").delete()
    return {"status": "Deleted"}

@app.route("/sync", methods=["GET"])
def sync_events():
    today_date, today_day = get_today()

    normal_docs = db.collection("normalEvents").where("days", "array_contains", today_day).where("active", "==", True).get()
    for doc in normal_docs:
        e = doc.to_dict()
        db.collection("esp32").document(f"normal_{doc.id}").set({
            "time": e["time"], "tone": e["tone"], "delay": e.get("delay", 0)
        })

    specials = db.collection("specialEvents").where("date", "==", today_date).get()
    for doc in specials:
        e = doc.to_dict()
        db.collection("esp32").document(f"special_{doc.id}").set({
            "time": e["time"], "tone": e["tone"], "delay": 0
        })

    return {"status": "Synced"}

@app.route("/cleanup", methods=["GET"])
def cleanup():
    today_date, _ = get_today()
    expired = db.collection("specialEvents").where("date", "<", today_date).get()
    for doc in expired:
        db.collection("specialEvents").document(doc.id).delete()
        db.collection("esp32").document(f"special_{doc.id}").delete()
    return {"status": "Cleaned"}

if __name__ == "__main__":
    app.run(debug=True)
