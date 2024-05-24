import {
  RECEIVE_CURRENT_USER,
  LOGOUT_CURRENT_USER,
  GET_STARRED_POLLS,
  AppState,
  ActionTypes,
} from './actions';

export const initialState: AppState = {
  userId: '',
  username: '',
  starredPolls: [],
};

export default (state = initialState, action: UnknownAction ) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      // extraProps
      return { ...state, ...action.user };
    case LOGOUT_CURRENT_USER:
      return initialState;
    case GET_STARRED_POLLS:
      return { ...state, starredPolls: action.starredPolls };
    default:
      return state;
  }
};
