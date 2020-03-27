import { h, FunctionComponent } from 'preact';
import IconComponent, { IconKeys } from '../icon/icon';
import LinkComponent from '../link/link';

interface NavbarItemComponentProps {
  icon: IconKeys;
  text: string;
  link?: string;
  flipIconX?: boolean;
  onClick?: (e: MouseEvent) => void;
}

const NavbarItemComponent: FunctionComponent<NavbarItemComponentProps> = props => {
  const { icon, text, link, flipIconX, onClick } = props;
  return (
    <LinkComponent href={link} onClick={onClick} class="nav-item">
      <IconComponent name={icon} flipX={flipIconX} /> {text}
    </LinkComponent>
  );
};

export default NavbarItemComponent;
