import React, { Component } from 'react';
import Connect from './Connect.jsx'

export default class Content extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      // Add your component markup and other subcomponent references here.
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
          <li>Projects are created automatically by filling in the "Project Name" field on the form.</li>
          <li>To remove a project, click on the "x" beside the project name</li>
          <li>The MySQL database must be running on port 3306 to connect</li>
        </ol>

        <hr />

        <h3>Using the Visualizer</h3>
        <ol>
          <li>Toggle showing all table attributes by clicking the show all attributes button on the navigation bar</li>
          <li>Toggle showing a single table's attributes by clicking the expand button beside the tables name on the diagram</li>
          <li>Change the layout of the diagram by clicking the layout button on the navigation bar</li>
          <li>Remove a table from the diagram by unselecting it from the table list</li>
          <li>Export an image of the diagram by clicking the export image button on the navigation bar</li>
        </ol>
      </div>
    );
  }
}
