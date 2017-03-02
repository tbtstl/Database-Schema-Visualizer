import React, {Component} from 'react';
import {render} from 'react-dom';

import cookie from 'react-cookie';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onPersistNameSubmit: props.nameSubmitCallback,
      layoutName: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.layoutName.length > 0) {
      cookie.save();
      this.state.onPersistNameSubmit(this.state.layoutName);
    }
  }

  handleChange(event) {
    /*
     Helper function to synchronize form values to state variables
     */
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  render() {
    return (
      <div>
        <h5>Persist this layout</h5>
        <form onSubmit={this.handleSubmit}>
          <label className="pt-label">
            Layout Name
            <input name="layoutName" value={this.state.layoutName} type="text" className="pt-input"
                   onChange={this.handleChange}/>
          </label>
        </form>
        <button className="pt-button pt-intent-primary" onClick={this.handleSubmit}>Save</button>
        <button className="pt-button pt-popover-dismiss float-right">Dismiss</button>
      </div>
    )
  }
}
