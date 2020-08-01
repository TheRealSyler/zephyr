import { h, FunctionComponent } from 'preact';

import Router from 'preact-router';

import AsyncRoute from './components/asyncRoute';
import RedirectComponent from './components/redirect';
import { POST } from './api';
import { useState, useEffect } from 'preact/hooks';
import MainLayout from './layouts/main';
import AuthLayout from './layouts/auth';
import { decodeAccessToken } from './auth';
import Loading from './components/loading/loading';
import EmptyLayout from './layouts/empty';

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
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      refreshToken();
    }
  }, [loading]);

  // const Auth =  useContext(AuthData)

  return (
    <div
      /**DO NOT REMOVE why ?, because it hides the flickering when the page first loads. */
      class="start-animation"
    >
      {loading ? (
        <Loading />
      ) : (
        <Router>
          <AsyncRoute
            path="/home"
            layout={MainLayout}
            component={() => import(/*webpackChunkName: "HomeView"*/ './views/home')}
          />
          <AsyncRoute
            path="/user/:user"
            layout={MainLayout}
            component={() => import(/*webpackChunkName: "user"*/ './views/user')}
          />
          <AsyncRoute
            path="/article/:user/:name"
            layout={MainLayout}
            component={() => import(/*webpackChunkName: "article"*/ './views/article')}
          />
          <AsyncRoute
            path="/newArticle"
            layout={MainLayout}
            component={() => import(/*webpackChunkName: "newArticle"*/ './views/newArticle')}
          />
          <AsyncRoute
            path="/edit/article/:name"
            layout={MainLayout}
            component={() => import(/*webpackChunkName: "editArticle"*/ './views/editArticle')}
          />

          <AsyncRoute
            path="/login"
            layout={AuthLayout}
            component={() => import(/*webpackChunkName: "LoginView"*/ './views/login')}
          />
          <AsyncRoute
            path="/signUp"
            layout={AuthLayout}
            component={() => import(/*webpackChunkName: "signUpView"*/ './views/signUp')}
          />

          <AsyncRoute
            path="/:page*"
            default
            layout={EmptyLayout}
            component={() => import(/*webpackChunkName: "notFound"*/ './views/notFound')}
          />

          <RedirectComponent to="/home" path="/"></RedirectComponent>
        </Router>
      )}
    </div>
  );
};

export default App;
