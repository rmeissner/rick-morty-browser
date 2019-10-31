import { CharactersInfo, LoadingState } from "./models";

export interface StateType {
    readonly charactersInfo: CharactersInfo
    readonly loadingState: LoadingState
}

export const initialState: StateType = {
    charactersInfo: new CharactersInfo([], "", ""),
    loadingState: new LoadingState(false, false)
};