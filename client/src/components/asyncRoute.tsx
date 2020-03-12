import { h, FunctionComponent } from 'preact';
import LoadingComponent from './loading/loading';
import { Suspense, lazy } from 'preact/compat';
interface AsyncRouteComponentProps {
  component: () => Promise<{ default: any }>; // TODO: (low priority), find the type for any
}

const AsyncRouteComponent: FunctionComponent<AsyncRouteComponentProps> = props => {
  const { component } = props;
  const Component = lazy(component);
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Component />
    </Suspense>
  );
};

export default AsyncRouteComponent;
