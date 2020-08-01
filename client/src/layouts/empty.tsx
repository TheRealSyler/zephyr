import { h, FunctionComponent, Fragment } from 'preact';

const EmptyLayout: FunctionComponent = (props) => {
  const { children } = props;

  return <Fragment>{children}</Fragment>;
};

export default EmptyLayout;
