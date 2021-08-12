import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Taxios } from '@simplesmiler/taxios';
import Axios from 'axios';
import { store } from 'redux/store';

// Types

export type statusState = {
  status: string;
};

// Init state

const initialState = {
  status: 'idle',
} as statusState;

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

// Slice

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder;
    // .addCase(postsPost.pending, (state: statusState) => {
    //   state.status = 'loading';
    // })
    // .addCase(postsPost.fulfilled, (state: statusState) => {
    //   state.status = 'idle';
    // })
    // .addCase(postsPost.rejected, (state: statusState) => {
    //   state.status = 'idle';
    // });
  },
});

export default postsSlice.reducer;
