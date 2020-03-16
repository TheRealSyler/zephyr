import { h, FunctionComponent } from 'preact';
import LoadingComponent from './loading/loading';
import { Suspense, lazy } from 'preact/compat';
interface AsyncRouteComponentProps {
  layout: FunctionComponent;
  component: () => Promise<{ default: any }>; // TODO: (low priority), find the type for any
}

const AsyncRouteComponent: FunctionComponent<AsyncRouteComponentProps> = props => {
  const { component, layout: Layout } = props;
  const Component = lazy(component);

  return (
    <Layout>
      <Suspense fallback={<LoadingComponent />}>
        <Component />
      </Suspense>
    </Layout>
  );
};

export default AsyncRouteComponent;
