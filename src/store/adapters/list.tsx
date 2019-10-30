import { StateType, initialState } from "../state";
import { LoadingState } from "../models/list";

// Layout actions -> update layout
const UPDATE_LOADING = "list/layout/loading";
const UPDATE_REFRESHING = "list/layout/refreshing";

interface LoadingAction {
    type: string,
    state: boolean
}

export const updateLoadingAction = (state: boolean): LoadingAction => ({
    type: UPDATE_LOADING,
    state
});

export const updateRefreshingAction = (state: boolean): LoadingAction => ({
    type: UPDATE_REFRESHING,
    state
});

type StateSlice = StateType["loadingState"];
export const loadingStateSelector = (state: StateType): StateSlice => {
    return state.loadingState
};

export const loadingStateReducer = (
    state: StateSlice = initialState.loadingState,
    action: LoadingAction,
): StateSlice => {
    switch (action.type) {
        case UPDATE_LOADING:
            return new LoadingState(action.state, state.refreshing)
        case UPDATE_REFRESHING:
            return new LoadingState(state.loading, action.state)
        default:
            return state;
    }
}