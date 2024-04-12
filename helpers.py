from functools import wraps
from flask import g, request, redirect, url_for, session

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def parseQuery(cursor, data):
    if type(data) is list and len(data) > 1:
        result = []
        for i in range(len(data)):
            row = data[i]
            result.append({})
            for j in range(len(row)):
                result[i].update({cursor.description[j][0]: row[j]})
    elif data:
        result = {}
        for i in range(len(data)):
            for j in range(len(data[i])):
                result.update({cursor.description[j][0]: data[i][j]})
    else:
        return data
    return result
