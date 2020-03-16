import { h, FunctionComponent } from 'preact';
import * as github from '@fortawesome/free-brands-svg-icons/faGithub';
import './icon.sass';

const icons = {
  github
};

const IconComponent: FunctionComponent<{ name: keyof typeof icons }> = props => {
  const icon = icons[props.name];
  if (!icon) {
    return <div class="icon"> </div>;
  }

  return (
    <svg class="icon" role="img" viewBox="0 0 512 512">
      <path fill="currentColor" d={icon.svgPathData}></path>
    </svg>
  );
};

export default IconComponent;
