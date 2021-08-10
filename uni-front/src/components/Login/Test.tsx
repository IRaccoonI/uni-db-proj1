import { ReactElement, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Card, Row } from 'react-bootstrap';

// import { Taxios } from '@simplesmiler/taxios';
// import Axios from 'axios';

import { AppDispatch, RootState } from 'redux/store';
import { logout } from 'redux/slices/auth';

// const taxios = new Taxios<Swagger>(Axios.create({ baseURL: '/api' }));

function Login(): ReactElement {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();

  const logoutCb = useCallback(async () => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <LoginStyled>
      <Row className="h-100">
        <Card className="align-self-center w-472 p-3">
          <div>Hello {user?.login}</div>
          <Button variant="success" className="w-100" onClick={logoutCb}>
            Logout
          </Button>
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
