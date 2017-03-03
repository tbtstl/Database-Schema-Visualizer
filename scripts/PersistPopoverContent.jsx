import React, {Component} from 'react';
import {render} from 'react-dom';

import cookie from 'react-cookie';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onPersistNameSubmit: props.nameSubmitCallback,
      layoutName: '',
      layouts: props.layouts
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    let name = this.state.layoutName;

    if (name.length > 0) {
      let currentLayout = window.__im_disgusted_in_myself__currentLayout;
      let cookieKey = 'layout:' + this.state.layoutName;
      let newLayout = {};
      cookie.save(cookieKey, currentLayout, {path: '/'});
      newLayout.isDefault = false;
      newLayout.displayName = name;
      newLayout.layoutKey = name;
      let layouts = this.state.layouts;
      layouts.push(newLayout);
      this.state.onPersistNameSubmit(layouts);
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
