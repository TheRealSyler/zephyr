import { h, FunctionComponent } from 'preact';

import Router, { route } from 'preact-router';

import AsyncRouteComponent from './components/asyncRoute';
import RedirectComponent from './components/redirect';
import { POST } from './api';
import { useState, useEffect } from 'preact/hooks';
import MainLayout from './layouts/main';
import AuthLayout from './layouts/auth';
import { decodeAccessToken } from './auth';

interface AppProps {}

// TODO ?: Add messages to entire app, use the context api.

const App: FunctionComponent<AppProps> = () => {
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    const res = await POST('auth/refreshToken');
    if (res.status === 200) {
      const payload = decodeAccessToken(res.body.accessToken);
      if (payload) {
        const timeToNextRefresh = payload.exp! * 1000 - Date.now() - 1000;
        setTimeout(() => {
          refreshToken();
        }, timeToNextRefresh);
      } else {
        route('/login', true);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      refreshToken();
    }
  }, [loading]);

  return (
    <div
      /**DO NOT REMOVE why ?, because it hides the flickering when the page first loads. */
      class="start-animation"
    >
      <Router>
        <AsyncRouteComponent
          path="/home"
          layout={MainLayout}
          component={() => import(/*webpackChunkName: "HomeView"*/ './views/home')}
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
  );
};

export default App;
