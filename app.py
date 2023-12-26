from flask import Flask, render_template, request, redirect, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import login_required

app = Flask(__name__)
Session(app)


@app.route("/")
def index():

    return render_template("index.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("register.html")
    

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("login.html")

@app.route("/profile", methods=["GET", "POST"])
def profile():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("profile.html")

@app.route("/planner", methods=["GET", "POST"])
def planner():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("planner/planner.html")

@app.route("/planner/calendar", methods=["GET", "POST"])
def planner_calendar():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("planner/calendar.html")
    
@app.route("/planner/edit", methods=["GET", "POST"])
def planner_edit():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("planner/edit.html")

@app.route("/pomodoro", methods=["GET", "POST"])
def pomodoro():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("pomodoro/pomodoro.html")
        
@app.route("/pomodoro/progress", methods=["GET", "POST"])
def pomodoro_progress():
    if request.method == "POST":
        return redirect("/")
    else:
        return render_template("pomodoro/progress.html")

