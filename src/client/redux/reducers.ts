import { 
  RECEIVE_CURRENT_USER, 
  LOGOUT_CURRENT_USER,
  AppState,
  ActionTypes, 
} from './actions';

export const initialState:AppState = { userId: '', username: '' };

export default (state = initialState, action:ActionTypes) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return action.user;
    case LOGOUT_CURRENT_USER:
      return initialState;
    default:
      return state;
  }
};
