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
      tables: [],
      links: {},
      imageRequested: false
    };
    this.getTables = this.getTables.bind(this);
    this.onSchemaChange = this.onSchemaChange.bind(this);
    this.handleImageButtonClick = this.handleImageButtonClick.bind(this);
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
          this.setState({schema: resp.schema, tables: this.getTables(resp.schema), links: resp.links});
        }
      });
  }

  getTables(schema) {
    let tables = [];
    if (!schema) return;
    Object.keys(schema).forEach((key) => {
      if (schema.hasOwnProperty(key)) {
        tables.push({name: key, columns: schema[key]})
      }
    });
    return tables;
  }

  onSchemaChange(newSchema) {
    this.setState({schema: newSchema});
  }

  handleImageButtonClick(){
    this.setState({imageRequested: true});
  }

  render() {
    let schema = this.state.schema;
    let tables = this.state.tables;
    let links = this.state.links;
    let imageRequested = this.state.imageRequested;

    // Wait for AJAX call to complete before rendering anything
    if (tables.length <= 0 || !schema || !links) {
      return (<div className="pt-callout pt-icon-info-sign">
        <h5>Loading</h5>
        The canvas is rendering, please wait
      </div>);
    }
    return (
      <div>
        <nav className="pt-navbar">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading"><Link to="/">Database Schema Visualizer</Link></div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-icon-export" onClick={this.handleImageButtonClick}>Export Image</button>
            <span className="pt-navbar-divider"></span>
            <button className="pt-button pt-minimal pt-icon-comparison">Show all attributes</button>
            <button className="pt-button pt-minimal pt-icon-style">Layout</button>
          </div>
        </nav>
        <TableList schema={schema} tables={tables} onSchemaChange={this.onSchemaChange}/>
        <div className="pt-card pt-elevation-1 canvas-container">
          <Canvas schema={schema} links={links} imageRequested={imageRequested}/>
        </div>
      </div>
    );
  }
}
