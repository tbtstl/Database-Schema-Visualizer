import React, { Component } from 'react';
import {Router, Route, Link, hashHistory } from 'react-router';

import Content from './Content.jsx';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      'contentType': 'home'
    };
    this.renderConnectForm = this.renderConnectForm.bind(this);
  }

  renderConnectForm(){
    this.setState({'contentType': 'connect'});
  }

  render() {
    let contentType = this.state.contentType;
    return (
      // Add your component markup and other subcomponent references here.
      <div>
      <nav className="pt-navbar .modifier .pt-fixed-top">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">Database Schema Visualizer</div>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <button className="pt-button pt-minimal pt-intent-primary pt-icon-log-in" onClick={()=>{this.renderConnectForm()}}>Connect</button>
          <span className="pt-navbar-divider"></span>
          <button className="pt-button pt-minimal pt-icon-cog"></button>
        </div>
        </nav>
        <div>
          <Content contentType={contentType}></Content>
        </div>
      </div>
    );
  }
}
