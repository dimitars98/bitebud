import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./src/features/auth/authSlice";
import uiReducer from "./src/features/ui/uiSlice";
// adjust path if needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    // Add other slices here (e.g., cart, theme)
  },
});

export default store;
