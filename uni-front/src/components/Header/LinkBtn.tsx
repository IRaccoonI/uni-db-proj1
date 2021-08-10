import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

interface LinkBtnProp {
  text: string;
  to: string;
  isActive?: boolean;
}

function LinkBtn(props: LinkBtnProp): ReactElement {
  return (
    <LinkBtnStyled>
      <div className={props.isActive ? 'active' : ''}>
        <Link className="align-middle h-100" to={props.to}>
          {props.text}
        </Link>
      </div>
    </LinkBtnStyled>
  );
}

const LinkBtnStyled = styled.div`
  display: inline-block;
  height: 100%;
  line-height: 58px;
  color: ${({ theme }) => theme.primaryColor};
  position: relative;
  text-transform: uppercase;

  > * {
    height: 100%;
    padding: 0 2px;
  }

  :hover {
    color: ${({ theme }) => theme.hightlightColor};
  }

  a {
    display: block;
    height: 100%;
    font-weight: bold;
    text-decoration: none;
    color: inherit;
  }

  .active {
    color: ${({ theme }) => theme.hightlightColor};
    border-bottom: 3px solid ${({ theme }) => theme.hightlightColor};
  }
`;

export default LinkBtn;
