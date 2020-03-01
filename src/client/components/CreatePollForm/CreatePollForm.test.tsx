import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
// import axiosMock from 'axios';
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

    expect(getByText(/Create/i).textContent).toBe('Create');
    expect(getByText(/^Poll$/i).textContent).toBe('Poll');
    expect(getByText(/Poll name/i).textContent).toBe('Poll name');
    expect(getByText(/Poll question\/statement/i).textContent).toBe('Poll question/statement');
    expect(getByText(/Poll options/i).textContent).toBe('Poll options');
    expect(getByText(/\+/i).textContent).toBe(' + ');
    expect(getByText(/Submit/i).textContent).toBe('Submit');
    expect((getByLabelText('option1') as HTMLInputElement).value).toBe('');
    expect((getByLabelText('option2') as HTMLInputElement).value).toBe('');
  });

  it('adds options on click', () => {
    const { getByText, getByLabelText } = renderWithRedux(
      <Route path="/user/create-poll">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {(props) => <CreatePollForm {...props} />}
      </Route>,
      {
        route: '/user/create-poll',
      },
    );
    fireEvent.click(getByText(/\+/i));
    expect((getByLabelText('option3') as HTMLInputElement).value).toBe('');

    fireEvent.click(getByText(/\+/i));
    expect((getByLabelText('option4') as HTMLInputElement).value).toBe('');
  });

  it('can input all values', () => {
    const { getByText, getByLabelText } = renderWithRedux(
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

    const option1Input = getByLabelText('option1') as HTMLInputElement;
    fireEvent.change(option1Input, { target: { value: 'One' } });
    expect(option1Input.value).toBe('One');

    const option2Input = getByLabelText('option2') as HTMLInputElement;
    fireEvent.change(option2Input, { target: { value: 'Two' } });
    expect(option2Input.value).toBe('Two');

    fireEvent.click(getByText(/\+/i));
    expect((getByLabelText('option3') as HTMLInputElement).value).toBe('');
    const option3Input = getByLabelText('option3') as HTMLInputElement;
    fireEvent.change(option3Input, { target: { value: 'Three' } });
    expect(option3Input.value).toBe('Three');
  });
});

// #handle submit
