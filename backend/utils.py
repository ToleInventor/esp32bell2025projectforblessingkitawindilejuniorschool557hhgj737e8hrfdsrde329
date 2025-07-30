from datetime import datetime

def get_today():
    now = datetime.now()
    return now.strftime("%Y-%m-%d"), now.strftime("%A")
