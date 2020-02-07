import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../../util/route.jsx';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import PollList from '../PollList/PollList.jsx';
import Poll from '../Poll/Poll.jsx';
import Register from '../Register/Register.jsx';
import Login from '../Login/Login.jsx';
import Profile from '../Profile/Profile.jsx';
import CreatePollForm from '../CreatePollForm/CreatePollForm.jsx';

const App = () => (
  <Router>
    <Route component={Header} />
    <Switch>
      <ProtectedRoute path="/user/create-poll" component={CreatePollForm} />
      <AuthRoute path="/user/register" component={Register} />
      <AuthRoute path="/user/login" component={Login} />
      <ProtectedRoute path="/user/profile" component={Profile} />
      <Route path="/polls/:id" component={Poll} />
      <Route exact path="/" component={PollList} />
    </Switch>
    <Route component={Footer} />
  </Router>
);

export default App;
