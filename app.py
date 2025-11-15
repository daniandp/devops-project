from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)
app.secret_key = "your-secret-key"

@app.route("/")
def index():
    return "Welcome! <a href='/login'>Login</a>"

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        # Here you would normally check username/password
        if username == "admin" and password == "password":
            return "Logged in successfully"
        else:
            return "Invalid credentials"
    return '''
        <form method="post">
            Username: <input type="text" name="username"><br>
            Password: <input type="password" name="password"><br>
            <input type="submit" value="Login">
        </form>
    '''

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
