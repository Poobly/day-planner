from flask import Flask, render_template, request, redirect, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash


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
