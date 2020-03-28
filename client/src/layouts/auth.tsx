import { h, FunctionComponent } from 'preact';
import './auth.sass';

interface AuthLayoutProps {}

const AuthLayout: FunctionComponent<AuthLayoutProps> = props => {
  const { children } = props;

  return (
    <div class="auth-layout">
      <div class="content mt-10">{children}</div>
    </div>
  );
};

export default AuthLayout;
