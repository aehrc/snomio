import { useEffect } from 'react';
import useUserStore from '../stores/UserStore';
import useAuthStore from '../stores/AuthStore';
import { useNavigate } from 'react-router-dom';
import { UserState } from '../types/user';
import Loading from '../components/Loading';
import useApplicationConfigStore from '../stores/ApplicationConfigStore';
import ApplicationConfig from '../types/applicationConfig';
import Login from '../components/Login';

function AuthorisationLayout() {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const applicationConfigStore = useApplicationConfigStore();
  const navigate = useNavigate();

  useEffect(() => {
    authStore.updateFetching(true);
    fetch('/config')
      .then(res => {
        res
          .json()
          .then((config: ApplicationConfig) => {
            applicationConfigStore.updateApplicationConfigState(config);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });

    fetch('/api/auth')
      .then(response => {
        console.log(response);

        if (response.status === 200) {
          authStore.updateAuthorised(true);

          response
            .json()
            .then((json: UserState) => {
              userStore.updateUserState(json);
              authStore.updateFetching(false);
            })
            .catch(err => {
              // TODO: fix me, proper error handling
              console.log(err);
            });
          if (authStore.desiredRoute !== '') {
            navigate(authStore.desiredRoute);
          } else {
            navigate('/dashboard');
          }
        } else {
          console.log(' not 200, authstore should be updated');
          authStore.updateAuthorised(false);
          authStore.updateFetching(false);
          userStore.updateUserState({
            login: null,
            firstName: null,
            lastName: null,
            email: null,
            roles: [],
          });
          authStore.updateFetching(false);
        }
      })
      .catch(err => {
        // TODO: fix me, proper error handling
        console.log('in error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{authStore.fetching ? <Loading /> : <Login />}</>;
}

export default AuthorisationLayout;
