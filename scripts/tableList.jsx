import React, {Component} from 'react';
import {Render} from 'react-dom';

import TableListItem from './tableListItem.jsx'

export default class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: props.schema,
      tables: props.tables
    };
    this.onToggleVisibility = this.onToggleVisibility.bind(this);
    this.triggerSchemaChange = props.onSchemaChange;
  }

  onToggleVisibility(table, isVisible) {
    let schema = JSON.parse(JSON.stringify(this.state.schema));
    if(isVisible){
      schema[table.name] = table.columns;
    } else {
      delete schema[table.name];
    }
    this.triggerSchemaChange(schema);
  }

  render() {
    let tables = this.state.tables || [];
    return (
      <div className="tableList pt-card pt-elevation-3">
        <div className="pt-card pt-elevation-0"><h5 className="center-horizontal">Table List</h5></div>
        {
          tables.map((table, index) => <TableListItem table={table} key={table.name}
                                                      onToggleVisibility={this.onToggleVisibility}/>)
        }
      </div>
    );
  }
}
