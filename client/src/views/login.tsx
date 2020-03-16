import { h, FunctionComponent, Fragment } from 'preact';
import FormComponent from '../components/form/form';

import { checkIsPasswordStrong, Login } from '../auth';

interface LoginViewProps {}

const LoginView: FunctionComponent<LoginViewProps> = () => {
  return (
    <Fragment>
      <div
        class="mb-1 mt-15"
        style={{ textAlign: 'center', color: 'var(--primary-color)', fontSize: '1.4rem' }}
      >
        LOG IN
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
          password: {
            type: 'password',
            required: true,
            placeholder: 'Password',
            validate: checkIsPasswordStrong
          }
        }}
        submit={{
          function: async data => {
            const res = await Login(data.username.value as string, data.password.value as string);

            if (res.status === 200) {
              return [];
            } else {
              return ['Username or Password is Invalid.'];
            }
          },
          text: 'Login'
        }}
        customButtons={
          <Fragment>
            <a class="ml-1" href="/signUp">
              Sign Up
            </a>
          </Fragment>
        }
        class="mb-3"
      ></FormComponent>
    </Fragment>
  );
};

export default LoginView;
