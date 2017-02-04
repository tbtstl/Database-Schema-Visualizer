import json
from _mysql import Error

from flask import Flask, jsonify, request, Response
from flask import g

from db import MySQL
from helpers import crossdomain, error_response, get_columns_for_table, get_links_from_table

app = Flask(__name__)

MT_JSON = 'application/json'

def connect_db():
  """
  Connects the application to a MySQL database. This should only be run once.
  """
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
    """
    Closes the database again at the end of the request.
    """
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()


@app.route("/schema", methods=["GET"])
@crossdomain(origin='http://localhost:5000')
def schema():
  """
  Returns a JSON representation of the database schema (and it's FK links) to be used by the client application.
    If any errors occur while querying the database, a 400 response is returned with an explanation of the error.
  """
  schema = {}
  links = {}
  response = {'schema': schema, 'links': links}

  try:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('show tables')
    tables = cursor.fetchall()

    for table in tables:
      table = table[0]
      schema[table] = get_columns_for_table(conn, table)

      link = get_links_from_table(conn, table)

      if link:
        links[table] = get_links_from_table(conn, table)

  except Error as e:
    return error_response(repr(e))

  return jsonify(**response)


@app.route("/connect", methods=["POST", "OPTIONS"])
@crossdomain(origin='http://localhost:5000')
def connect():
  """
  Returns a success message if the POSTed data successfully connects to the database, else a 400 error response with an
  error in JSON.
  """
  data = json.loads(request.data.decode("utf-8"))
  host = data.get('host', 'localhost')
  port = data.get('port', 3306)
  db_name = data.get('dbName')
  username = data.get('username', 'root')
  password = data.get('password', 'password')

  if not all((host, port, db_name, username, password)):
    return error_response('Host, port, database name, username, and password are all required.')

  try:
    app.config['MYSQL_USER'] = str(username)
    app.config['MYSQL_PASSWORD'] = str(password)
    app.config['MYSQL_DB'] = str(db_name)
    app.config['MYSQL_HOST'] = str(host)
    app.config['MYSQL_PORT'] = int(port)

    conn = get_db()

  except Exception as e:
    return error_response(str(e))

  return jsonify({'success': True})

# Run the server on port 5001
if __name__ == "__main__":
    app.run(port=5001)

