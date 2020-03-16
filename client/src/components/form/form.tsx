import { h, Component, createRef } from 'preact';
import './form.sass';
import TooltipComponent from '../tooltip/tooltip';

interface Field {
  value?: string | number;
  placeholder?: string;
  type?: string;
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

type FormFieldPropsKey<T extends FormFields> = keyof FormComponentProps<T>['fields'];

interface FormComponentProps<T extends FormFields> {
  fields: T;
  focus?: keyof T;
  class?: string;
  customButtons?: h.JSX.Element;
  submit: {
    /**Submit Button text */
    text: string;
    function: (data: FormComponentState<T>['fields']) => Promise<string[]>;
  };
}

type FormComponentState<T extends FormFields> = {
  fields: {
    [key in FormFieldPropsKey<T>]: FormStateValue;
  };
  canSubmit: boolean;
  errors: string[];
};

type FormOnInput<T extends FormFields> = (
  key: FormFieldPropsKey<T>
) => h.JSX.GenericEventHandler<HTMLInputElement>;

class FormComponent<T extends FormFields> extends Component<
  FormComponentProps<T>,
  FormComponentState<T>
> {
  focus = createRef<HTMLInputElement>();

  constructor(props: FormComponentProps<T>) {
    super(props);
    const fields = {} as FormComponentState<T>['fields'];
    for (const key in this.props.fields) {
      if (this.props.fields.hasOwnProperty(key)) {
        const field = this.props.fields[key];
        fields[key] = {
          value: field.value || '',
          isValid: true,
          validationErrors: []
        };
      }
    }
    this.state = {
      fields,
      canSubmit: false,
      errors: []
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
    this.setState({
      errors: await this.props.submit.function(this.state.fields)
    });
  };

  onInput: FormOnInput<T> = key => e => {
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
      validationErrors
    };
    this.setState({
      fields,
      canSubmit: this.checkCanSubmit()
    });
  }
  checkCanSubmit() {
    let canSubmit = true;

    for (const key in this.state.fields) {
      if (this.state.fields.hasOwnProperty(key)) {
        const field = this.state.fields[key];
        if (!field.isValid || (this.props.fields[key].required && String(field.value).length < 1)) {
          canSubmit = false;
        }
      }
    }
    return canSubmit;
  }

  render() {
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
            {...fieldProps}
            placeholder={`${fieldProps.placeholder}${fieldProps.required ? ' *' : ''}`}
            ref={this.props.focus === key ? this.focus : undefined}
            key={key}
            class={`input mt-1 ${isValid ? '' : 'invalid'}`}
            value={this.state.fields[key].value}
            onInput={this.onInput(key)}
          />
        );
        fields.push(
          <TooltipComponent visible={errors.length > 0} content={errors}>
            {input}
          </TooltipComponent>
        );
      }
    }

    const errors = [];

    for (let i = 0; i < this.state.errors.length; i++) {
      const error = this.state.errors[i];
      errors.push(
        <div class="form-error" key={i}>
          {error}
        </div>
      );
    }

    return (
      <form method="POST" class={`form ${this.props.class || ''}`} onSubmit={this.onSubmit}>
        {fields}
        <div class="form-required-text">* Field Are Required.</div>
        {errors}
        <div class="form-buttons mt-2">
          <button class="button" type="submit" disabled={!this.state.canSubmit}>
            {this.props.submit.text}
          </button>

          {this.props.customButtons}
        </div>
      </form>
    );
  }
}

export default FormComponent;
