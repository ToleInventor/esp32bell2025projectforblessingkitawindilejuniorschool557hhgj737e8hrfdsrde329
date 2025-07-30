import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def ensure_collections_exist():
    for name in ["normalEvents", "specialEvents", "esp32"]:
        try:
            docs = db.collection(name).limit(1).get()
        except:
            db.collection(name).document("temp").set({"init": True})
            db.collection(name).document("temp").delete()
