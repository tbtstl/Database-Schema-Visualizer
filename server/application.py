import json
import os
from _mysql import Error
from collections import OrderedDict
from pathlib import Path

import flask
import subprocess
from flask import Flask, jsonify, request, Response
from flask import g

from db import MySQL
from helpers import crossdomain, error_response, get_columns_for_table, get_links_from_table, OrderAscPk, pk, \
  allowed_file, get_all_links
from functools import reduce

from werkzeug.utils import secure_filename

UPLOAD_FOLDER = './uploads'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
  jpa_file_path = "JPAParseOutput.json"
  schema = {}
  links = {}
  jpa_file = Path(jpa_file_path)
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

    subprocess.call(["java", "-jar", "libs/oscar-parser-1.0.jar", "./uploads"])

    if jpa_file.is_file():
      response['jpa_links'] = json.loads(open(jpa_file_path).read())

  except Error as e:
    return error_response(repr(e))

  if jpa_file.is_file():
    os.unlink(jpa_file_path)

  return jsonify(**response)


@app.route("/connect", methods=["POST", "OPTIONS"])
@crossdomain(origin='http://localhost:5000')
def connect():
  """
  Returns a success message if the POSTed data successfully connects to the database, else a 400 error response with an
  error in JSON.
  """
  data = flask.request.form
  files = flask.request.files.getlist("javaSourceFiles[]")
  host = data.get('host', 'localhost')
  port = data.get('port', 3306)
  db_name = data.get('dbName')
  username = data.get('username', 'root')
  password = data.get('password', 'password')

  if not all((host, port, db_name, username, password)):
    return error_response('Host, port, database name, username, and password are all required.')

  if files:
    for file in files:
      if file.filename and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
      elif file.filename:
        return error_response(
          '{} is not a valid java source file. Only Java source files can be uploaded'.format(file.filename))

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


@app.route("/abstraction", methods=["GET"])
@crossdomain(origin='http://localhost:5000')
def abstraction():
  """
  Returns a JSON representation of the abstracted database schema (and it's FK links) to be used by the client application.
    If any errors occur while querying the database, a 400 response is returned with an explanation of the error.
  """
  abstractEntities = []
  abstractRelationships = []
  response = {'abstractEntities': abstractEntities, 'abstractRelationships': abstractRelationships}

  schema = {}

  try:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('show tables')
    tables = cursor.fetchall()

    for table in tables:
      table = table[0]
      schema[table] = get_columns_for_table(conn, table)

    """
    nes is the index of the last abstract entity
    nes + 1 is the index of the first abstract relationship

    cluster should come out of this section with index 0 up to and including nes with entities
    """

    disjoint = False
    remaining_rels = schema.copy()
    ordered_rels = OrderAscPk(schema)
    cluster = []
    ordered_rels_list = list(ordered_rels.items())
    cluster.append([list(ordered_rels_list[0])])
    del remaining_rels[ordered_rels_list[0][0]]
    nes = 0

    for i in range(1, len(ordered_rels_list)):
      R = ordered_rels_list[i]
      for index in range(nes + 1):
        if pk(R[1]) == pk(ordered_rels_list[index][1]):
          break
      if pk(R[1]) == pk(ordered_rels_list[index][1]):
        cluster[index].append(R)
        del remaining_rels[R[0]]
      else:
        disjoint = True
        checkSummedPkR = []
        for element in pk(R[1]):
          checkSummedPkR.append(reduce(lambda x, y: x ^ y, [hash(item) for item in element.items()]))
        checkSummedPkS = []
        unionPkS = []
        for j in range(nes + 1):
          for S in cluster[j]:
            for element in pk(S[1]):
              unionPkS.append(element)
        for element in unionPkS:
          checkSummedPkS.append(reduce(lambda x, y: x ^ y, [hash(item) for item in element.items()]))
        if not set(checkSummedPkR).isdisjoint(checkSummedPkS):
          disjoint = False
        if disjoint:
          cluster.append([R])
          del remaining_rels[R[0]]
          nes = nes + 1

    """
    next section...
    """

    for R in list(remaining_rels.items()):
      i = 0
      clustered = False
      checkSummedPkR = []
      for element in pk(R[1]):
        checkSummedPkR.append(reduce(lambda x, y: x ^ y, [hash(item) for item in element.items()]))
      while (i <= nes) and not clustered:
        checkSummedPkS = []
        for table in range(len(cluster[i])):
          for element in pk(cluster[i][table][1]):
            checkSummedPkS.append(reduce(lambda x, y: x ^ y, [hash(item) for item in element.items()]))
        if not set(checkSummedPkR).isdisjoint(checkSummedPkS):
          checkSummedOthers = []
          for j in range(nes + 1):
            if j == i:
              continue
            for table in range(len(cluster[j])):
              for element in pk(cluster[j][table][1]):
                checkSummedOthers.append(reduce(lambda x, y: x ^ y, [hash(item) for item in element.items()]))
          if set(checkSummedPkR).isdisjoint(checkSummedOthers):
            cluster[i].append(R)
            del remaining_rels[R[0]]
            clustered = True
        i = i + 1

    """
    last section...
    nes + 1 to nas should be relationships
    """

    if len(remaining_rels) == 0:
      nas = nes
    else:
      nas = nes + 1
      argument = []
      for i in range(nas - nes + 1):
        innerArgument = []
        for j in range(nes + 1):
          innerArgument.append(False)
        argument.append(innerArgument)
      intersects = []
      for i in range(nes + 1):
        intersects.append(False)
      first_relationship = True
      for R in list(remaining_rels.items()):
        frozDictsR = []
        for dictionary in pk(R[1]):
          frozDictsR.append(hash(frozenset(dictionary)))
        for i in range(0, nes + 1):
          frozDictsClustI = []
          for j in range(len(cluster[i])):
            for dictionary in pk(cluster[i][j][1]):
              frozDictsClustI.append(hash(frozenset(dictionary)))
          if not set(frozDictsR).isdisjoint(frozDictsClustI):
            intersects[i] = True
        if first_relationship:
          for i in range(0, nes + 1):
            argument[0][i] = intersects[i]
          cluster.append(R)
          del remaining_rels[R[0]]
          first_relationship = False
        else:
          j = 0
          found = False
          while (j <= nas) and not found:
            totBool = True
            for i in range(nes + 1):
              totBool &= (intersects[i] == argument[j][i])
            if totBool:
              cluster[j].append(R)
              del remaining_rels[R[0]]
              found = True
            j = j + 1
          if not found:
            nas = nas + 1
            for i in range(0, nes + 1):
              argument[nas - nes][i] = intersects[i]
            cluster[nas].append(R)
            del remaining_rels[R[0]]

    """
    Should be abstracted from here
    """

    for i in range(nes + 1):
      entity = {}
      for table in cluster[i]:
        entity[table[0]] = table[1]
      abstractEntities.append(entity)

    if nes != nas:
      for i in range(nes + 1, nas + 1):
        relationship = {}
        for table in cluster[i]:
          relationship[table[0]] = table[1]
        abstractRelationships.append(relationship)

  except Error as e:
    return error_response(repr(e))

  return jsonify(**response)
