import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../../util/route';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import PollList from '../PollList/PollList';
import Poll from '../Poll/Poll';
import Register from '../Register/Register';
import Login from '../Login/Login';
import Profile from '../Profile/Profile';
import CreatePollForm from '../CreatePollForm/CreatePollForm';
import NotFound from '../NotFound/NotFound';
import '../../sass/index.scss';

const App = () => (
  <Router>
    <Route component={Header} />
    <Switch>
      <ProtectedRoute
        path="/user/create-poll"
        component={CreatePollForm}
      />
      <AuthRoute path="/user/register" component={Register} />
      <AuthRoute path="/user/login" component={Login} />
      <ProtectedRoute path="/user/profile" component={Profile} />
      <Route path="/polls/:id" component={Poll} />
      <Route exact path="/" component={PollList} />
      <Route path="*" component={NotFound} />
    </Switch>
    <Route component={Footer} />
  </Router>
);

export default App;
