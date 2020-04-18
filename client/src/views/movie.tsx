import { h, FunctionComponent, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { GET as iGET } from '../shared/api.GET';
import { GET } from '../api';
import { AuthData, RoleGuard } from '../auth';
import ActionsComponent, { ActionsComponentProps } from '../components/actions/actions';
import { UserRole } from '../shared/utils.auth';

interface MovieViewProps {}

const MovieView: FunctionComponent<MovieViewProps> = () => {
  const [data, setData] = useState<null | iGET['movie']['response']>(null);
  const path = decodeURIComponent(window.location.pathname.replace(/^\/movie\//, ''));

  const getMovie = async () => {
    const res = await GET('movie', {
      name: path,
    });
    if (res.status === 200) {
      setData(res.body);
    }
    // TODO add 404 ?
  };

  useEffect(() => {
    if (!data && AuthData.accessToken) {
      getMovie();
    }
  });
  if (data) {
    const actions: ActionsComponentProps['actions'] = [
      {
        icon: 'google',
        text: 'Search',
        href: `https://google.com/search?q=${path}`,
      },
    ];
    if (RoleGuard(UserRole.CONTRIBUTOR)) {
      actions.push({
        icon: 'edit',
        text: 'Edit',
        onClick: () => {
          // TODO add edit movie functionality
          console.log('EDIT MOVIE');
        },
      });
    }
    return (
      <Fragment>
        <h3 class="primary-color">{data.name}</h3>
        <span class="faint-color">{data.description}</span>
        <ActionsComponent actions={actions} />
      </Fragment>
    );
  }
  return null;
};

export default MovieView;
