import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    loading: false,
    error: null,
    pendingComments: [],
    pendingCount: 0,
  },
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setPendingComments(state, action) {
      state.pendingComments = action.payload;
    },
    setPendingCount(state, action) {
      state.pendingCount = action.payload;
    }
  },
});

export const { setUsers, setLoading, setError, setPendingCount, setPendingComments } = adminSlice.actions;
export default adminSlice.reducer;
