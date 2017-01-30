import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './App';
import Visualizer from './Visualizer.jsx';
import Connect from './Connect.jsx';

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="/connect" component={Connect}/>
    <Route path="/visualizer" component={Visualizer}/>
    {/* Add all the routes here */}
  </Router>
  ),
  document.getElementById('root')
);
