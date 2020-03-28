import { h, FunctionComponent } from 'preact';
import NavbarComponent from '../components/navbar/navbar';
import './main.sass';

interface MainLayoutProps {}

const MainLayout: FunctionComponent<MainLayoutProps> = props => {
  const { children } = props;

  return (
    <div class="main-layout">
      <div class="main-layout-content">{children}</div>
      <NavbarComponent />
    </div>
  );
};

export default MainLayout;
