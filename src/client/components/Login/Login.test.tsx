import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  render, cleanup, fireEvent, waitForElement,
} from '@testing-library/react';
// import axiosMock from 'axios';
import axios from 'axios';
import reducer, { initialState } from '../../redux/reducers';

import Login from './Login';

function renderWithRedux(
  ui,
  { 
    state = initialState,
    store = createStore(reducer, state),
    route = '/user/login',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {},

) {
  return {
    ...render(
      <Provider store={store}>
        <Router history={history}>{ui}</Router>
      </Provider>,
    ),
    store,
    history,
  };
}
afterEach(cleanup);
jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
describe('<Login /> Component', () => {
  it('renders login component', async () => {
    const { getByText, getAllByText } = renderWithRedux(
      <Route path="/user/login">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Login {...props} />}
      </Route>,
      {
        route: '/user/login',
      },
    );

    expect(getByText(/Username/i).textContent).toBe('Username');
    expect(getByText(/Password/i).textContent).toBe('Password');
    expect(getAllByText(/Login/i));
    expect(getByText(/Register/i).textContent).toBe('Register');
    expect(getByText(/^Do not have an account?/i).textContent).toBe('Do not have an account?Register');
  });

  it('can input all values', () => {
    const { getByLabelText } = renderWithRedux(
      <Route path="/user/login">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Login {...props} />}
      </Route>,
      {
        route: '/user/login',
      },
    );

    const usernameInput = getByLabelText('Username') as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: 'testUser1' } });
    expect(usernameInput.value).toBe('testUser1');

    const passwordInput = getByLabelText('Password') as HTMLInputElement;;
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    expect(passwordInput.value).toBe('testPassword');
  });

  it('prints error if login unsuccessful', async () => {
    axiosMock.post.mockResolvedValueOnce({ data: { error: 'Could not login user!' } });
    const { getByTestId, getByText } = renderWithRedux(
      <Route path="/user/login">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Login {...props} />}
      </Route>,
      {
        route: '/user/login',
      },
    );

    fireEvent.click(getByTestId('login-btn'));
    const errorMessage = await waitForElement(() => getByText('Could not login user!'));
    expect(errorMessage.textContent).toBe('Could not login user!');
  });
});

// #handleSuccessful login