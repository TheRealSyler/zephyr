import { h, FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { GET } from '../api';
import { Article } from '../shared/api.interfaces';
import ShowArticles from '../components/showArticles';
interface HomeViewProps {}

const HomeView: FunctionComponent<HomeViewProps> = () => {
  const [data, setData] = useState<Article[] | null>(null);
  const getData = async () => {
    const body = (await GET('article', { results: '20' })).body as Article[];

    if (data === null) {
      setData(body);
    }
  };
  useEffect(() => {
    if (!data) {
      getData();
    }
  });
  return <ShowArticles articles={data} />;
};

export default HomeView;
