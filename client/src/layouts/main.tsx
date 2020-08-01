import { h, FunctionComponent } from 'preact';
import Navbar from '../components/navbar/navbar';
import './main.sass';

interface MainLayoutProps {}

const MainLayout: FunctionComponent<MainLayoutProps> = (props) => {
  const { children } = props;

  return (
    <div class="main-layout">
      <div class="main-layout-content">{children}</div>
      <Navbar />
    </div>
  );
};

export default MainLayout;
