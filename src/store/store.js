import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

export default store;
