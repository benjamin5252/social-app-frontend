import { Dispatch, SetStateAction, createContext, useState } from 'react';
import { ContextProviderProps } from '../../libs/interfaces';
import CircularProgress from '@mui/material/CircularProgress';
import './loading.scss';

interface LoadingUiContextInterface {
  setMainLoading: Dispatch<SetStateAction<boolean>> | (() => void);
}

export const LoadingUiContext = createContext<LoadingUiContextInterface>({
  setMainLoading: () => {},
});

export const LoadingUiContextProvider = ({
  children,
}: ContextProviderProps) => {
  const [mainLoading, setMainLoading] = useState(false);

  return (
    <LoadingUiContext.Provider value={{ setMainLoading }}>
      <div>
        <div className="contentBox">{children}</div>
        {mainLoading && (
          <div className="loadingBox">
            <CircularProgress />
          </div>
        )}
      </div>
    </LoadingUiContext.Provider>
  );
};
