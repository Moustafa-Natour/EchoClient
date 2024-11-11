// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,  // Initial state set to false
    token: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.token = action.payload; // Store token from payload
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
