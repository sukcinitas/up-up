// action type constants + action creators
import axios from 'axios';
import { Dispatch } from 'redux';

export interface User {
  username: string;
  userId: string;
}
export interface AppState {
  username: string;
  userId: string;
  starredPolls: Array<string>;
}

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';
export const GET_STARRED_POLLS = 'GET_STARRED_POLLS';
export const GET_STARRED_POLLS_ASYNC = 'GET_STARRED_POLLS_ASYNC';

interface ReceiveCurrentUserAction {
  type: typeof RECEIVE_CURRENT_USER;
  user: User;
}
interface LogoutCurrentUserAction {
  type: typeof LOGOUT_CURRENT_USER;
}
interface GetStarredPollsAction {
  type: typeof GET_STARRED_POLLS;
  starredPolls: Array<string>;
}
export type ActionTypes =
  | ReceiveCurrentUserAction
  | LogoutCurrentUserAction
  | GetStarredPollsAction;

export const receiveCurrentUser = (user: User): ActionTypes => ({
  type: RECEIVE_CURRENT_USER,
  user,
});

export const logoutCurrentUser = (): ActionTypes => ({
  type: LOGOUT_CURRENT_USER,
});

export const getStarredPolls = (
  starredPolls: Array<string>,
): ActionTypes => ({
  type: GET_STARRED_POLLS,
  starredPolls,
});
export const getStarredPollsAsync = (username: string): any => (
  dispatch: Dispatch,
) => {
  axios.get(`/api/user/profile/${username}`).then((res) => {
    dispatch(getStarredPolls([...res.data.user[0].starredPolls]));
  });
};
