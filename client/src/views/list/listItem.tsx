import { h, FunctionComponent } from 'preact';
import { GET } from '../../shared/api.GET';
import { useState } from 'preact/hooks';

import './listItem.sass';

interface ListItemComponentProps {
  item: GET['user/list']['response'][0];
}

const ListItemComponent: FunctionComponent<ListItemComponentProps> = (props) => {
  const { name, description, movies } = props.item;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div class={`list-item${isOpen ? ' open' : ''}`}>
      <span class="primary-color">{name}</span> <br />
      <span class="faint-color"> {description}</span>
      <div class="list-item-expand-wrapper">
        <div
          class={`list-item-expand${isOpen ? ' open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        ></div>
      </div>
      <div class="list-item-content">
        {movies.map((i) => (
          <div>
            <a href={`/movie/${i.name}`} class="secondary-color">
              {i.name}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListItemComponent;
