import { experimentalStyled as styled, useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

const Level1Box = styled(Box)({
  // border: `1px solid ${theme.palette.divider}`,
  color: '#6495ed ',
  fontWeight: 'bold',
  fontSize: 'larger',
});
export const Level2Box = styled(Box)({
  // border: `1px solid ${theme.palette.divider}`,
  color: '#CD7F32',
  fontWeight: 'bold',
  fontSize: 'medium',
});
export const OuterBox = styled(Box)({
  // border: `1px solid ${theme.palette.divider}`,
  color: 'green',
  fontWeight: 'bold',
  fontSize: 'medium',
  marginBottom: '15px',
});
export const InnerBox = styled(Box)({
  border: '0 solid #f0f0f0',
  color: '#003665',
  marginTop: '10px',
  marginBottom: '10px',
  fontSize: 'small',
});
