import { h, FunctionComponent, Fragment } from 'preact';
import { useEffect, useState } from 'preact/compat';
import { GET } from '../../api';
import { GET as iGET } from '../../shared/api.GET';
import ListItemComponent from './listItem';
import { AuthData } from '../../auth';

interface ListViewProps {}

const ListView: FunctionComponent<ListViewProps> = () => {
  const [data, setData] = useState<null | iGET['user/list']['response']>(null);

  const getLists = async () => {
    const res = await GET('user/list');
    if (res.status === 200) {
      setData(res.body);
    }
    // TODO add 404 ?
  };

  useEffect(() => {
    if (!data && AuthData.accessToken) {
      getLists();
    }
  });

  if (data) {
    return (
      <Fragment>
        {data.map((item) => (
          <ListItemComponent item={item} />
        ))}
      </Fragment>
    );
  }
  return null;
};

export default ListView;
