import { createSlice } from '@reduxjs/toolkit';

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    list: [],
    error: null,
  },
  reducers: {
    setComments(state, action) {
      state.list = action.payload;
    },
    setCommentError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setComments, setCommentError } = commentsSlice.actions;
export default commentsSlice.reducer;
