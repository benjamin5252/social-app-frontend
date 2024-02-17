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
import { SnackbarProvider } from 'notistack';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <AuthContextProvider>
        <WebSocketContextProvider>
          <SnackbarProvider maxSnack={5}>
            <LoadingUiContextProvider>
              <App />
            </LoadingUiContextProvider>
          </SnackbarProvider>
        </WebSocketContextProvider>
      </AuthContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>,
);
