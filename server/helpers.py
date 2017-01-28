# -*- coding: utf-8 -*-
import json
from datetime import timedelta

from flask import Response
from flask import make_response, request, current_app
from functools import update_wrapper


# https://blog.skyred.fi/articles/better-crossdomain-snippet-for-flask.html
def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


def error_response(message):
  response = {'error': message}
  response_json = json.dumps(response)
  return Response(response_json, status=400, mimetype='application/json')


def get_columns_for_table(conn, table):
  cursor = conn.cursor()
  query = 'describe {}'.format(table)
  cursor.execute(query)
  results = cursor.fetchall()

  columns = [{
    'name': col[0],
    'type': col[1],
    'nullable': col[2],
    'key': col[3],
    'default': col[4],
    'extra': col[5]
  } for col in results]

  return columns

def get_links_from_table(conn, table):
  cursor = conn.cursor()
  query = "SELECT constraint_name, table_schema, table_name, column_name, referenced_table_schema, referenced_table_name, referenced_column_name from information_schema.key_column_usage where ((referenced_table_name is not null) and (table_name = '{}'))".format(table)
  cursor.execute(query)
  results = cursor.fetchall()

  links = [{
    'constraint_name': result[0],
    'table_schema': result[1],
    'table_name': result[2],
    'column_name': result[3],
    'referenced_table_schema': result[4],
    'referenced_table_name': result[5],
    'referenced_column_name': result[6]
  } for result in results if result[4]]

  return links
