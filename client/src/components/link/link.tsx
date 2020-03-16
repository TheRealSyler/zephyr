import { h, FunctionComponent } from 'preact';

interface LinkComponentProps extends h.JSX.HTMLAttributes<HTMLAnchorElement> {}

const LinkComponent: FunctionComponent<LinkComponentProps> = props => {
  return <a {...props} class={addIsActive(props)}></a>;
};

export default LinkComponent;
function addIsActive(props: LinkComponentProps) {
  return (window.location.pathname === props.href ? 'active ' : '') + (props.class || '');
}
