import { h, FunctionComponent } from 'preact';
import { Article } from '../shared/api.interfaces';
import ArticleCard from './articleCard/articleCard';

interface ShowArticlesProps {
  articles: Article[] | null;
}

const ShowArticle: FunctionComponent<ShowArticlesProps> = (props) => {
  const { articles } = props;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 40,
        padding: '4rem',
      }}
    >
      {articles?.map((article) => (
        <ArticleCard
          description={article.description}
          url={`${article.createdBy}/${article.name}`}
          title={article.title}
        />
      ))}
    </div>
  );
};

export default ShowArticle;
