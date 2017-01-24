from flask import Flask, jsonify, request, Response
import json

from helpers import crossdomain

app = Flask(__name__)

MT_JSON = 'application/json'

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/connect", methods=["POST", "OPTIONS"])
@crossdomain(origin='http://localhost:5000')
def connect():
  data = json.loads(request.data.decode("utf-8"))
  host = data.get('host', 'localhost')
  db_name = data.get('dbName')
  username = data.get('username', 'root')
  password = data.get('password', 'password')

  if not all((host, db_name, username, password)):
    response = {'error': 'Host, database name, username, and password are all required.'}
    response_json = json.dumps(response)
    return Response(response_json, status=400, mimetype=MT_JSON)

  response = {'data': data}
  return jsonify(**response), 200

if __name__ == "__main__":
    app.run(port=5001)
