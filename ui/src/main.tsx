import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { CssBaseline } from '@mui/material';
import ThemeCustomization from './themes/index.tsx';
import { ConfigProvider } from './contexts/ConfigContext.tsx';
import Locales from './components/Locales.tsx';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <ThemeCustomization>
        <Locales>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Locales>
      </ThemeCustomization>
    </ConfigProvider>
  </React.StrictMode>,
);
