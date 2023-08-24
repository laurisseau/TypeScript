'use client';
import { createContext, useReducer, useEffect } from 'react';

const initialState = {
  userInfo: null,
};

type UserInfo = {
  username: string;
  accessToken: string;
  email: string;
  preferred_username: string;
  sub: string;
  token: string;
  ['cognito:username']: string;
  ['custom:link']: string;
  ['custom:role']: string;
  ['custom:website']: string;
};

type StateType = {
  userInfo: UserInfo | null;
};

type ActionType = {
  type: 'USER_SIGNIN' | 'USER_SIGNOUT';
  payload: UserInfo | null;
};

export const Context = createContext<{
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => {} });

const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
      };
  }
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  // Load user info from localStorage on the client-side
  useEffect(() => {
    const userInfoFromLocalStorage = localStorage.getItem('userInfo');

    if (userInfoFromLocalStorage) {
      dispatch({
        type: 'USER_SIGNIN',
        payload: JSON.parse(userInfoFromLocalStorage),
      });
    }
  }, []);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
