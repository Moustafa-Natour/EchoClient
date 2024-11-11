import { SET_LOADED_COUNT } from './actions';

const initialState = {
    loadedCount: 0,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADED_COUNT:
            return {
                ...state,
                loadedCount: action.payload,
            };
        default:
            return state;
    }
};

export default productReducer;
