import React, {Component} from 'react';
import {Render} from 'react-dom';
import {Link} from 'react-router';
import {Menu, MenuItem, Popover, Button, Position, PopoverInteractionKind} from '@blueprintjs/core';

import cookie from 'react-cookie';

import Canvas from './Canvas.jsx'
import TableList from './tableList.jsx';
import PersistPopoverContent from './PersistPopoverContent.jsx';

export default class Visualizer extends Component {
  constructor(props) {
    super(props);

    const defaultLayouts = [
      {isDefault: true, displayName: "Grid", layoutKey: "grid"},
      {isDefault: true, displayName: "Force Directed", layoutKey: "forceDirected"},
      {isDefault: true, displayName: "Circular", layoutKey: "circular"},
      {isDefault: true, displayName: "Layered Digraph", layoutKey: "layeredDigraph"}
    ];

    // let layouts = cookie.select(/^layout/);

    this.state = {
      schema: {},
      tables: [],
      layouts: defaultLayouts,
      links: {},
      layout: "forceDirected",
      imageRequested: false,
      showAttributes: false,
      error: '',
      loading: true
    };
    this.getTables = this.getTables.bind(this);
    this.onSchemaChange = this.onSchemaChange.bind(this);
    this.handleImageButtonClick = this.handleImageButtonClick.bind(this);
    this.handleLayoutButtonClick = this.handleLayoutButtonClick.bind(this);
    this.toggleAttributes = this.toggleAttributes.bind(this);
    this.formatNewLayout = this.formatNewLayout.bind(this);
  }

  componentDidMount() {
    /*
     As soon as the component is mounted, request the schema from the server. If an error occurs, render an alert.
     */
    fetch('http://localhost:5001/schema')
      .then((resp) => {
        return resp.json();
      })
      .then((resp) => {
        if (resp.error) {
          this.setState({error: resp.error, loading: false});
        } else {
          this.setState({schema: resp.schema, tables: this.getTables(resp.schema), links: resp.links, loading: false});
        }
      })
      .catch(() => {
        this.setState({error: 'An Unknown error has occured.', loading: false});
      });
  }

  getTables(schema) {
    /*
     Format the table objects for the TableList Component
     */
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
    /*
     Trigger a waterfall re-render of this component and its subcomponents when the schema is changed.
     */
    this.setState({schema: newSchema});
  }

  handleImageButtonClick() {
    this.setState({imageRequested: true});
  }

  handleLayoutButtonClick(layout) {
    this.setState({layout: layout});
  }

  toggleAttributes() {
    this.setState({showAttributes: this.state.showAttributes !== true});
  }

  formatNewLayout(layouts, newLayout) {
    this.setState({layouts: layouts, layout: newLayout});
  };

  render() {
    /*
     If the schema has been loaded from the database, render the visualizer. Else, render a loading screen.
     */
    let schema = this.state.schema;
    let tables = this.state.tables;
    let links = this.state.links;
    let layout = this.state.layout;
    let imageRequested = this.state.imageRequested;
    let showAttributes = this.state.showAttributes;
    let error = this.state.error.length !== 0;

    // Wait for AJAX call to complete before rendering anything
    if (this.state.loading) {
      return (<div className="pt-callout pt-icon-info-sign">
        <h5>Loading</h5>
        The canvas is rendering, please wait
      </div>);
    } else if (tables.length <= 0 && !error) {
      return (
        <div className="pt-callout pt-icon-warning-sign pt-intent-warning">
          <h5>Database is empty</h5>
          <p>It appears that the database is empty. There must be at least one table in the database for the visualizer
            to work.</p>
          <p><Link to="/connect">Try again</Link></p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="pt-callout pt-intent-danger pt-icon-error">
          <h5>Error</h5>
          <p>{this.state.error}</p>
          <p><Link to="/connect">Try again</Link></p>
        </div>
      );
    }

    const layoutMenu = (
      <Menu>
        {
          this.state.layouts.map(
            (layout, index) =>
              <MenuItem text={layout.displayName} key={layout.layoutKey} onClick={() => {
                this.handleLayoutButtonClick(layout)
              }}/>
          )
        }
      </Menu>
    );
    const persistPopoverContent = (
      <PersistPopoverContent nameSubmitCallback={this.formatNewLayout} layouts={this.state.layouts}/>
    );
    return (
      <div>
        <nav className="pt-navbar">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading"><Link to="/">Database Schema Visualizer</Link></div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <Popover content={persistPopoverContent}
                     popoverClassName="pt-popover-content-sizing"
                     position={Position.BOTTOM}>
              <button className="pt-button pt-minimal pt-icon-presentation">Persist Diagram</button>
            </Popover>
            <button className="pt-button pt-minimal pt-icon-export" onClick={this.handleImageButtonClick}>Export Image
            </button>
            <button className="pt-button pt-minimal pt-icon-comparison"
                    onClick={this.toggleAttributes}>{showAttributes ? "Hide" : "Show"} all attributes
            </button>
            <span className="pt-navbar-divider"></span>
            <Popover content={layoutMenu} position={Position.BOTTOM} isModal="true">
              <button className="pt-button pt-minimal pt-icon-style">Layout</button>
            </Popover>
          </div>
        </nav>
        <TableList schema={schema} tables={tables} onSchemaChange={this.onSchemaChange}/>
        <div className="pt-card pt-elevation-1 canvas-container">
          <Canvas schema={schema} links={links} imageRequested={imageRequested} layout={layout}
                  showAttributes={showAttributes}/>
        </div>
      </div>
    );
  }
}
