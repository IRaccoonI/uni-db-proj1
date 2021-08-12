import { ReactElement } from 'react';

import styled from 'styled-components';

// interface PostProp {
//   test: never;
// }

// function Post(prop: PostProp): ReactElement {
function Post(): ReactElement {
  return <PostStyled></PostStyled>;
}

const PostStyled = styled.div``;

export default Post;
