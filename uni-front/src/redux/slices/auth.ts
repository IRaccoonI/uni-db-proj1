import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { Taxios } from '@simplesmiler/taxios';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';

export type TokenType = {
  id: number;
  login: string;
  roleName: string;
  iat: number;
};

export type authState = {
  status: string;
  jwt: string | null;
  user: TokenType | null;
};

const taxios = new Taxios<Swagger>(Axios.create({ baseURL: '/api' }));

const initialState = {
  status: 'idle',
  jwt: localStorage.getItem('jwt'),
  user: localStorage.getItem('jwt')
    ? jwtDecode<TokenType>(localStorage.getItem('jwt') || '')
    : null,
} as authState;

// Thunk functions
export const authorizate = createAsyncThunk(
  'auth/login',
  async (user: { login: string; password: string }) => {
    const response = await taxios.post('/authorization/login', {
      login: user.login,
      password: user.password,
    });
    return response.data.token;
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  return '';
});

const todosSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // todoToggled(state, action) {
    //   const todoId = action.payload;
    //   const todo = state.entities[todoId];
    //   todo.completed = !todo.completed;
    // },
    // todoColorSelected: {
    //   reducer(state, action) {
    //     const { color, todoId } = action.payload;
    //     state.entities[todoId].color = color;
    //   },
    //   prepare(todoId, color) {
    //     return {
    //       payload: { todoId, color },
    //     };
    //   },
    // },
    // todoDeleted: authAdapter.removeOne,
    // allTodosCompleted(state, action) {
    //   Object.values(state.entities).forEach((todo) => {
    //     todo.completed = true;
    //   });
    // },
    // completedTodosCleared(state, action) {
    //   const completedIds = Object.values(state.entities)
    //     .filter((todo) => todo.completed)
    //     .map((todo) => todo.id);
    //   authAdapter.removeMany(state, completedIds);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authorizate.pending, (state: authState) => {
        state.status = 'loading';
      })
      .addCase(authorizate.fulfilled, (state: authState, action) => {
        state.status = 'idle';

        let jwt = action.payload;
        state.user = jwtDecode<TokenType>(jwt);
        state.jwt = jwt;
        localStorage.setItem('jwt', jwt);
      })
      .addCase(authorizate.rejected, (state: authState) => {
        state.status = 'idle';
      });
    builder
      .addCase(logout.pending, (state: authState) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state: authState) => {
        state.status = 'idle';

        state.user = null;
        state.jwt = null;
        localStorage.removeItem('jwt');
      });
  },
});

// export const {
//   allTodosCompleted,
//   completedTodosCleared,
//   todoAdded,
//   todoColorSelected,
//   todoDeleted,
//   todoToggled,
// } = todosSlice.actions;

export default todosSlice.reducer;

// export const { selectAll: selectTodos, selectById: selectTodoById } =
//   authAdapter.getSelectors((state) => state.todos);

// export const selectTodoIds = createSelector(
//   // First, pass one or more "input selector" functions:
//   selectTodos,
//   // Then, an "output selector" that receives all the input results as arguments
//   // and returns a final result value
//   (todos) => todos.map((todo) => todo.id),
// );

// export const selectFilteredTodos = createSelector(
//   // First input selector: all todos
//   selectTodos,
//   // Second input selector: all filter values
//   (state) => state.filters,
//   // Output selector: receives both values
//   (todos, filters) => {
//     const { status, colors } = filters;
//     const showAllCompletions = status === StatusFilters.All;
//     if (showAllCompletions && colors.length === 0) {
//       return todos;
//     }

//     const completedStatus = status === StatusFilters.Completed;
//     // Return either active or completed todos based on filter
//     return todos.filter((todo) => {
//       const statusMatches =
//         showAllCompletions || todo.completed === completedStatus;
//       const colorMatches = colors.length === 0 || colors.includes(todo.color);
//       return statusMatches && colorMatches;
//     });
//   },
// );

// export const selectFilteredTodoIds = createSelector(
//   // Pass our other memoized selector as an input
//   selectFilteredTodos,
//   // And derive data in the output selector
//   (filteredTodos) => filteredTodos.map((todo) => todo.id),
// );
