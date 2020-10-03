import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
import reducer, { initialState } from '../../redux/reducers';

import CreatePollForm from './CreatePollForm';

function renderWithRedux(
  ui,
  {
    state = initialState,
    store = createStore(reducer, state),
    route = '/user/create-poll',
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

describe('<CreatePollForm /> Component', () => {
  it('renders createPollForm', async () => {
    const { getByText, getByLabelText } = renderWithRedux(
      <Route path="/user/create-poll">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <CreatePollForm {...props} />}
      </Route>,
      {
        route: '/user/create-poll',
      },
    );

    expect(getByText(/Create a Poll/i).textContent).toBe('Create a Poll');
    expect(getByText(/Poll name/i).textContent).toBe('Poll name');
    expect(getByText(/Poll question\/statement/i).textContent).toBe('Poll question/statement');
    expect(getByText(/Poll options/i).textContent).toBe('Poll options');
    expect(getByText(/Submit/i).textContent).toBe('Submit');
    expect((getByLabelText('0') as HTMLInputElement).value).toBe('');
    expect((getByLabelText('1') as HTMLInputElement).value).toBe('');
  });

  it('adds options on click', () => {
    const { getByLabelText, getByTestId } = renderWithRedux(
      <Route path="/user/create-poll">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <CreatePollForm {...props} />}
      </Route>,
      {
        route: '/user/create-poll',
      },
    );
    fireEvent.click(getByTestId('plus'));
    expect((getByLabelText('2') as HTMLInputElement).value).toBe('');

    fireEvent.click(getByTestId('plus'));
    expect((getByLabelText('3') as HTMLInputElement).value).toBe('');
  });

  it('can input all values', () => {
    const { getByLabelText, getByTestId } = renderWithRedux(
      <Route path="/user/create-poll">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <CreatePollForm {...props} />}
      </Route>,
      {
        route: '/user/create-poll',
      },
    );

    const nameInput = getByLabelText('Poll name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Test name' } });
    expect(nameInput.value).toBe('Test name');

    const questionInput = getByLabelText('Poll question/statement') as HTMLInputElement;
    fireEvent.change(questionInput, { target: { value: 'Test question' } });
    expect(questionInput.value).toBe('Test question');

    const option1Input = getByLabelText('0') as HTMLInputElement;
    fireEvent.change(option1Input, { target: { value: 'One' } });
    expect(option1Input.value).toBe('One');

    const option2Input = getByLabelText('1') as HTMLInputElement;
    fireEvent.change(option2Input, { target: { value: 'Two' } });
    expect(option2Input.value).toBe('Two');

    fireEvent.click(getByTestId('plus'));
    expect((getByLabelText('2') as HTMLInputElement).value).toBe('');
    const option3Input = getByLabelText('2') as HTMLInputElement;
    fireEvent.change(option3Input, { target: { value: 'Three' } });
    expect(option3Input.value).toBe('Three');
  });
});

// #handle submit
