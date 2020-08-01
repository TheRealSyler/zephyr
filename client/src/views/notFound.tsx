import { h, FunctionComponent } from 'preact';

interface NotFoundProps {
  page: string;
}

const NotFound: FunctionComponent<NotFoundProps> = (props) => {
  const { page } = props;

  return (
    <div style="height: 100vh; display: flex; align-items: center; flex-direction: column; padding-top: 15%; box-sizing: border-box">
      <span style="color: var(--primary-color); font-size: 8rem">404</span>
      <br />
      <span style="font-size: 2rem">
        Page <span style="color: var(--primary-color);">{page}</span> not Found.
      </span>
      <br />
      <a style="font-size: 1.5rem" class="link" href="/home">
        Home
      </a>
    </div>
  );
};

export default NotFound;
