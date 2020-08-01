import { h, FunctionComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Article } from '../shared/api.interfaces';
import { GET } from '../api';
import EditArticle from '../components/editArticle/editArticle';
import Loading from '../components/loading/loading';
import { AuthData } from '../auth';
import { route } from 'preact-router';

interface EditArticleProps {
  name: string;
}

const EditArticleView: FunctionComponent<EditArticleProps> = ({ name }) => {
  const [data, setData] = useState<Article | null>(null);
  const user = AuthData.accessToken?.username;
  if (!user) {
    route('/home');
    return null;
  }
  const getData = async () => {
    const body = (await GET('article', { name, user })).body as Article;

    if (data === null) {
      setData(body);
    }
  };
  useEffect(() => {
    if (!data) {
      getData();
    }
  });

  return data ? <EditArticle isEditing={true} initialData={data} /> : <Loading />;
};

export default EditArticleView;
