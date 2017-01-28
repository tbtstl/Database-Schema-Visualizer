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
  }

  render() {
    let tables = this.state.tables || [];
    console.log(tables);
    return (
      <div className="tableList pt-card pt-elevation-3">
        {
          tables.map((table, index) => <TableListItem table={table} key={index}/>)
        }
      </div>
    );
  }
}
