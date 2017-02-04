import React, {Component} from 'react';
import {Render} from 'react-dom';
import {Link} from 'react-router';
import {Menu, MenuItem, Popover, Button, Position} from '@blueprintjs/core';

import Canvas from './Canvas.jsx'
import TableList from './TableList.jsx';

export default class Visualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: {},
      tables: [],
      links: {},
      layout: "forceDirected",
      imageRequested: false,
      showAttributes: false
    };
    this.getTables = this.getTables.bind(this);
    this.onSchemaChange = this.onSchemaChange.bind(this);
    this.handleImageButtonClick = this.handleImageButtonClick.bind(this);
    this.handleLayoutButtonClick = this.handleLayoutButtonClick.bind(this);
    this.toggleAttributes = this.toggleAttributes.bind(this);
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

  handleLayoutButtonClick(layout){
    this.setState({layout: layout});
  }

  toggleAttributes(){
    this.setState({showAttributes: this.state.showAttributes !== true});
  }

  render() {
    let schema = this.state.schema;
    let tables = this.state.tables;
    let links = this.state.links;
    let layout = this.state.layout;
    let imageRequested = this.state.imageRequested;
    let showAttributes = this.state.showAttributes;

    // Wait for AJAX call to complete before rendering anything
    if (tables.length <= 0 || !schema || !links) {
      return (<div className="pt-callout pt-icon-info-sign">
        <h5>Loading</h5>
        The canvas is rendering, please wait
      </div>);
    }
    const layoutMenu = (
      <Menu>
        <MenuItem text="Grid" onClick={()=>{this.handleLayoutButtonClick("grid")}}/>
        <MenuItem text="Force Directed" onClick={()=>{this.handleLayoutButtonClick("forceDirected")}}/>
        <MenuItem text="Circular" onClick={()=>{this.handleLayoutButtonClick("circular")}}/>
        <MenuItem text="Layered Digraph" onClick={()=>{this.handleLayoutButtonClick("layeredDigraph")}}/>
      </Menu>
    );
    return (
      <div>
        <nav className="pt-navbar">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading"><Link to="/">Database Schema Visualizer</Link></div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-icon-export" onClick={this.handleImageButtonClick}>Export Image</button>
            <button className="pt-button pt-minimal pt-icon-comparison" onClick={this.toggleAttributes}>{showAttributes ? "Hide" : "Show"} all attributes</button>
            <span className="pt-navbar-divider"></span>
            <Popover content={layoutMenu} position={Position.BOTTOM}>
              <button className="pt-button pt-minimal pt-icon-style">Layout</button>
            </Popover>
          </div>
        </nav>
        <TableList schema={schema} tables={tables} onSchemaChange={this.onSchemaChange}/>
        <div className="pt-card pt-elevation-1 canvas-container">
          <Canvas schema={schema} links={links} imageRequested={imageRequested} layout={layout} showAttributes={showAttributes}/>
        </div>
      </div>
    );
  }
}
