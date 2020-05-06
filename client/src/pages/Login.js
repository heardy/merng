import React, { useContext, useState } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData }}) {
      context.login(userData);
      props.history.push('/')
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form
        onSubmit={onSubmit}
        noValidate
        className={loading ? 'loading' : ''}
      >
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password}
          onChange={onChange}
        />
        <Message
          visible={!!errors.general}
          error={true}
          content={errors.general}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
    </div>
  )
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
      username: $username
      password: $password
    ){
      id email username createdAt token
    }
  }
`;

export default Login;
