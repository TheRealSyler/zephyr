import { h, FunctionComponent } from 'preact';
import * as github from '@fortawesome/free-brands-svg-icons/faGithub';
import * as google from '@fortawesome/free-brands-svg-icons/faGoogle';
import * as home from '@fortawesome/free-solid-svg-icons/faHome';
import * as logout from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import * as list from '@fortawesome/free-solid-svg-icons/faList';
import * as edit from '@fortawesome/free-solid-svg-icons/faEdit';
import './icon.sass';

const icons = {
  github,
  home,
  logout,
  list,
  edit,
  google,
};

export type IconKeys = keyof typeof icons;

const IconComponent: FunctionComponent<{ name: IconKeys; flipX?: boolean }> = (props) => {
  const icon = icons[props.name];
  if (!icon) {
    return <div class="icon"> </div>;
  }

  return (
    <svg
      class={`icon${props.flipX ? ' icon-flipX' : ''}`}
      role="img"
      viewBox={`0 0 ${icon.width} ${icon.height}`}
    >
      <path fill="currentColor" d={icon.svgPathData}></path>
    </svg>
  );
};

export default IconComponent;
