import { RECEIVE_CURRENT_USER, LOGOUT_CURRENT_USER } from './actions';

export const initialState:{userId:string, username:string} = { userId: '', username: '' };

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return action.user;
    case LOGOUT_CURRENT_USER:
      return initialState;
    default:
      return state;
  }
};
