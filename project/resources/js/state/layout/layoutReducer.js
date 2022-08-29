import * as layoutActions from "./layoutActions";

const initialState = {
    page: null,
    title: "",
    loading: false,
};

const layoutReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case layoutActions.CHANGE_PAGE_ACTION:
            return { ...state, page: payload };
        case layoutActions.CHANGE_TITLE_ACTION:
            return { ...state, title: payload };
        case layoutActions.SET_LOADING_ACTION:
            return {
                ...state,
                loading: payload.loading,
            };
        default:
            return state;
    }
};

export default layoutReducer;
