import { h, Component, createRef, RefObject } from 'preact';
import './form.sass';
import Tooltip from '../tooltip/tooltip';

interface Field {
  value?: string | number;
  placeholder?: string;
  type?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  /**Return an empty array if the field is valid. */
  validate?: (text: string) => string[];
}

type FormStateValue = {
  value: string | number;
  isValid: boolean;
  validationErrors: string[];
};

type FormFields = { [key: string]: Field };

type FormFieldPropsKey<T extends FormFields> = keyof FormProps<T>['fields'];

interface FormProps<T extends FormFields> {
  fields: T;
  focus?: keyof T;
  class?: string;
  customElement?:
    | ((canSubmit: boolean, setCanSubmit: Form<any>['checkCanSubmit']) => h.JSX.Element)
    | h.JSX.Element;
  // defaultCanSubmit?: boolean;
  hideRequiredText?: boolean;
  overwriteFormClass?: string;
  overwriteButtonClass?: string;
  overwriteElementClass?: string;
  overwriteErrorClass?: string;
  overwriteInputClass?: string;
  errors?: string[];
  submit:
    | {
        /**Submit Button text */
        text: string;
        /**Used for error checking the fields */
        function: (data: FormState<T>['fields']) => Promise<string[]>;
      }
    | ((data: FormState<T>['fields']) => Promise<string[]>);
}

type FormState<T extends FormFields> = {
  fields: {
    [key in FormFieldPropsKey<T>]: FormStateValue;
  };
  canSubmit: boolean;
  errors: string[];
};

type FormOnInput<T extends FormFields> = (
  key: FormFieldPropsKey<T>
) => h.JSX.GenericEventHandler<HTMLInputElement>;

class Form<T extends FormFields> extends Component<FormProps<T>, FormState<T>> {
  focus = createRef<HTMLInputElement>();

  constructor(props: FormProps<T>) {
    super(props);
    const fields = {} as FormState<T>['fields'];
    for (const key in this.props.fields) {
      if (this.props.fields.hasOwnProperty(key)) {
        const field = this.props.fields[key];
        fields[key] = {
          value: field.value || '',
          isValid: true,
          validationErrors: [],
        };
      }
    }
    this.state = {
      fields,
      canSubmit: false, // props.defaultCanSubmit ||
      errors: [],
    };
  }

  componentDidMount() {
    if (this.props.focus) {
      // This makes it less jittery
      setTimeout(() => this.focus.current?.focus(), 200);
    }
  }

  onSubmit = async (e: Event) => {
    e.preventDefault();

    const func =
      typeof this.props.submit === 'function' ? this.props.submit : this.props.submit.function;

    this.setState({
      errors: await func(this.state.fields),
    });
  };

  onInput: FormOnInput<T> = (key) => (e) => {
    if (e.target) {
      const { value } = e.target as any;
      this.handleInput(key, value);
    }
  };

  handleInput(key: keyof T, value: string) {
    const validate = this.props.fields[key].validate;
    let isValid = true;
    const validationErrors = [];
    if (validate) {
      validationErrors.push(...validate(value));
      isValid = !(validationErrors.length > 0);
    }

    const fields = this.state.fields;
    fields[key] = {
      isValid,
      value,
      validationErrors,
    };
    this.setState({
      fields,
      canSubmit: this._checkCanSubmit(),
    });
  }

  checkCanSubmit = () => {
    this.setState({
      canSubmit: this._checkCanSubmit(),
    });
  };

  private _checkCanSubmit = () => {
    let canSubmit = true;
    if ((this.props.errors?.length || 0) > 0) {
      return false;
    }
    for (const key in this.state.fields) {
      if (this.state.fields.hasOwnProperty(key)) {
        const field = this.state.fields[key];
        if (!field.isValid || (this.props.fields[key].required && String(field.value).length < 1)) {
          canSubmit = false;
        }
      }
    }
    return canSubmit;
  };

  render() {
    const {
      overwriteInputClass,
      overwriteFormClass,
      overwriteElementClass,
      overwriteErrorClass,
      hideRequiredText,
      submit,
      customElement,
      focus,
      overwriteButtonClass,
    } = this.props;
    const fields = [];
    for (const key in this.props.fields) {
      if (this.props.fields.hasOwnProperty(key)) {
        const fieldProps = this.props.fields[key];
        const fieldErrors = this.state.fields[key].validationErrors;
        const errors = [];
        for (let i = 0; i < fieldErrors.length; i++) {
          const error = fieldErrors[i];
          errors.push(
            <div class="form-error" key={i}>
              {error}
            </div>
          );
        }

        const isValid = this.state.fields[key].isValid;

        const input = (
          <input
            title={fieldProps.placeholder}
            {...fieldProps}
            placeholder={`${fieldProps.placeholder}${fieldProps.required ? ' *' : ''}`}
            ref={focus === key ? this.focus : undefined}
            key={key}
            class={`${overwriteInputClass || 'input mt-1'} ${isValid ? '' : 'invalid'}`}
            value={this.state.fields[key].value}
            onInput={this.onInput(key)}
          />
        );
        fields.push(
          <Tooltip visible={errors.length > 0} content={errors}>
            {input}
          </Tooltip>
        );
      }
    }

    const errors = [];
    const allErrors = this.state.errors.concat(this.props.errors || []);
    for (let i = 0; i < allErrors.length; i++) {
      const error = allErrors[i];
      errors.push(
        <div class={overwriteErrorClass || 'form-error'} key={i}>
          {error}
        </div>
      );
    }

    return (
      <form
        method="POST"
        class={`${overwriteFormClass || 'form'} ${this.props.class || ''}`}
        onSubmit={this.onSubmit}
      >
        {fields}
        {!hideRequiredText && <div class="form-required-text">* Field Are Required.</div>}
        {errors}
        <div class={overwriteElementClass || 'form-buttons mt-2'}>
          {typeof submit !== 'function' && (
            <button
              class={overwriteButtonClass || 'button'}
              type="submit"
              disabled={!this.state.canSubmit}
            >
              {submit.text}
            </button>
          )}

          {typeof customElement === 'function'
            ? customElement(this.state.canSubmit, this.checkCanSubmit)
            : customElement}
        </div>
      </form>
    );
  }
}

export default Form;
