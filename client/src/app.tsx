import { h, FunctionComponent, createContext } from 'preact';

import Router, { route } from 'preact-router';

import AsyncRouteComponent from './components/asyncRoute';
import RedirectComponent from './components/redirect';
import { POST } from './api';
import { useState, useEffect } from 'preact/hooks';
import MainLayout from './layouts/main';
import AuthLayout from './layouts/auth';
import { GuardRoutes } from './auth';

interface AppProps {}

export interface AuthContext {
  readonly accessToken: null | string;
  loading: boolean;
  setAccessToken: (value: string | null) => void;
}
export const AuthContext = createContext<AuthContext>({
  accessToken: null,
  loading: true,
  setAccessToken: value => {}
});

// TODO: Add messages to entire app, use the context api.

const App: FunctionComponent<AppProps> = props => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    const res = await POST('auth/refreshToken');
    if (res.status === 200) {
      setAccessToken(res.body.accessToken);

      try {
        const token = JSON.parse(atob(res.body.accessToken.split('.')[1]));
        const timeToNextRefresh = token.exp * 1000 - Date.now() - 1000;
        setTimeout(() => {
          refreshToken();
        }, timeToNextRefresh);
      } catch {
        route('/login', true);
      }
    }

    setLoading(false);

    GuardRoutes({
      accessToken: res.body.accessToken,
      loading: false
    });
  };

  useEffect(() => {
    if (authContext.loading) {
      refreshToken();
    }
  });

  const authContext: AuthContext = {
    accessToken,
    loading,
    setAccessToken: value => {
      setAccessToken(() => value);
    }
  };

  return (
    <AuthContext.Provider value={authContext}>
      <div
        /**DO NOT REMOVE why ?, because it hides the flickering when the page first loads. */
        class="start-animation"
      >
        <Router
          onChange={e => {
            GuardRoutes(authContext);
          }}
        >
          <AsyncRouteComponent
            path="/home"
            layout={MainLayout}
            component={() => import(/*webpackChunkName: "HomeView"*/ './views/home')}
          />
          <AsyncRouteComponent
            path="/test"
            layout={MainLayout}
            component={() => import(/*webpackChunkName: "TestView"*/ './views/test')}
          />
          <AsyncRouteComponent
            path="/login"
            layout={AuthLayout}
            component={() => import(/*webpackChunkName: "LoginView"*/ './views/login')}
          />
          <AsyncRouteComponent
            path="/signUp"
            layout={AuthLayout}
            component={() => import(/*webpackChunkName: "signUpView"*/ './views/signUp')}
          />
          <RedirectComponent to="/home" default />
        </Router>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
