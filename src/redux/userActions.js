// In your login action
export const login = (token) => {
    return {
        type: 'LOGIN',
        payload: token,
    };
};

// In userSlice reducer
const userSlice = createSlice({
    name: 'user',
    initialState: { isLoggedIn: false, token: null },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.token = action.payload;
            console.log('Logged in successfully'); // Check if this logs
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = null;
            console.log('Logged out');
        }
    }
});
