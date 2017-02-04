import React, { Component } from 'react';
import {Router, Route, Link, hashHistory } from 'react-router';

import Content from './Content.jsx';

export default class App extends Component {
  render() {
    return (
      // Add your component markup and other subcomponent references here.
      <div>
      <nav className="pt-navbar .modifier .pt-fixed-top">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">Database Schema Visualizer</div>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <Link to="/connect"><button className="pt-button pt-minimal pt-intent-primary pt-icon-log-in">Connect</button></Link>
          <span className="pt-navbar-divider"></span>
          <button className="pt-button pt-minimal pt-icon-cog"></button>
        </div>
        </nav>
        <div>
          <Content></Content>
        </div>
      </div>
    );
  }
}
