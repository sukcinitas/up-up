import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  render, cleanup, fireEvent,
} from '@testing-library/react';
// eslint-disable-next-line no-unused-vars
import reducer, { initialState } from '../../redux/reducers';
import { AppState } from '../../redux/actions';

import Register from './Register.jsx';

function renderWithRedux(
  ui,
  { // eslint-disable-next-line no-shadow
    initialState,
    store = createStore(reducer, initialState),
    route = '/user/register',
    history = createMemoryHistory({ initialEntries: [route] }),
  }:{
    // initialState:AppState,
    // store:any,
    // route:any,
    // history:any,
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

describe('<Register /> Component', () => {
  it('renders Register component', async () => {
    const { getByText } = renderWithRedux(
      <Route path="/user/register">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props)=> <Register {...props} />}
      </Route>,
      {
        route: '/user/register',
      },
    );

    expect(getByText(/Username/i).textContent).toBe('Username');
    expect(getByText(/^Password$/i).textContent).toBe('Password');
    expect(getByText(/Repeat Password/i).textContent).toBe('Repeat Password');
    expect(getByText(/E-mail/i).textContent).toBe('E-mail');
    expect(getByText(/Already have an account?/i).textContent).toBe('Already have an account?Login');
    expect(getByText(/^Login$/i).textContent).toBe('Login');
  });

  it('can input all correct values', () => {
    const { getByLabelText } = renderWithRedux(
      <Route path="/user/register">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Register {...props} />}
      </Route>,
      {
        route: '/user/register',
      },
    );
    const username = getByLabelText('Username') as HTMLInputElement;
    const email = getByLabelText('E-mail') as HTMLInputElement;
    const password = getByLabelText('Password') as HTMLInputElement;
    const confirmPassword = getByLabelText('Repeat Password') as HTMLInputElement;

    fireEvent.change(username, { target: { value: 'testUser1' } });
    fireEvent.change(email, { target: { value: 'testEmail@test.lt' } });
    fireEvent.change(password, { target: { value: 'testas1' } });
    fireEvent.change(confirmPassword, { target: { value: 'testas1' } });

    expect(username.value).toBe('testUser1');
    expect(email.value).toBe('testEmail@test.lt');
    expect(password.value).toBe('testas1');
    expect(confirmPassword.value).toBe('testas1');
  });

  it('incorrect inputs + prints error if register unsuccessful', async () => {
    const { getByLabelText, getByText } = renderWithRedux(
      <Route path="/user/register">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Register {...props} />}
      </Route>,
      {
        route: '/user/register',
      },
    );
    const username = getByLabelText('Username') as HTMLInputElement;
    const email = getByLabelText('E-mail') as HTMLInputElement;
    const password = getByLabelText('Password') as HTMLInputElement;
    const confirmPassword = getByLabelText('Repeat Password') as HTMLInputElement;

    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.change(email, { target: { value: 'emaiil' } });
    fireEvent.change(password, { target: { value: 'testa' } });
    fireEvent.change(confirmPassword, { target: { value: 'testas1' } });

    expect(username.value).toBe('test');
    expect(email.value).toBe('emaiil');
    expect(password.value).toBe('testa');
    expect(confirmPassword.value).toBe('testas1');

    expect(getByText('username must be 5-30 characters long').textContent).toBe(' username must be 5-30 characters long');
    expect(getByText('email is not valid').textContent).toBe(' email is not valid');
    expect(getByText('password must be at least 6 characters long').textContent).toBe(' password must be at least 6 characters long');
    expect(getByText('passwords should match').textContent).toBe(' passwords should match');
  });
});
