import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import './fontawesome';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './redux/reducers';
import App from './components/App/App';

axios.defaults.withCredentials = true;

const renderApp = async () => {
  let state;
  const user = await axios.get('/api/user/login');
  if (user.data.user.username) {
    const starredPolls = await axios.get(`/api/user/profile/${user.data.user.username}`);
    state = { ...user.data.user, starredPolls: [...starredPolls.data.user[0].starredPolls] };
  }
  const store = createStore(reducer, state, applyMiddleware(thunk));
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  );
};

(async () => renderApp())();
