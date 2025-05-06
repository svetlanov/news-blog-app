import { createSlice } from '@reduxjs/toolkit';

const newsSlice = createSlice({
    name: 'news',
    initialState: {
      items: [],
      selected: null,
      loading: false,
      error: null,
      uploadUrl: '',
      uploading: false,
      uploadError: null,
    },
    reducers: {
      setNews(state, action) {
        state.items = action.payload;
        state.error = null;
      },
      setSelectedNews(state, action) {
        state.selected = action.payload;
      },
      setLoading(state, action) {
        state.loading = action.payload;
      },
      newsError(state, action) {
        state.error = action.payload;
      },
      setUploading(state, action) {
        state.uploading = action.payload;
      },
      setUploadUrl(state, action) {
        state.uploadUrl = action.payload;
        state.uploadError = null;
      },
      uploadError(state, action) {
        state.uploadError = action.payload;
      },
    },
  });
  
  export const {
    setNews,
    setSelectedNews,
    setLoading,
    newsError,
    setUploading,
    setUploadUrl,
    uploadError,
  } = newsSlice.actions;
  export default newsSlice.reducer;
