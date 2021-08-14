import { ReactElement, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/store';

import styled from 'styled-components';
import Post, { PostProp } from './index';
import { postsManageVrrdict } from 'redux/slices/posts';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';

export interface PostViewProp extends PostProp {
  likesSum: number;
  selfLikeValue: number;
  className?: string;
}

function ViewPost(prop: PostViewProp): ReactElement {
  // const [viewed, setViewed] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const verdictCb = useCallback(
    async (result: 'ok' | 'ne-ok', reason?: string) => {
      dispatch(
        postsManageVrrdict({
          id: prop.id,
          verdict: {
            result: result,
            reason: reason,
          },
        }),
      );
    },
    [prop, dispatch],
  );

  return (
    <ViewPostStyled>
      <div className={'d-flex flex-row ' + prop.className || ''}>
        <div className="lc">
          <div className="btn-wrapper ok" onClick={() => verdictCb('ok')}>
            <ChevronUp />
          </div>
          <div className="btn-wrapper ne-ok">
            <ChevronDown />
          </div>
        </div>
        <div className="flex-grow-1 rc">
          <Post {...prop} />
        </div>
      </div>
    </ViewPostStyled>
  );
}

const ViewPostStyled = styled.div`
  .lc {
    margin-right: 5px;
    font-size: 2em;
  }

  .lc > .btn-wrapper {
    height: 40px;
    width: 70px;
    text-align: center;
    vertical-align: middle;
  }

  .lc > .btn-wrapper.ok:hover {
    background-color: ${({ theme }) => theme.successBgc};
    color: ${({ theme }) => theme.successColor};
  }

  .lc > .btn-wrapper.ne-ok:hover {
    background-color: ${({ theme }) => theme.errorBgc};
    color: ${({ theme }) => theme.errorColor};
  }
`;

export default ViewPost;
