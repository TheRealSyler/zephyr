import { h, FunctionComponent, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Article } from '../shared/api.interfaces';
import { GET, DELETE } from '../api';

import './article.sass';
import { AuthData } from '../auth';
import { route } from 'preact-router';
import { Sanitize } from '../utils/utils';
import { apiCache } from '../cache';
interface ArticleViewProps {
  user: string;
  name: string;
}

const ArticleView: FunctionComponent<ArticleViewProps> = (props) => {
  const { user, name } = props;
  const [data, setData] = useState<Article | null>(null);
  const getData = async () => {
    if (data === null) {
      const newData = await apiCache.fetch(
        'article',
        `${user}/${name}`,
        async () => (await GET('article', { user, name })).body as Article
      );

      setData(newData);
    }
  };
  useEffect(() => {
    if (!data) {
      getData();
    }
  });
  const isUser = AuthData.accessToken?.username === user;

  return (
    <div class="article-view">
      <h1 class="article-view-title">{data?.title}</h1>
      <div class="article-view-info">
        <a class="link" href={`/user/${data?.createdBy}`}>
          {data?.createdBy}
        </a>
        {data && ` - ${new Date(data.changed).toLocaleString()}`}
        {isUser && (
          <Fragment>
            <a class="link ml-1" href={`/edit/article/${name}`}>
              Edit
            </a>
            <a
              class="link ml-1"
              onClick={async () => {
                await DELETE('article', { name });
                route(`/user/${user}`);
              }}
            >
              Delete
            </a>
          </Fragment>
        )}
      </div>
      <div class="article-view-description">{data?.description}</div>

      <div
        class="mt-2"
        dangerouslySetInnerHTML={{
          __html: Sanitize(data?.content ? data.content : ''),
        }}
      ></div>
    </div>
  );
};

export default ArticleView;
