import { h, FunctionComponent } from 'preact';
import * as github from '@fortawesome/free-brands-svg-icons/faGithub';
import * as home from '@fortawesome/free-solid-svg-icons/faHome';
import * as logout from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import * as bars from '@fortawesome/free-solid-svg-icons/faBars';
import './icon.sass';

const icons = {
  github,
  home,
  logout,
  bars
};

export type IconKeys = keyof typeof icons;

const IconComponent: FunctionComponent<{ name: IconKeys; flipX?: boolean }> = props => {
  const icon = icons[props.name];
  if (!icon) {
    return <div class="icon"> </div>;
  }

  return (
    <svg class={`icon${props.flipX ? ' icon-flipX' : ''}`} role="img" viewBox="0 0 512 512">
      <path fill="currentColor" d={icon.svgPathData}></path>
    </svg>
  );
};

export default IconComponent;
