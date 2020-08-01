import { h, FunctionComponent } from 'preact';
import './articleCard.sass';

interface ArticleCardProps {
  title: string;
  url: string;
  description?: string;
}

const ArticleCard: FunctionComponent<ArticleCardProps> = (props) => {
  const { url, description, title } = props;

  return (
    <a class="article-card" href={`/article/${url}`}>
      <div class="article-card-title" title={title}>
        <div>{title}</div>
      </div>
      <div class="article-card-description">{description}</div>
    </a>
  );
};

export default ArticleCard;
