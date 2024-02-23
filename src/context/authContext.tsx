import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

import { UserObj, ContextProviderProps } from '../libs/interfaces';

interface AuthContextInterface {
  currentUser: UserObj | null;
  login: (inputs: { username: string; password: string }) => Promise<string>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthContextProvider = ({ children }: ContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null'),
  );

  const login = async (inputs: { username: string; password: string }) => {
    const res = await axios.post(process.env.API + '/api/auth/login', inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data.content);
    return res.data;
  };

  const logout = async () => {
    await axios.post(process.env.API + '/upload/', {
      withCredentials: true,
    });
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
