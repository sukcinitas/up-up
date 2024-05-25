import { Tuple, configureStore } from '@reduxjs/toolkit';

import usersReducer from './reducers/usersSlice';
import { thunk } from 'redux-thunk';

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  devTools: true,
  middleware: () => new Tuple(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
