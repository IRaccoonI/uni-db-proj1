import { ReactElement, useCallback } from 'react';

import styled from 'styled-components';
import { Container } from 'react-bootstrap';

import { AppDispatch } from 'redux/store';
import { useDispatch } from 'react-redux';

import { logout } from 'redux/slices/auth';

function Header(): ReactElement {
  const dispatch: AppDispatch = useDispatch();

  const logoutCb = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <LoginStyled>
      <Container>
        <a onClick={logoutCb}>logout</a>
      </Container>
    </LoginStyled>
  );
}

const LoginStyled = styled.div`
  .w-472 {
    width: 472px;
    margin: auto;
  }

  .card {
    background-color: ${({ theme }) => theme.primaryBgc};
    border: ${({ theme }) => theme.primaryBorder};
  }
`;

export default Header;
