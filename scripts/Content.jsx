import React, { Component } from 'react';
import Connect from './Connect.jsx'

export default class Content extends Component {
  constructor(props){
    super(props);
    console.log('props');
    console.log(props);
    this.state = {
      contentType: props.contentType
    };
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.contentType !== this.state.contentType) {
      this.setState({ contentType: nextProps.contentType });
    }
  }

  render() {
    var toRender = this.props.contentType;
    console.log(this.state);
    return (
      // Add your component markup and other subcomponent references here.
      <div className="pt-card pt-elevation-2 content-container">
        {toRender === 'connect' ? (
          <Connect/>
        ) : (<div>Content</div>)}
      </div>
    );
  }
}
