import React, {Component} from 'react';
import {Render} from 'react-dom';

import TableListItem from './tableListItem.jsx'

export default class TableList extends Component {
  constructor(props) {
    super(props);
    console.log(props.schema);
    this.state = {
      schema: props.schema,
      tables: props.tables
    };
    this.onToggleVisibility.bind(this);
  }

  onToggleVisibility(tableName, isVisible){
    console.log(tableName);
    console.log(isVisible);
  }

  render() {
    let tables = this.state.tables || [];
    console.log(tables);
    return (
      <div className="tableList pt-card pt-elevation-3">
        <div className="pt-card pt-elevation-0"><h5 className="center-horizontal">Table List</h5></div>
        {
          tables.map((table, index) => <TableListItem table={table} key={table.name} onToggleVisibility={this.onToggleVisibility}/>)
        }
      </div>
    );
  }
}
