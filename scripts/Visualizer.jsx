import React, {Component} from 'react';
import {Render} from 'react-dom';
import {Link} from 'react-router';

import Canvas from './Canvas.jsx'
import TableList from './TableList.jsx';

export default class Visualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: {},
      tables: []
    };
    this.getTables = this.getTables.bind(this);
    this.onSchemaChange = this.onSchemaChange.bind(this);
  }

  componentDidMount() {
    // request db schema here
    fetch('http://localhost:5001/schema')
      .then((resp) => {
        if (resp.status !== 200) {
        } else {
        }
        return resp.json();
      })
      .then((resp) => {
        if (resp.error) {
        } else {
          this.setState({schema: resp.schema, tables: this.getTables(resp.schema)});
        }
      });
  }

  getTables(schema) {
    let tables = [];
    console.log(schema);
    if (!schema) return;
    Object.keys(schema).forEach((key)=>{
      console.log(key);
      if (schema.hasOwnProperty(key)) {
        tables.push({name: key, columns: schema[key]})
      }
    });
    return tables;
  }

  onSchemaChange(newSchema){
    this.setState({schema: newSchema});
  }

  render() {
    let schema = this.state.schema;
    let tables = this.state.tables;

    // Wait for AJAX call to complete before rendering anything
    if (tables.length <= 0 || !schema){
      console.log('not rendering visualizer');
      return null;
    }
    return (
      <div>
        <nav className="pt-navbar">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading"><Link to="/">Database Schema Visualizer</Link></div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-icon-export">Export Image</button>
            <span className="pt-navbar-divider"></span>
            <button className="pt-button pt-minimal pt-icon-comparison">Show all attributes</button>
            <button className="pt-button pt-minimal pt-icon-style">Layout</button>
          </div>
        </nav>
        <TableList schema={schema} tables={tables} onSchemaChange={this.onSchemaChange}/>
        <div className="pt-card pt-elevation-1 canvas-container">
          <Canvas schema={schema}/>
        </div>
      </div>
    );
  }
}
