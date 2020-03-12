import { FunctionComponent } from 'preact';
import { route } from 'preact-router';

interface RedirectComponentProps {
  to: string;
}

const RedirectComponent: FunctionComponent<RedirectComponentProps> = props => {
  const { to } = props;
  route(to, true);
  return null;
};

export default RedirectComponent;
