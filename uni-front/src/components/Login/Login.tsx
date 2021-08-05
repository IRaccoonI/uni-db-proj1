import { ReactElement, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Button, Card, Form, Row } from 'react-bootstrap';

import { Taxios } from '@simplesmiler/taxios';
import Axios from 'axios';

const taxios = new Taxios<Swagger>(Axios.create({ baseURL: '/api' }));

function Login(): ReactElement {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const submitCb = useCallback(async () => {
    await taxios.post('/authorization/login', {
      login: login,
      password: login,
    });
  }, [login]);

  return (
    <LoginStyled>
      <Row className="h-100">
        <Card className="align-self-center w-472 p-3">
          <Form>
            <Form.Group className="mb-1" controlId="formBasicEmail">
              <Form.Label className="mb-0">Login:</Form.Label>
              <Form.Control
                placeholder="Enter login"
                value={login}
                onChange={(ev) => setLogin(ev.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="mb-0">Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </Form.Group>
            <Button variant="success" className="w-100" onClick={submitCb}>
              Login
            </Button>
          </Form>
        </Card>
      </Row>
    </LoginStyled>
  );
}

const LoginStyled = styled.div`
  height: 100vh;

  .w-472 {
    width: 472px;
    margin: auto;
  }

  .card {
    background-color: ${({ theme }) => theme.primaryBgc};
    border: ${({ theme }) => theme.primaryBorder};
  }
`;

export default Login;
