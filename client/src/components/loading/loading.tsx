import { h, FunctionComponent } from 'preact';
import './loading.sass';

interface LoadingComponentProps {}

const LoadingComponent: FunctionComponent<LoadingComponentProps> = props => {
  return <div class="loading"></div>;
};

export default LoadingComponent;
