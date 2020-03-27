import { h, FunctionComponent } from 'preact';
import NavbarComponent from '../components/navbar/navbar';

interface MainLayoutProps {}

const MainLayout: FunctionComponent<MainLayoutProps> = props => {
  const { children } = props;

  return (
    <div class="main-layout">
      <NavbarComponent />
      {children}
    </div>
  );
};

export default MainLayout;
