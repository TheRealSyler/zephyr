import { h, FunctionComponent, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Article } from '../shared/api.interfaces';
import { GET } from '../api';
import ShowArticle from '../components/showArticle';

interface UserViewProps {
  user: string;
}

const UserView: FunctionComponent<UserViewProps> = (props) => {
  const { user } = props;
  const [data, setData] = useState<Article[] | null>(null);
  const getData = async () => {
    const res = await GET('article', { results: '20', user });

    if (res.status === 200 && data === null) {
      setData(res.body as Article[]);
    }
  };
  useEffect(() => {
    if (!data) {
      getData();
    }
  });
  return (
    <Fragment>
      <div style="font-size: 4rem; color: var(--primary-color)">{user}</div>
      <ShowArticle articles={data} />
    </Fragment>
  );
};

export default UserView;
