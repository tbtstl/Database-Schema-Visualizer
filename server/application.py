import json
from _mysql import Error

from flask import Flask, jsonify, request, Response
from flask import g

from db import MySQL
from helpers import crossdomain, error_response, get_columns_for_table

app = Flask(__name__)

MT_JSON = 'application/json'

def connect_db():
  mysql = MySQL()
  mysql.init_app(app)
  return mysql.connection

def get_db():
  """
  Opens a new database connection if there is none yet for the
    current application context.
  """
  if not hasattr(g, 'mysql_db'):
    g.mysql_db = connect_db()
  return g.mysql_db

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()


@app.route("/schema", methods=["GET"])
@crossdomain(origin='http://localhost:5000')
def schema():
  schema = {}

  try:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('show tables')
    tables = cursor.fetchall()

    for table in tables:
      table = table[0]
      schema[table] = get_columns_for_table(conn, table)

  except Error as e:
    return error_response(repr(e))

  return jsonify(**schema)


@app.route("/connect", methods=["POST", "OPTIONS"])
@crossdomain(origin='http://localhost:5000')
def connect():
  data = json.loads(request.data.decode("utf-8"))
  host = data.get('host', 'localhost')
  db_name = data.get('dbName')
  username = data.get('username', 'root')
  password = data.get('password', 'password')

  if not all((host, db_name, username, password)):
    return error_response('Host, database name, username, and password are all required.')

  app.config['MYSQL_USER'] = str(username)
  app.config['MYSQL_PASSWORD'] = str(password)
  app.config['MYSQL_DB'] = str(db_name)
  app.config['MYSQL_HOST'] = str(host)

  try:
    conn = get_db()

  except Error as e:
    return error_response(repr(e))

  return jsonify({'success': True})

if __name__ == "__main__":
    app.run(port=5001)

