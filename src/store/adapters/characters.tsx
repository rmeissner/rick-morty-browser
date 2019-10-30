import { Character, CharactersInfo } from "../models";
import { initialState, StateType } from "../state";
import { all, takeLatest, put } from 'redux-saga/effects'
import { updateLoadingAction, updateRefreshingAction } from "./list";

// Layout actions -> update layout
const UPDATE_CHARACTERS = "characters/layout/update";
const ADD_CHARACTERS = "characters/layout/add";

export interface CharactersAction {
    type: string,
    info: CharactersInfo
}

export const updateCharactersAction = (info: CharactersInfo): CharactersAction => ({
    type: UPDATE_CHARACTERS,
    info
});

export const addCharactersAction = (info: CharactersInfo): CharactersAction => ({
    type: ADD_CHARACTERS,
    info
});


// Data actions -> update state
const REFRESH_CHARACTERS = "characters/data/refresh";
const MORE_CHARACTERS = "characters/data/more";

interface LoadCharactersAction {
  type: string,
  url: string,
}

export const refreshCharactersAction = (): LoadCharactersAction => ({
    type: REFRESH_CHARACTERS,
    url: 'https://rickandmortyapi.com/api/character/',
});

export const moreCharactersAction = (url: string): LoadCharactersAction => ({
    type: MORE_CHARACTERS,
    url: url,
});

type StateSlice = StateType["charactersInfo"];
export const charactersInfoSelector = (state: StateType): StateSlice => {
    return state.charactersInfo
};

export const charactersReducer = (
    state: StateSlice = initialState.charactersInfo,
    action: CharactersAction,
): StateSlice => {
    switch (action.type) {
        case ADD_CHARACTERS:
            return new CharactersInfo(state.characters.concat(action.info.characters), action.info.next)
        case UPDATE_CHARACTERS:
            return action.info
        default:
            return state;
    }
}

interface ApiPageInfo {
    next: string
}

interface ApiCharacter {
    id: number,
    name: string,
    status: string,
    image: string,
}

interface ApiResponse {
    info: ApiPageInfo
    results: ApiCharacter[]
}

interface CharactersApi {
    loadCharacters(url: string): Promise<CharactersInfo>
}

class RickAndMortyApi implements CharactersApi {
    loadCharacters = async (url: string): Promise<CharactersInfo>  => {
        const resp = await fetch(url)
        const data: ApiResponse = await resp.json()
        return new CharactersInfo(data.results.map(c => new Character(c.id, c.name, c.status, c.image)), data.info.next)
    }
}

class CharactersSaga {
    api: CharactersApi
    // Inject api
    constructor (api: CharactersApi) {
        this.api = api
    }

    * refreshCharactersSaga(action: LoadCharactersAction) {
        yield put(updateRefreshingAction(true))
        const chars = yield this.api.loadCharacters(action.url)
        yield put(updateCharactersAction(chars))
        yield put(updateRefreshingAction(false))
    }
    
    * loadMoreCharactersSaga(action: LoadCharactersAction) {
        yield put(updateLoadingAction(true))
        const chars = yield this.api.loadCharacters(action.url)
        yield put(addCharactersAction(chars))
        yield put(updateLoadingAction(false))
    }
}

const api = new RickAndMortyApi()
const saga = new CharactersSaga(api)

export function* charactersSaga() {
    yield all([
        takeLatest(REFRESH_CHARACTERS, saga.refreshCharactersSaga.bind(saga)), 
        takeLatest(MORE_CHARACTERS, saga.loadMoreCharactersSaga.bind(saga))
    ])
}