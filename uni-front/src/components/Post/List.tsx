import { ReactElement, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { postsGetManage, postsManageClear } from 'redux/slices/posts';
import { AppDispatch, RootState } from 'redux/store';

import styled from 'styled-components';
import ManagePost from './Manage';
import ViewPost from './View';

interface PostListProp {
  as: 'manage' | 'view';
}

function ListPosts(prop: PostListProp): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((store: RootState) => store.posts.postsManage);

  useEffect(() => {
    const verificationResult =
      prop.as === 'manage' ? 'null' : prop.as === 'view' ? 'true' : 'null';
    dispatch(
      postsGetManage({
        verificationResult: verificationResult,
      }),
    );

    return () => {
      if (prop.as === 'manage') postsManageClear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListPostsStyled>
      <Container className="mt-4">
        {posts?.map((post, ind) => {
          switch (prop.as) {
            case 'manage':
              return <ManagePost key={ind} {...post} className="mt-4" />;
            case 'view':
              return <ViewPost key={ind} {...post} className="mt-4" />;
          }
        })}
        <div></div>
      </Container>
    </ListPostsStyled>
  );
}

const ListPostsStyled = styled.div``;

export default ListPosts;
