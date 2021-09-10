import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import DevTools from './DevTools';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import UserPage from './UserPage';
import RepoPage from './RepoPage';
import SalesPage from './SalesPage';

const Root = ({ store }) => (
  <Provider store={store}>
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/sales" component={SalesPage} />
          <Route path="/:login/:name" component={RepoPage} />
          <Route path="/:login" component={UserPage} />
          <DevTools />
        </Switch>
      </BrowserRouter>
    </div>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
