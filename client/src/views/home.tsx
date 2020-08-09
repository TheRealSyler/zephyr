import { h, FunctionComponent, Fragment, createRef } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { GET } from '../api';
import { Article } from '../shared/api.interfaces';
import ShowArticle from '../components/showArticle';
import { apiCache } from '../cache';
import { useScreenEnter } from '../utils/utils';
import Loading from '../components/loading/loading';
import { GET as iGET } from '../shared/api.GET';

interface HomeViewProps {}

const HomeView: FunctionComponent<HomeViewProps> = () => {
  const [data, setData] = useState<Article[] | null>(null);

  const ref = createRef<HTMLDivElement>();

  const getArgs: (addPage?: number) => Promise<iGET['article']['query']> = async (addPage) => ({
    results: '20',
    page: '' + (await apiCache.fetch('home', 'page', async () => 0)) + (addPage ? addPage : ''),
  });

  const loadMore = async () => {
    if (apiCache.get('home', 'loadedAllPages')) return;
    await apiCache.update('home', 'page', async (p) => p + 1);

    const newData = (await GET('article', await getArgs())).body as Article[];

    if (newData.length === 0) {
      apiCache.set('home', 'loadedAllPages', true);
    }

    const cachedData = await apiCache.update('home', 'data', async (d) => d.concat(newData));
    if (cachedData) {
      setData(cachedData);
    }

    setEntered(false);
  };

  const setEntered = useScreenEnter(ref, loadMore);

  const getData = async (force = false) => {
    if (data === null || force) {
      if (force) {
        await apiCache.update('home', 'page', async () => 0);
        apiCache.set('home', 'loadedAllPages', false);
        setEntered(false);
      }
      setData(
        await apiCache.fetch(
          'home',
          'data',
          async () => (await GET('article', await getArgs())).body as Article[],
          force
        )
      );
      loadMore();
    }
  };
  useEffect(() => {
    if (!data) {
      getData();
    }
  });

  return (
    <div style="min-height: 100vh">
      <button
        class="button"
        style="position: absolute; left: 50%; transform: translateX(-50%)"
        onClick={() => getData(true)}
      >
        Refresh
      </button>
      <ShowArticle articles={data} />
      <div ref={ref}>
        {!apiCache.get('home', 'loadedAllPages') && (
          <div style="position: relative; padding: 2rem; margin-top: 2rem">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
