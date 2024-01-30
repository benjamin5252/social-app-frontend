import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/authContext';
import { DarkModeContextProvider } from './context/darkModeContext';
import { WebSocketContextProvider } from './context/webSocketContext';
import { LoadingUiContextProvider } from './context/loadingUiContext/loadingUiContext';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <AuthContextProvider>
        <WebSocketContextProvider>
          <LoadingUiContextProvider>
            <App />
          </LoadingUiContextProvider>
        </WebSocketContextProvider>
      </AuthContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>,
);
