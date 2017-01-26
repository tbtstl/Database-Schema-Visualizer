import React, { Component } from 'react';
import { Render } from 'react-dom';

export default class Visualizer extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  componentDidMount() {
    // request db schema here
  }

  render(){
    return (
      <div>
        <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">{this.state.dbName}</div>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <button className="pt-button pt-minimal pt-icon-export">Export Image</button>
          <span className="pt-navbar-divider"></span>
          <button className="pt-button pt-minimal pt-icon-comparison">Show all attributes</button>
          <button className="pt-button pt-minimal pt-icon-style">Layout</button>
        </div>
      </nav>
      </div>
    );
  }
}
