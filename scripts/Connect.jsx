import React, { Component } from 'react';

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      host: '',
      dbName: '',
      username: '',
      password: ''
    };
  }

  render() {
    return (
      <div>
        <h3>Connect to a MySQL Database</h3>
        <form>
          <label className="pt-label">
            Host
            <input type="text" className="pt-input"/>
          </label>
          <label className="pt-label">
            Database Name
            <input type="text" className="pt-input"/>
          </label>
          <label className="pt-label">
            Username
            <input type="text" className="pt-input"/>
          </label>
          <label className="pt-label">
            Password
            <input type="password" className="pt-input"/>
          </label>
          <button className="pt-button pt-intent-primary pt-fill" type="submit">Connect</button>
        </form>
      </div>
    );
  }
}
