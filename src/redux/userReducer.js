const initialState = {
    token: null, // Don't use localStorage here
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, token: action.payload }; // Set token after login
        case 'LOGOUT':
            return { ...state, token: null }; // Clear token on logout
        default:
            return state;
    }
};
