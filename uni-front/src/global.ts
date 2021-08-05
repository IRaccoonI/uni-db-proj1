import { createGlobalStyle } from 'styled-components';

export const GlobalStyled = createGlobalStyle`
  body, html {
    min-height: 100vh;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.primaryColor};
    font-family: 'Roboto';
    font-size: 16px;
    text-align: left;
  }

  input[type="password"] {
    font-family: 'Fan' !important;
  }
  input[type="password"]::placeholder {
    font-family: 'Roboto';
  }

  .btn {
    color: ${({ theme }) => theme.successColor};
    background-color: ${({ theme }) => theme.bgcBtn};
  }

  .btn-success {
    border-color: ${({ theme }) => theme.successColor};
    border-width: 2px;
  }

  .btn-success:hover{
    background-color: ${({ theme }) => theme.successColor};
  }
`;
