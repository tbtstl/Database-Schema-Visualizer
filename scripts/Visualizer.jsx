import React, { Component } from 'react';
import { Render } from 'react-dom';

export default class Visualizer extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      dbName: 'name'
    }
  }

  componentDidMount() {
    // request db schema here
    fetch('http://localhost:5001/schema')
      .then((resp)=>{
        if (resp.status !== 200){
        } else {
        }
        return resp.json();
      })
      .then((resp)=>{
        console.log(resp);
        if(resp.error){
        } else {
          console.log('all good');
          console.log(resp);
        }
      })
      .catch((e)=>{
        console.log(e);
      });
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
