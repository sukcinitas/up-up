import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import axios from 'axios';
import './fontawesome';
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import reducer from './redux/reducers';
import { AppState } from './redux/actions';
import App from './components/App/App';

axios.defaults.withCredentials = true;

const renderApp = async () => {
  let state: AppState;
  await axios
    .get('/api/user/login')
    .then(async (res) => {
      if (res.data.user.username) {
        const starredPolls = await axios.get(
          `/api/user/profile/${res.data.user.username}`,
        );
        state = {
          ...res.data.user,
          starredPolls: [...starredPolls.data.user[0].starredPolls],
        };
      }
      const store = createStore(
        reducer,
        state,
        applyMiddleware(thunk),
      );
      const root = createRoot(document.getElementById('root'));
      root.render(
      <Provider store={store}>
        <App />
      </Provider>);
    })
    .catch((err) => {
      console.log(err);
      const root = createRoot(document.getElementById('root'));
      root.render(<h2>Something went wrong!</h2>);
    });
};

(async () => renderApp())();
