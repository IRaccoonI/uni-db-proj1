import { useEffect, ReactElement, useState, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'redux/store';

import styled from 'styled-components';

import SimpleImpotFormlight from 'components/SimpleInputForm/Light';
import { postsCommentPost, uploadPostComments } from 'redux/slices/posts';
import { Dash, Plus } from 'react-bootstrap-icons';

const MILLISECONDS_IN_SECOND = 1000;
const SECNDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const correctStrDate = (strDate: string): string => {
  if (strDate === undefined) return 'None';
  const updDate = new Date(strDate.replace(' ', 'T'));
  const timedelta = new Date().getTime() - updDate.getTime();
  let daysPass =
    timedelta /
    HOURS_IN_DAY /
    MINUTES_IN_HOUR /
    SECNDS_IN_MINUTE /
    MILLISECONDS_IN_SECOND;
  if (daysPass >= 1) {
    return Math.floor(daysPass).toString() + ' days ago';
  }
  let hoursPass =
    timedelta / MINUTES_IN_HOUR / SECNDS_IN_MINUTE / MILLISECONDS_IN_SECOND;
  if (hoursPass >= 1) {
    return Math.floor(hoursPass).toString() + ' hours ago';
  }
  let minutesPass = timedelta / SECNDS_IN_MINUTE / MILLISECONDS_IN_SECOND;
  if (minutesPass >= 1) {
    return Math.floor(minutesPass).toString() + ' minutes ago';
  }
  let secondsPass = timedelta / MILLISECONDS_IN_SECOND;
  if (secondsPass >= 10) {
    return Math.floor(secondsPass).toString() + ' seconds ago';
  }
  return 'now';
};

interface CommentsProp {
  id: number;
}

function Comments(prop: CommentsProp): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const userRole = useSelector(
    (store: RootState) => store.auth.user?.roleName,
    shallowEqual,
  );

  const childComments = useSelector(
    (store: RootState) =>
      store.posts.comments?.filter((c) => c.parentCommentId === prop.id),
    shallowEqual,
  );

  const curComment = useSelector(
    (store: RootState) =>
      store.posts.comments.filter((c) => c.id === prop.id)[0],
  );

  const [showAnswer, setShowAnswer] = useState(false);
  const [showChilds, setShowChilds] = useState(false);
  const [childsUploaded, setChildsUploaded] = useState(false);

  useEffect(() => {
    // setShowAnswer(false);
    // setShowChilds(false);
  }, [prop]);

  useEffect(() => {
    return () => {
      // dispatch(commentsClearByParentCommentId(prop.id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendAnswerCb = useCallback(
    async (text) => {
      dispatch(
        postsCommentPost({
          content: text,
          parentCommentId: curComment.id,
          postId: curComment.postId,
        }),
      );
      setShowAnswer(false);
    },
    [dispatch, curComment],
  );

  const uploadChildsCb = useCallback(async () => {
    dispatch(uploadPostComments({ parentCommentId: curComment.id }));
  }, [dispatch, curComment.id]);

  const showHideChildsCb = useCallback(async () => {
    setShowChilds((p) => !p);

    if (childsUploaded) return;
    setChildsUploaded(true);

    uploadChildsCb();
  }, [childsUploaded, uploadChildsCb]);

  return (
    <CommentsStyled>
      <div className="comment-header mt-2">
        <span className="comment-login me-1">{curComment.owner.login}</span>
        <span className="comment-time-pass">
          {correctStrDate(curComment.updatedAt)}
        </span>
      </div>
      <div className="comment-content">
        <span className="comment-content">{curComment.content}</span>
      </div>
      <div className="comment-actions">
        {!showAnswer ? (
          <span
            className="comment-action-answer"
            onClick={() => setShowAnswer(true)}
          >
            answer
          </span>
        ) : (
          <span
            className="comment-action-cancle"
            onClick={() => setShowAnswer(false)}
          >
            cancle
          </span>
        )}
        {userRole !== 'admin' ? null : (
          <span className="comment-action-delete ms-1">delete</span>
        )}
      </div>
      {!showAnswer ? null : (
        <div className="comment-answer">
          <SimpleImpotFormlight
            placeholderText="Enter commnet..."
            submitCd={(text) => sendAnswerCb(text)}
          />
        </div>
      )}
      {curComment.childsCommentsCount > 0 ? (
        <div className="comment-more">
          <div className="wrapper" onClick={showHideChildsCb}>
            {showChilds ? <Dash /> : <Plus />}
            <span className="count ms-1">
              {curComment.childsCommentsCount} more comments
            </span>
          </div>
          <div className="childs-wrapper ps-3">
            {!showChilds
              ? null
              : childComments.map((c) => <Comments key={c.id} id={c.id} />)}
          </div>
        </div>
      ) : null}
    </CommentsStyled>
  );
}

const CommentsStyled = styled.div`
  .comment-login {
    color: ${({ theme }) => theme.secondColor};
    font-size: 0.9em;
  }

  .comment-time-pass {
    font-size: 0.7em;
  }

  .comment-actions > * {
    font-size: 0.8em;
    cursor: pointer;
  }
  .comment-actions > *:hover {
    text-decoration: underline;
  }

  .comment-action-answer,
  .comment-action-cancle {
    color: ${({ theme }) => theme.successColor};
  }

  .comment-action-delete {
    color: ${({ theme }) => theme.errorColor};
  }

  .comment-more .wrapper {
    display: inline-block;
    cursor: pointer;
  }
  .comment-more .count {
    font-size: 0.8em;
  }
  .comment-more svg {
    border: ${({ theme }) => theme.primaryBorder};
    background-color: ${({ theme }) => theme.bgcBtn};
  }
  .comment-more .childs-wrapper {
    border-left: ${({ theme }) => theme.primaryBorder};
  }
`;

export default Comments;
