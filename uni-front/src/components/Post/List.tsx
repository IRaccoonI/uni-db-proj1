import { ReactElement, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { postsGet, postsManageClear } from 'redux/slices/posts';
import { AppDispatch, RootState } from 'redux/store';

import styled from 'styled-components';
import Manage from './Manage';

interface PostListProp {
  as: 'manage' | 'view';
}

function ListPosts(prop: PostListProp): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((store: RootState) => store.posts.postsManage);

  useEffect(() => {
    const verificationResult = prop.as === 'manage' ? 'null' : 'true';
    dispatch(
      postsGet({
        verificationResult: verificationResult,
      }),
    );

    return () => {
      if (prop.as === 'manage') {
        console.log('test');
        postsManageClear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListPostsStyled>
      <Container className="mt-4">
        {posts?.map((post, ind) => {
          return <Manage key={ind} {...post} className="mt-4" />;
        })}
        <div></div>
      </Container>
    </ListPostsStyled>
  );
}

const ListPostsStyled = styled.div``;

export default ListPosts;
