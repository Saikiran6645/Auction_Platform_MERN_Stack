import { createSlice } from "@reduxjs/toolkit";

import api from "../../api/api";
import { toast } from "react-toastify";
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: null,
    user: {},
    role: "",
    leaderboard: [],
  },

  reducers: {
    registerRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;

      state.user = action.payload;

      state.role = action.payload.role;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },
    fetchUserRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
    },

    logoutSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.leaderboard = [];
    },
    logoutFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = state.isAuthenticated;
      state.user = state.user;
    },
    fetchLeaderboardRequest(state, action) {
      state.loading = true;
      state.leaderboard = [];
    },
    fetchLeaderboardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderboardFailed(state, action) {
      state.loading = false;
      state.leaderboard = [];
    },
    clearAllErrors(state, action) {
      state.user = state.user;
      state.isAuthenticated = state.isAuthenticated;
      state.leaderboard = state.leaderboard;
      state.loading = false;
    },
  },
});
export const logout = () => async (dispatch) => {
  try {
    const response = await api.get("/user/logout");
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};
export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const res = await api.post("/user/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(userSlice.actions.registerSuccess(res.data));
    toast.success(res.data.message);
  } catch (error) {
    dispatch(userSlice.actions.registerFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};
export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const res = await api.post("/user/login", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data?.user?.success) {
      dispatch(userSlice.actions.loginSuccess(res.data.user.user));
    } else {
      dispatch(userSlice.actions.loginSuccess(res.data.user));
    }
    toast.success(res.data.message);
  } catch (error) {
    dispatch(userSlice.actions.loginFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};
export const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const res = await api.get("/user/me");
    dispatch(userSlice.actions.fetchUserSuccess(res.data));
  } catch (error) {
    dispatch(userSlice.actions.fetchUserFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};
export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());
  try {
    const res = await api.get("/user/leaderboard");
    
    dispatch(userSlice.actions.fetchLeaderboardSuccess(res.data.leaderboard));
  } catch (error) {
    dispatch(userSlice.actions.fetchLeaderboardFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};
export default userSlice.reducer;
