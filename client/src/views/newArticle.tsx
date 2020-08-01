import { h, FunctionComponent, Fragment, createRef } from 'preact';
import EditArticle from '../components/editArticle/editArticle';

const NewArticleView: FunctionComponent = () => {
  return <EditArticle isEditing={false} />;
};

export default NewArticleView;
