import { h, FunctionComponent } from 'preact';
import './navbar.sass';

import LinkComponent from '../link/link';
import { LogOut } from '../../auth';

interface NavbarComponentProps {}

const NavbarComponent: FunctionComponent<NavbarComponentProps> = props => {
  const {} = props;

  return (
    <nav class="navbar">
      <LinkComponent href="/home">Home</LinkComponent>
      <LinkComponent href="/test">Test</LinkComponent>
      <LinkComponent href="/login">Login</LinkComponent>
      <LinkComponent onClick={LogOut} href="/logout">
        Log out
      </LinkComponent>
    </nav>
  );
};

export default NavbarComponent;
