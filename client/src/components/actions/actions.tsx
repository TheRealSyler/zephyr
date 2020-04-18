import { h, FunctionComponent } from 'preact';
import IconComponent, { IconKeys } from '../icon/icon';
import './actions.sass';

export interface ActionsComponentProps {
  actions: {
    text: string;
    icon: IconKeys;
    href?: string;
    onClick?: () => void;
  }[];
}

const ActionsComponent: FunctionComponent<ActionsComponentProps> = (props) => {
  const { actions } = props;

  return (
    <div class="actions">
      {actions.map((action) => (
        <a class="actions-btn" href={action.href} onClick={action.onClick} target="_blank">
          <IconComponent name={action.icon} />
          <span class="actions-text"> {action.text}</span>
        </a>
      ))}
    </div>
  );
};

export default ActionsComponent;
