import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../../util/route';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import PollList from '../PollList/PollList';
import Poll from '../Poll/Poll';
import Register from '../Register/Register';
import Login from '../Login/Login';
import Profile from '../Profile/Profile';
import CreatePollForm from '../CreatePollForm/CreatePollForm';
import '../common.scss';

const App:React.FunctionComponent<{}> = () => (
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
