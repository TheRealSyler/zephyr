import { h, FunctionComponent, ComponentChildren } from 'preact';
import './tooltip.sass';

interface TooltipProps {
  visible?: boolean;
  content: string | number | h.JSX.Element | ComponentChildren;
  // position?: 'left' | 'top' | 'right' | 'bottom';
}

const Tooltip: FunctionComponent<TooltipProps> = (props) => {
  const { content, visible = true } = props;
  return (
    <div class="tooltip-wrapper">
      {props.children}
      <span style={{ display: visible ? 'block' : 'none' }} class="tooltip">
        {content}
      </span>
    </div>
  );
};

export default Tooltip;
