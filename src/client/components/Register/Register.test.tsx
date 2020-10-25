import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import {
  render, cleanup, fireEvent,
} from '@testing-library/react';
import { AppState } from '../../redux/actions';
import reducer, { initialState } from '../../redux/reducers';

import Register from './Register';

function renderWithRedux(
  ui:JSX.Element,
  {
    state = initialState,
    store = createStore(reducer, state),
    route = '/user/register',
    history = createMemoryHistory({ initialEntries: [route] }),
  }:{
    state?:AppState,
    store?:Store,
    route?:string,
    history?:MemoryHistory
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
        {(props:any) => <Register {...props} />}
      </Route>,
      {
        route: '/user/register',
      },
    );

    expect(getByText(/Username/i).textContent).toBe('Username');
    expect(getByText(/^Password$/i).textContent).toBe('Password');
    expect(getByText(/E-mail/i).textContent).toBe('E-mail');
    expect(getByText(/Already have an account?/i).textContent).toBe('Already have an account? Login');
    expect(getByText(/^Login$/i).textContent).toBe('Login');
  });

  it('can input all correct values', () => {
    const { getByLabelText } = renderWithRedux(
      <Route path="/user/register">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props:any) => <Register {...props} />}
      </Route>,
      {
        route: '/user/register',
      },
    );
    const username = getByLabelText('Username') as HTMLInputElement;
    const email = getByLabelText('E-mail') as HTMLInputElement;
    const password = getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(username, { target: { value: 'testUser1' } });
    fireEvent.change(email, { target: { value: 'testEmail@test.lt' } });
    fireEvent.change(password, { target: { value: 'testas1' } });

    expect(username.value).toBe('testUser1');
    expect(email.value).toBe('testEmail@test.lt');
    expect(password.value).toBe('testas1');
  });

  it('incorrect inputs + prints error if register unsuccessful', async () => {
    const { getByLabelText, getByText } = renderWithRedux(
      <Route path="/user/register">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props:any) => <Register {...props} />}
      </Route>,
      {
        route: '/user/register',
      },
    );
    const username = getByLabelText('Username') as HTMLInputElement;
    const email = getByLabelText('E-mail') as HTMLInputElement;
    const password = getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.change(email, { target: { value: 'emaiil' } });
    fireEvent.change(password, { target: { value: 'testa' } });

    expect(username.value).toBe('test');
    expect(email.value).toBe('emaiil');
    expect(password.value).toBe('testa');

    expect(getByText('Username must be 5-30 characters long!').textContent).toBe(' Username must be 5-30 characters long!');
    expect(getByText('Email is not valid!').textContent).toBe(' Email is not valid!');
    expect(getByText('Password must be at least 10 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character!').textContent).toBe(' Password must be at least 10 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character!');
  });
});
