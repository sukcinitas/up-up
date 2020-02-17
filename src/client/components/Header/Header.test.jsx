import React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
// eslint-disable-next-line no-unused-vars
import reducer, { initialState } from '../../redux/reducers';

import Header from './Header.jsx';

afterEach(cleanup);

function renderWithRedux(
  ui,
  { // eslint-disable-next-line no-shadow
    initialState,
    store = createStore(reducer, initialState),
    route = '/',
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

describe('<Header /> Component', () => {
  it('renders header component when default redux state - user not loged in', () => {
    const { getByText } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Header {...props} />}
      </Route>,
      {
        route: '/',
      },
    );
    expect(getByText('Voting App').textContent).toBe('Voting App');
    expect(getByText('Login').textContent).toBe('Login');
    expect(getByText('Register').textContent).toBe('Register');
  });

  it('renders header component when user is loged in', () => {
    const user = { username: 'panemune', userId: 'g545465' };
    const { getByText } = renderWithRedux(
      <Route path="/">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <Header {...props} />}
      </Route>,
      {
        route: '/',
        initialState: { ...user },
      },
    );
    expect(getByText('Voting App').textContent).toBe('Voting App');
    expect(getByText(user.username).textContent).toBe('panemune');
    expect(getByText('Sign out').textContent).toBe('Sign out');
  });

  // it('renders header component when user logs out', async () => {
  //   const user = { username: 'panemune', userId: 'g545465' };
  //   const { getByText } = renderWithRedux(
  //     <Route path="/">
  //       {/* eslint-disable-next-line react/jsx-props-no-spreading */}
  //       {(props) => <Header {...props} />}
  //     </Route>,
  //     {
  //       route: '/',
  //       initialState: { ...user },
  //     },
  //   );
  //   expect(getByText(user.username).textContent).toBe('panemune');

  //   jest.mock('axios');
  //   axiosMock.get.mockResolvedValueOnce();
  //   fireEvent.click(getByText('Sign out'))

  //   await waitForElement(() => getByText('Login'));

  //   expect(axiosMock.get).toHaveBeenCalledTimes(1);
  //   expect(getByText('Login').textContent).toBe('Login');
  //   expect(getByText('Register').textContent).toBe('Register');
  // });
});
