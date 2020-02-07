import { RECEIVE_CURRENT_USER, LOGOUT_CURRENT_USER } from './actions';

export default (state = { userId: '', username: '' }, action) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return action.user;
    case LOGOUT_CURRENT_USER:
      return { userId: '', username: '' };
    default:
      return state;
  }
};
