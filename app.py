import sqlite3
from flask import Flask, render_template, request, redirect, session, make_response, send_from_directory
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import date

from helpers import login_required, parseQuery

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

conn = sqlite3.connect("planner.db", isolation_level=None, check_same_thread=False)
conn.row_factory = sqlite3.Row
db = conn.cursor()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        session.clear()
        username = request.form.get("username")
        password = request.form.get("password")
        if not username:
            return
        elif not password:
            return
        elif request.form.get("confirmation") != password:
            return
        
        rows = parseQuery(db, db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchall())
        if len(rows) > 0:
            return render_template("register.html", username_taken=True)
        
        hash = generate_password_hash(password)
        db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", (username, hash))
        session["user_id"] = parseQuery(db, db.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone())["id"]
        return render_template("profile.html")
    else:
        return render_template("register.html")
    

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        session.clear()
        if not username:
            return
        elif not password:
            return
        
        user = parseQuery(db, db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone())
        if user["username"] != username or not check_password_hash(user["hash"], password):
            return

        session["user_id"] = user["id"]
        
        return render_template("profile.html")
    else:
        return render_template("login.html")

@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    user_id = session["user_id"]
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("profile.html")

@app.route("/planner", methods=["GET", "POST"])
@app.route("/planner/calendar", methods=["GET", "POST"])
@login_required
def planner():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("planner/calendar.html")
    
@app.route("/planner/edit", methods=["GET", "POST"])
@login_required
def planner_edit():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("planner/edit.html")

@app.route("/pomodoro", methods=["GET", "POST"])
@app.route("/pomodoro/timer", methods=["GET", "POST"])
@login_required
def pomodoro():
    if request.method == "POST":
        data = request.get_json()
        current_date = date.today().isoformat()
         
        if parseQuery(db, db.execute("SELECT COUNT(1) FROM pomodoro_details WHERE date = ?", (current_date,)).fetchall())["COUNT(1)"]:
            print(parseQuery(db, db.execute("SELECT COUNT(1) FROM pomodoro_details WHERE date = ?", (current_date,)).fetchall())["COUNT(1)"])
            db.execute("""
                       UPDATE pomodoro_details 
                       SET count = ?
                       WHERE date = ? AND id in (SELECT pomodoro_id FROM pomodoros WHERE user_id = ?) 
                       """, (data[current_date], current_date, session["user_id"],))
        else:
            db.execute("""
                       INSERT INTO pomodoro_details (date, count)
                       VALUES (?, ?)
                       """, (current_date, data[current_date],))
            pomodoro_id = db.lastrowid
            db.execute("""
                       INSERT INTO pomodoros (user_id, pomodoro_id) 
                       VALUES (?, ?)
                       """, (session["user_id"], pomodoro_id,))
        return data, 201
    # elif request.method == "GET":

    #     # Get data from database
    #     data = parseQuery(db, db.execute("SELECT * FROM users WHERE username = ?", (user,)).fetchone())
    #     # return data
    else:
        return render_template("pomodoro/timer.html")
        
@app.route("/pomodoro/progress", methods=["GET", "POST"])
@login_required
def pomodoro_progress():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("pomodoro/progress.html")
    


@app.route("/logout")
def logout():
    session.clear()

    return redirect("/")



@app.route("/api/data", methods=["GET", "POST"])
def data():
    data = request.get_json()
    print(data)
    return data