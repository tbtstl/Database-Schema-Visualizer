import React, {Component} from 'react';
import {Render} from 'react-dom';


export default class TableListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table: props.table,
      visible: true
    };
    this.handleVisibilityToggle = props.onToggleVisibility;
    this.toggleVisibility.bind(this);
  }

  toggleVisibility(e){
    /*
    When the visibility checkbox is toggled, trigger the prop callback.
     */
    this.setState({visible: !this.state.visible});
    this.handleVisibilityToggle(this.state.table, e.target.checked);
  }

  render() {
    return (
      <div className="table-list-item">
        <div className="pt-card pt-elevation-0">
          <label className="pt-control pt-checkbox .pt-large">
            <input type="checkbox" onChange={(e)=>{this.toggleVisibility(e)}} checked={this.state.visible}/>
          <span className="pt-control-indicator"></span>
          {this.state.table.name}
        </label>
      </div>
  </div>
  )
    ;
  }
}
