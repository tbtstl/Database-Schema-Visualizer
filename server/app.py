from flask import Flask, jsonify, request
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/connect", methods=["POST"])
def connect():
  data = request.get_json()
  host = data.get('host', 'localhost')
  db_name = data.get('dbName')
  username = data.get('username', 'root')
  password = data.get('password', 'password')

  if not all((host, db_name, username, password)):
    response = {'error': 'Host, database name, username, and password are all required.'}
    return jsonify(**response)

  response = {'data': data}
  return jsonify(**response)

if __name__ == "__main__":
    app.run(port=5001)
