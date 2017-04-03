import React, { Component } from 'react';
import Connect from './Connect.jsx'

export default class Content extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="pt-card pt-elevation-2 content-container">
        <h1>Instructions</h1>
        <hr/>

        <h3>Connecting to the Database</h3>
        <ol>
          <li>Click the Connect button on the top right of the screen</li>
          <li>Select from a previous project (if one exists) or create a new project by filling in the form</li>
          <li>Click on the connect button</li>
        </ol>

        <h5>Notes</h5>
        <ol className="pt-list">
          <li>Projects are created automatically by filling in the "Project Name" field on the form and connecting.</li>
          <li>To remove a project, click on the "x" beside the project name</li>
          <li>To edit a project, simply click on the project, fill in the project name field, edit the data, and reconnect.</li>
          <li>The MySQL database should be running on port 3306 to connect</li>
        </ol>

        <hr />

        <h3>Using the Visualizer</h3>
        <ol>
          <li>Toggle showing all table attributes by clicking the show all attributes button on the navigation bar</li>
          <li>Toggle showing a single table's attributes by clicking the expand button beside the tables name on the diagram</li>
          <li>Change the layout of the diagram by clicking the layout button on the navigation bar</li>
          <li>Remove a table from the diagram by unselecting it from the table list</li>
          <li>Export an image of the diagram by clicking the export image button on the navigation bar</li>
          <li>Nodes can be renamed by clicking on the label of the node</li>
        </ol>
        <h5>Notes</h5>
        <ol>
          <li>The larger the database, the longer it will take to render changes to the diagram such as toggling attributes and changing layouts. Be patient when using these features.</li>
        </ol>

        <hr/>

        <div className="pt-callout"><h5>New in Release 2.0</h5>
        <h3>Abstraction Mode</h3>
        <ul>
          <li>When connecting to a database, enable the abstraction mode to view a summarized abstracted ER view of the database.</li>
          <li>Abstract relationships and nodes can be "drilled into" by double clicking on the node</li>
        </ul>
          <hr/>
          <ul>
            <li>Nodes can be renamed by clicking on the label of the node</li>
            <li>Custom layouts can be persisted by clicking on the persist layout button in the navigation bar</li>
            <li>Reset a diagram to it's initial state by clicking the reset button on the navigation bar</li>
          </ul>
        </div>

        <div className="pt-callout pt-intent-primary"><h5>New in Release 3.0</h5></div>
        <h3>JPA Foreign Key candidates</h3>
        <ul>
          <li>Upload java files when connecting to a database to have them parsed for extra foreign key candidates. This functionality works for JPA.</li>
        </ul>
      </div>
    );
  }
}
