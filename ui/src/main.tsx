import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ThemeProvider from './theme/ThemeProvider.tsx';

import { CssBaseline } from '@mui/material';
import { SidebarProvider } from './contexts/SidebarContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidebarProvider>
    <ThemeProvider>
      
    {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
        <CssBaseline />
        <App/>
      {/* </LocalizationProvider> */}
    </ThemeProvider>
    </SidebarProvider>
  </React.StrictMode>,
);
