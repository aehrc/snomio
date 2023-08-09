import React, { ReactNode, useState } from 'react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import { themeCreator } from './base';

export const ThemeContext = React.createContext(
  null!
  // (themeName: string): void => {}
);

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProviderWrapper = ({children}: ThemeProviderProps) => {
  const curThemeName = localStorage.getItem('appTheme') || 'PureLightTheme';
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <StyledEngineProvider>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider>
  );
};

export default ThemeProviderWrapper;
