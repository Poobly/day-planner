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
        result = {}
        if type(data) is list:
            for row in data:
                for i in range(len(row)):
                    result.update({cursor.description[i][0]: row[i]})
        else:
            for i in range(len(data)):
                result.update({cursor.description[i][0]: data[i]})
        return result