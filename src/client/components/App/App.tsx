import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
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
    <Header />
    <Routes>
      <Route path="/user/create-poll" element={ <ProtectedRoute><CreatePollForm /></ProtectedRoute> }/>
      <Route path="/user/register" element={<AuthRoute><Register /></AuthRoute>} />
      <Route path="/user/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/polls/:id" Component={Poll} />
      <Route path="/" Component={PollList} />
      <Route path="*" Component={NotFound} />
    </Routes>
    <Footer />
  </Router>
);

export default App;
