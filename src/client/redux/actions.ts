// action type constants + action creators
export interface User {
  username:string,
  userId:string,
}

export interface AppState {
  username:string,
  userId:string,
}

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';

interface ReceiveCurrentUserAction {
  type:typeof RECEIVE_CURRENT_USER;
  user:User
}

interface LogoutCurrentUserAction {
  type:typeof LOGOUT_CURRENT_USER;
}
export type ActionTypes = ReceiveCurrentUserAction | LogoutCurrentUserAction;

export const receiveCurrentUser = (user:User):ActionTypes => ({
  type: RECEIVE_CURRENT_USER,
  user,
});

export const logoutCurrentUser = ():ActionTypes => ({
  type: LOGOUT_CURRENT_USER,
});
