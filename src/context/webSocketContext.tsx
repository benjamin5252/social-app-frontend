import { createContext, useEffect, useState, useContext } from 'react';
import { AuthContext } from './authContext';
import { ws, wsConnect } from '../libs/websocket';
import { ContextProviderProps } from '../libs/interfaces';

interface WebSocketContextInterface {
  wsMessage: string;
  wsSentObj: (input: object) => void;
  isWsConnected: boolean;
}

export const WebSocketContext = createContext<WebSocketContextInterface>({
  wsMessage: '',
  wsSentObj: ({}) => {},
  isWsConnected: false,
});

export const WebSocketContextProvider = ({
  children,
}: ContextProviderProps) => {
  const [wsMessage, setWsMessage] = useState('');
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleMessageChange = (event: { data: string }) => {
    setWsMessage(event.data);
  };

  const wsSentObj = (msgObj: object) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msgObj));
    }
  };

  useEffect(() => {
    const loginWs = async () => {
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser));
        if (!(ws && ws.readyState === WebSocket.OPEN)) {
          await wsConnect();
          setIsWsConnected(true);
        }

        if (ws && ws.readyState === WebSocket.OPEN && !isLoggedIn) {
          ws.onmessage = handleMessageChange;
          ws.send(JSON.stringify({ method: 'login', userId: currentUser.id }));
          setIsLoggedIn(true);
        }
      } else {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
          setIsLoggedIn(false);
          setIsWsConnected(false);
        }
      }
    };

    loginWs();
  }, [currentUser, isWsConnected, isLoggedIn]);

  return (
    <WebSocketContext.Provider value={{ wsMessage, wsSentObj, isWsConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
