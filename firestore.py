import json
import os
from base64 import b64decode
from unittest.mock import MagicMock

def get_firestore_db():
    firebase_config = os.getenv("FIREBASE")
    if not firebase_config:
        print("Notice: FIREBASE env var not set, using fallback storage.")
        return MagicMock()
    
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore
        if not firebase_admin._apps:
            firebase_dict = json.loads(b64decode(firebase_config))
            cred = credentials.Certificate(firebase_dict)
            firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        print("Firebase init error, using fallback:", e)
        return MagicMock()

