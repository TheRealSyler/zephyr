import { h, FunctionComponent } from 'preact';

interface LinkProps extends h.JSX.HTMLAttributes<HTMLAnchorElement> {}

const Link: FunctionComponent<LinkProps> = (props) => {
  return <a {...props} class={addIsActive(props)}></a>;
};

export default Link;
function addIsActive(props: LinkProps) {
  return (window.location.pathname === props.href ? 'link active ' : 'link ') + (props.class || '');
}
