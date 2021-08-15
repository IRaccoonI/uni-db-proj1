import { ReactElement, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/store';

import styled from 'styled-components';
import Post, { PostProp } from './index';
import { postsLike, postsView } from 'redux/slices/posts';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';

export interface PostViewProp extends PostProp {
  likesSum: number;
  selfLikeValue: number;
  className?: string;
}

function ViewPost(prop: PostViewProp): ReactElement {
  const [viewed, setViewed] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const likeCb = useCallback(
    (likeValue: 1 | -1) => {
      if (likeValue === prop.selfLikeValue) return;
      dispatch(postsLike({ likeValue: likeValue, postId: prop.id }));
    },
    [prop, dispatch],
  );

  const viewCb = useCallback(() => {
    if (viewed) return;
    setViewed(true);
    dispatch(postsView({ postId: prop.id }));
  }, [prop, viewed, dispatch]);

  return (
    <ViewPostStyled>
      <div
        className={'d-flex flex-row ' + prop.className || ''}
        onMouseEnter={viewCb}
      >
        <div className="lc">
          <div
            className={
              'btn-wrapper ok ' + (prop.selfLikeValue === 1 ? 'active' : '')
            }
            onClick={() => likeCb(1)}
          >
            <ChevronUp />
          </div>
          <div className="likesSum">
            <span>
              {prop.likesSum > 0 ? '+' : ''}
              {prop.likesSum}
            </span>
          </div>
          <div
            className={
              'btn-wrapper ne-ok ' + (prop.selfLikeValue === -1 ? 'active' : '')
            }
            onClick={() => likeCb(-1)}
          >
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

  .lc > * {
    text-align: center;
  }

  .lc > .btn-wrapper > svg {
    vertical-align: baseline;
  }

  .lc > .btn-wrapper {
    height: 40px;
    width: 70px;
  }

  .lc > .btn-wrapper.ok:hover,
  .lc > .btn-wrapper.ok.active {
    background-color: ${({ theme }) => theme.successBgc};
    color: ${({ theme }) => theme.successColor};
  }

  .lc > .btn-wrapper.ne-ok:hover,
  .lc > .btn-wrapper.ne-ok.active {
    background-color: ${({ theme }) => theme.errorBgc};
    color: ${({ theme }) => theme.errorColor};
  }
`;

export default ViewPost;
