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
        <div>Content</div>
      </div>
    );
  }
}
