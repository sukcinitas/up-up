import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import axios from 'axios';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './redux/reducers';
import App from './components/App/App.jsx';
import 'regenerator-runtime/runtime'; // directly including instead of using deprecated @babel/polyfill

axios.defaults.withCredentials = true;

const renderApp = async () => {
  const state = await axios.get('http://localhost:8080/api/user/login')
    .then((res) => res.data.user);

  const store = createStore(reducer, state, applyMiddleware(thunk));
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    // eslint-disable-next-line no-undef
    document.getElementById('root'),
  );
};

(async () => renderApp())();
