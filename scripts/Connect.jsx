import React, {Component} from 'react';
import {hashHistory} from 'react-router';
import 'whatwg-fetch';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      host: '',
      dbName: '',
      username: '',
      password: '',
      calloutClassName: '',
      calloutText: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    let form = {
      host: this.state.host,
      dbName: this.state.dbName,
      username: this.state.username,
      password: this.state.password
    };
    event.preventDefault();
    this.setState({calloutClassName: ''});
    fetch('http://localhost:5001/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then((resp) => {
        if (resp.status !== 200) {
          this.setState({calloutClassName: 'pt-callout pt-intent-danger'});
        } else {
          this.setState({calloutClassName: 'pt-callout pt-intent-success'});
        }
        return resp.json();
      })
      .then((resp) => {
        console.log(resp);
        if (resp.error) {
          this.setState({calloutText: 'Could not connect: ' + resp.error});
        } else {
          console.log('all good');
          this.setState({calloutText: 'Successfully Connected to ' + this.state.host});
          hashHistory.push('/visualizer');
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState({calloutClassName: 'pt-callout pt-intent-danger'});
        this.setState({calloutText: 'An unknown error occured'});
      });
  }

  render() {
    return (
      <div>
        <nav className="pt-navbar .modifier .pt-fixed-top">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">Database Schema Visualizer</div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-intent-primary pt-icon-log-in" onClick={() => {
              this.renderConnectForm()
            }}>Connect
            </button>
            <span className="pt-navbar-divider"></span>
            <button className="pt-button pt-minimal pt-icon-cog"></button>
          </div>
        </nav>
        <div className="pt-card pt-elevation-2 content-container">
          <h3>Connect to a MySQL Database</h3>
          <form onSubmit={this.handleSubmit}>
            <div className={this.state.calloutClassName}>{this.state.calloutText}</div>
            <br/>
            <label className="pt-label">
              Host
              <input name="host" value={this.state.host} type="text" className="pt-input" onChange={this.handleChange}/>
            </label>
            <label className="pt-label">
              Database Name
              <input name="dbName" value={this.state.dbName} type="text" className="pt-input"
                     onChange={this.handleChange}/>
            </label>
            <label className="pt-label">
              Username
              <input name="username" value={this.state.username} type="text" className="pt-input"
                     onChange={this.handleChange}/>
            </label>
            <label className="pt-label">
              Password
              <input name="password" value={this.state.password} type="password" className="pt-input"
                     onChange={this.handleChange}/>
            </label>
            <button className="pt-button pt-intent-primary pt-fill" type="submit">Connect</button>
          </form>
        </div>
      </div>
    );
  }
}
