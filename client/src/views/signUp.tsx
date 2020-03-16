import { h, FunctionComponent, Fragment } from 'preact';
import FormComponent from '../components/form/form';
import { checkIsPasswordStrong, SignUp } from '../auth';

interface SignUpViewProps {}

const SignUpView: FunctionComponent<SignUpViewProps> = () => {
  return (
    <Fragment>
      <div
        class="mb-1 mt-15"
        style={{ textAlign: 'center', color: 'var(--primary-color)', fontSize: '1.4rem' }}
      >
        SING UP
      </div>
      <FormComponent
        focus={'username'}
        fields={{
          username: {
            type: 'username',
            required: true,
            placeholder: 'Username',
            validate: value => (value.length < 1 ? ['Username is Required.'] : [])
          },
          email: {
            type: 'email',
            required: false,
            placeholder: 'Email'
          },
          password: {
            type: 'password',
            required: true,
            placeholder: 'Password',
            validate: checkIsPasswordStrong
          }
        }}
        submit={{
          function: async data => {
            const res = await SignUp({
              username: data.username.value as string,
              password: data.password.value as string,
              email: data.email.value as string
            });

            if (res.status === 200) {
              return [];
            } else {
              return res.body.errors;
            }
          },
          text: 'Sign Up'
        }}
        customButtons={
          <Fragment>
            <a class="ml-1" href="/login">
              Login
            </a>
          </Fragment>
        }
        class="mb-3"
      ></FormComponent>
    </Fragment>
  );
};

export default SignUpView;
