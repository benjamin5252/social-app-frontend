import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import authApi from '../api/auth';

import { UserObj, ContextProviderProps } from '../libs/interfaces';

interface AuthContextInterface {
  currentUser: UserObj | null;
  login:
    | ((inputs: { username: string; password: string }) => Promise<string>)
    | (() => void);
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface>({
  currentUser: {
    name: '',
    username: '',
    profilePic: '',
    id: 0,
  },
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }: ContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null'),
  );

  const login = async (inputs: { username: string; password: string }) => {
    const res = await authApi.login(inputs)
    setCurrentUser(res.data.content);
    return res.data;
  };

  const logout = async () => {
    await authApi.logout()
    setCurrentUser(null);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
