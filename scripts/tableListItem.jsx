import React, {Component} from 'react';
import {Render} from 'react-dom';


export default class TableListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table: props.table
    };
  }

  render() {
    return (
      <div>
        {this.state.table.name}
      </div>
    );
  }
}
