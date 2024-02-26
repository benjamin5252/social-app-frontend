import { createContext, useEffect, useState } from 'react';
import { ContextProviderProps } from '../libs/interfaces';

interface DarkModeContextInterface {
  darkMode: boolean;
  toggle: () => void;
}

export const DarkModeContext = createContext<DarkModeContextInterface>({
  darkMode: false,
  toggle: () => {},
});

export const DarkModeContextProvider = ({ children }: ContextProviderProps) => {
  const [darkMode, setDarkMode] = useState(() => {
    const localData = localStorage.getItem('darkMode');
    if (localData) return JSON.parse(localData);
    return false;
  });

  const toggle = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
};
