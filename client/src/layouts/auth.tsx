import { h, FunctionComponent } from 'preact';

interface AuthLayoutProps {}

const AuthLayout: FunctionComponent<AuthLayoutProps> = props => {
  const { children } = props;

  return (
    <div class="main">
      <div class="content mt-10">{children}</div>
    </div>
  );
};

export default AuthLayout;
