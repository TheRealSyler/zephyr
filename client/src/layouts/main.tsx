import { h, FunctionComponent, Fragment } from 'preact';
import NavbarComponent from '../components/navbar/navbar';
interface MainLayoutProps {}

const MainLayout: FunctionComponent<MainLayoutProps> = props => {
  const { children } = props;

  return (
    <Fragment>
      <NavbarComponent />
      {children}
    </Fragment>
  );
};

export default MainLayout;
