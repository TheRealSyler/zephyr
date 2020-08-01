import { h, FunctionComponent } from 'preact';
import './loading.sass';

interface LoadingProps {}

const Loading: FunctionComponent<LoadingProps> = (props) => {
  return <div class="loading"></div>;
};

export default Loading;
