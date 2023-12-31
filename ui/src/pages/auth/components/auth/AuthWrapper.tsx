import { ReactNode } from 'react';

// material-ui
import { Box, Grid } from '@mui/material';

// project import
// import AuthFooter from 'components/cards/AuthFooter';
import Logo from '../../../../components/logo';
import AuthCard from './AuthCard';

// assets
import LogoIcon from '../../../../components/logo/LogoIcon';
import { Stack } from '@mui/system';

interface Props {
  children: ReactNode;
}

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }: Props) => (
  <Box sx={{ minHeight: '100vh' }}>
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        minHeight: '100vh',
      }}
    >
      {/* <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
       */}
      <Stack direction={'row'} sx={{ paddingLeft: '1em' }} gap={1}>
        <LogoIcon width="50px" />
        <Logo />
      </Stack>

      {/* </Grid> */}
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            minHeight: {
              xs: 'calc(100vh - 210px)',
              sm: 'calc(100vh - 134px)',
              md: 'calc(100vh - 112px)',
            },
          }}
        >
          <Grid item>
            <AuthCard>{children}</AuthCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}></Grid>
    </Grid>
  </Box>
);

export default AuthWrapper;
