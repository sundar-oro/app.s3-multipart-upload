import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const reducerName = "auth";

const userSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    removeUserDetails: (state: any) => {
      state.user = {};
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout,removeUserDetails } = userSlice.actions;
// export const userLoginSliceReducer = { [reducerName]: userSlice.reducer };
export default userSlice.reducer;
