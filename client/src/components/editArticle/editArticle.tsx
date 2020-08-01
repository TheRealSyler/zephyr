import { h, FunctionComponent, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import './editArticle.sass';
import { route } from 'preact-router';
import Form from '../form/form';
import { urlFriendly } from '../../shared/utils';
import { POST } from '../../api';
import { AuthData } from '../../auth';
import { Article } from '../../shared/api.interfaces';
import { Sanitize } from '../../utils/utils';

type Mode = 'write' | 'preview';

interface EditArticleProps {
  initialMode?: Mode;
  isEditing?: boolean;
  initialData?: Partial<Article>;
}

const defaultText = `# Header

---

[link](github.com/TheRealSyler/zephyr)

\`\`\`
code
\`\`\`

* List
* 1
* 2
`;

const EditArticle: FunctionComponent<EditArticleProps> = ({
  initialMode,
  isEditing = false,
  initialData,
}) => {
  const [mode, setMode] = useState<Mode>(initialMode || 'write');

  const [text, setText] = useState(initialData?.content || defaultText);

  const onChange = (check: Form<any>['checkCanSubmit']) => (e: any) => {
    setText(e?.target?.value || '');
    setTimeout(() => check(), 0);
  };

  const changeMode = (m: Mode) => () => setMode(m);
  const activeMode = (m: Mode) => (m === mode ? 'active' : '');

  return (
    <Form
      overwriteFormClass="new-article"
      overwriteElementClass="new-article-main"
      overwriteErrorClass="form-error mt-1"
      fields={{
        title: {
          name: 'title',
          placeholder: 'Title',
          required: true,
          value: initialData?.title || '',
          type: 'text', // the function below is a little bit cryptic so ill explain,
          // if val.length is 0 return required message otherwise return empty array.
          validate: (val) => (val.length === 0 && ['Title is Required.']) || [],
        },
        name: {
          name: 'name',
          placeholder: 'Name (for the url)',
          required: true,
          value: initialData?.name || '',
          type: 'text',
          validate: (val) => {
            if (val.length === 0) return ['Name is Required.'];
            return urlFriendly(val) ? [] : ['Please only use: [A-z0-9]'];
          },
        },
        description: {
          name: 'description',
          placeholder: 'Description',
          value: initialData?.description || '',
          type: 'text',
        },
      }}
      hideRequiredText={true}
      submit={async (val) => {
        const data = {
          content: text,
          name: val.name.value as string,
          title: val.title.value as string,
          description: val.description.value as string,
        };

        const res = isEditing
          ? await POST('article/edit', data)
          : await POST('article/publish', data);

        if (!res.body.success) {
          return [res.body.message!];
        }
        route(`/article/${AuthData.accessToken?.username}/${val.name.value}`);
        return [];
      }}
      errors={text.length <= 0 ? ['Article content is Required'] : []}
      customElement={(canSubmit, check) => (
        <Fragment>
          <div class="new-article-buttons">
            <button type="button" class={activeMode('write')} onClick={changeMode('write')}>
              Write
            </button>
            <button type="button" class={activeMode('preview')} onClick={changeMode('preview')}>
              Preview
            </button>
            <button type="submit" disabled={!canSubmit} class="publish">
              {isEditing ? 'Edit' : 'Publish'}
            </button>
          </div>

          {mode === 'write' ? (
            <textarea value={text} onChange={onChange(check)}></textarea>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: Sanitize(text) }} />
          )}
        </Fragment>
      )}
    ></Form>
  );
};

export default EditArticle;
