import { h, FunctionComponent } from 'preact';
import Icon, { IconKeys } from '../icon/icon';
import Link from '../link/link';

interface NavbarItemProps {
  icon: IconKeys;
  text: string;
  link?: string;
  flipIconX?: boolean;
  onClick?: (e: MouseEvent) => void;
}

const NavbarItem: FunctionComponent<NavbarItemProps> = (props) => {
  const { icon, text, link, flipIconX, onClick } = props;
  return (
    <Link href={link} onClick={onClick} class="nav-item">
      <Icon name={icon} flipX={flipIconX} /> {text}
    </Link>
  );
};

export default NavbarItem;
