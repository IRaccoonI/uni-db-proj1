import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Taxios } from '@simplesmiler/taxios';
import Axios from 'axios';
import { store } from 'redux/store';

// Types

export type PostManage = {
  id: number;
  title: string;
  content: string;
  owner: {
    id: number;
    login: string;
  };
  updatedAt: string;
  commentsCount: number;
  likesSum: number;
  latsVerification: {
    id: number;
    result: boolean;
    reson: string;
  } | null;
};

export type PostView = PostManage & {
  likesSum: number;
  commentsCount: number;
  viewsCount: number;
  selfLikeValue: number;
};

export type PostState = {
  status: string;
  postsManage?: PostManage[];
  postsView?: PostView[];
};

// Init state

const initialState: PostState = {
  status: 'idle',
  postsManage: [],
  postsView: [],
};

// Thunk functions

const taxios = new Taxios<Swagger>(Axios.create({ baseURL: '/api' }));

export const postsPost = createAsyncThunk(
  'posts/send',
  async (
    post: {
      title: string;
      content: string;
      withoutVerification?: boolean;
    },
    api,
  ) => {
    try {
      const response = await taxios.post(
        '/posts',
        {
          ...post,
        },
        {
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        },
      );
      return {
        postId: response.data.id,
      };
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsPatchValidated = createAsyncThunk(
  'post/update/validation',
  async (
    post: {
      id: number;
      result: boolean;
      reason?: string;
    },
    api,
  ) => {
    post;
    api;
    try {
      await taxios.patch(
        '/posts/{id}/verification',
        {
          result: post.result,
          reason: post.reason,
        },
        {
          params: {
            id: post.id,
          },
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        },
      );
      return true;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsGetManage = createAsyncThunk(
  'posts/manage/get',
  async (query: { verificationResult: 'true' | 'false' | 'null' }, api) => {
    try {
      const posts = await taxios.get('/posts/manage', {
        query: {
          verificationResult: query.verificationResult,
        },
        axios: {
          headers: {
            authorization: 'Bearer ' + store.getState().auth.jwt,
          },
        },
      });
      return posts.data as PostManage[];
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsGetView = createAsyncThunk(
  'posts/get',
  async (query: { verificationResult: 'true' | 'false' | 'null' }, api) => {
    try {
      const posts = await taxios.get('/posts', {
        query: {
          verificationResult: query.verificationResult,
        },
        axios: {
          headers: {
            authorization: 'Bearer ' + store.getState().auth.jwt,
          },
        },
      });
      return posts.data as PostView[];
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsManageVrrdict = createAsyncThunk(
  'posts/manage/verdict',
  async (
    post: { id: number; verdict: { result: 'ok' | 'ne-ok'; reason?: string } },
    api,
  ) => {
    try {
      taxios.patch(
        '/posts/{id}/verification',
        {
          result: post.verdict.result === 'ok',
          reason: post.verdict.reason,
        },
        {
          params: {
            id: post.id,
          },
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        },
      );
      return post.id;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

// Slice

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postsManageClear(state: PostState) {
      state.postsManage = [];
    },
    postsViewClear(state: PostState) {
      state.postsView = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postsGetManage.pending, (state: PostState) => {
        state.status = 'loading';
      })
      .addCase(postsGetManage.fulfilled, (state: PostState, action) => {
        state.status = 'idle';
        state.postsManage = action.payload;
      })
      .addCase(postsPost.rejected, (state: PostState) => {
        state.status = 'idle';
      });
    builder
      .addCase(postsGetView.pending, (state: PostState) => {
        state.status = 'loading';
      })
      .addCase(postsGetView.fulfilled, (state: PostState, action) => {
        state.status = 'idle';
        state.postsView = action.payload;
      })
      .addCase(postsGetView.rejected, (state: PostState) => {
        state.status = 'idle';
      });
    builder
      // .addCase(postsManageVrrdict.pending, (state: PostState) => {
      //   state.status = 'loading';
      // })
      .addCase(postsManageVrrdict.fulfilled, (state: PostState, action) => {
        state.postsManage = state.postsManage?.filter(
          (p) => p.id !== action.payload,
        );
      });
    // .addCase(postsManageVrrdict.rejected, (state: PostState) => {
    //   state.status = 'idle';
    // });
  },
});

export const { postsManageClear, postsViewClear } = postsSlice.actions;

export default postsSlice.reducer;
