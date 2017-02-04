import React, {Component} from 'react';
import {hashHistory} from 'react-router';
import cookie from 'react-cookie';

import 'whatwg-fetch';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectName: '',
      host: '',
      dbName: '',
      username: '',
      password: '',
      calloutClassName: '',
      calloutText: '',
      projects: {},
      hideProjects: true, //hide
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getProjectOptions = this.getProjectOptions.bind(this);
    this.projectSelected = this.projectSelected.bind(this);
  }

  componentWillMount(){
    this.state.projects = cookie.load('projects') || {};
    if(Object.keys(this.state.projects).length){
      this.state.hideProjects = false;
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let form = {
      host: this.state.host,
      dbName: this.state.dbName,
      username: this.state.username,
      password: this.state.password
    };

    if(this.state.projectName.length > 0){
      let projects = this.state.projects;
      Object.assign(projects, {[this.state.projectName]: form});
      cookie.save('projects', projects, {path: '/'});
    }

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
        if (resp.error) {
          this.setState({calloutText: 'Could not connect: ' + resp.error});
        } else {
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

  getProjectOptions(){
    {/*let options = [<option key="-1" value=''></option>];*/}
    let options = [];
    Object.keys(this.state.projects).forEach((key, index)=>{
      options.push(
        <div className="pt-card pt-elevation-0 pt-interactive" onClick={()=>{this.projectSelected(key)}}>
          <a>{key}</a><a className="pt-icon-cross float-right" onClick={()=>{this.removeProject(key)}} />
        </div>
      );
    });
    return options;
  }

  projectSelected(projectKey){
    let project = this.state.projects[projectKey];
    if(!project) return;
    Object.keys(project).forEach((key)=>{
      this.setState({[key]: project[key]})
    })
  }

  removeProject(projectKey){
    let projects = this.state.projects;
    if(delete projects[projectKey]){
      cookie.save('projects', projects, {path: '/'});
      this.setState({projects: projects});
    }
  }


  render(){
    return (
      <div>
        <nav className="pt-navbar .modifier .pt-fixed-top">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">Database Schema Visualizer</div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-intent-primary pt-icon-log-in" onClick={() => {this.renderConnectForm()}}>Connect
            </button>
            <span className="pt-navbar-divider"></span>
            <button className="pt-button pt-minimal pt-icon-cog"></button>
          </div>
        </nav>
        <div className="pt-card pt-elevation-2 content-container">
          <h3>Connect to a MySQL Database</h3>
          <div className={this.state.hideProjects ? "hide" : ""}>
            <h5>Select from a previous project</h5>
            <div className="projectCardContainer">
              {this.getProjectOptions()}
            </div>
          </div>
          <hr />
          <form onSubmit={this.handleSubmit}>
            <h5>Create a new project</h5>
            <div className={this.state.calloutClassName}>{this.state.calloutText}</div>
            <br/>
            <label className="pt-label">
              Project Name
              <input name="projectName" value={this.state.projectName} type="text" className="pt-input" onChange={this.handleChange}/>
            </label>
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
