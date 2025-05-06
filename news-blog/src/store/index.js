import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import newsReducer from './news/newsSlice';
import adminReducer from './admin/adminSlice';
import commentsReducer from './comments/commentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: newsReducer,
    admin: adminReducer,
    comments: commentsReducer,
  },
});