import {Character, CharactersInfo} from '../models';
import {initialState, StateType} from '../state';
import {all, takeLatest, put, call } from 'redux-saga/effects';
import {updateLoadingAction, updateRefreshingAction} from './list';

// Layout actions -> update layout
const UPDATE_CHARACTERS = 'characters/layout/update';
const ADD_CHARACTERS = 'characters/layout/add';

export interface CharactersAction {
    type: string;
    info: CharactersInfo;
}

export const updateCharactersAction = (info: CharactersInfo): CharactersAction => ({
    type: UPDATE_CHARACTERS,
    info,
});

export const addCharactersAction = (info: CharactersInfo): CharactersAction => ({
    type: ADD_CHARACTERS,
    info,
});

// Data actions -> update state
const REFRESH_CHARACTERS = 'characters/data/refresh';
const MORE_CHARACTERS = 'characters/data/more';

interface RefreshCharactersAction {
    type: string;
    filter: string;
}

interface LoadCharactersAction {
    type: string;
    url: string;
}

export const refreshCharactersAction = (filter: string): RefreshCharactersAction => ({
    type: REFRESH_CHARACTERS,
    filter: filter,
});

export const moreCharactersAction = (url: string): LoadCharactersAction => ({
    type: MORE_CHARACTERS,
    url: url,
});

type StateSlice = StateType['charactersInfo'];
export const charactersInfoSelector = (state: StateType): StateSlice => {
    return state.charactersInfo;
};

export const charactersReducer = (
    state: StateSlice = initialState.charactersInfo,
    action: CharactersAction,
): StateSlice => {
    switch (action.type) {
        case ADD_CHARACTERS:
            return new CharactersInfo(state.characters.concat(action.info.characters), action.info.next, state.filter);
        case UPDATE_CHARACTERS:
            return action.info;
        default:
            return state;
    }
};

export interface ApiPageInfo {
    next: string;
}

export interface ApiCharacter {
    id: number;
    name: string;
    status: string;
    image: string;
}

export interface ApiResponse {
    info: ApiPageInfo;
    results: ApiCharacter[];
}

export interface CharactersApi {
    loadCharactersWithFilter(filter: string): Promise<ApiResponse>;
    loadCharactersWithUrl(url: string): Promise<ApiResponse>;
}

export class RickAndMortyApi implements CharactersApi {
    baseUrl = 'https://rickandmortyapi.com/api/character/';

    loadCharactersWithFilter = async (filter: string): Promise<ApiResponse> => {
        const url = filter.trim().length == 0 ? this.baseUrl : this.baseUrl + '?name=' + filter;
        return this.loadCharactersWithUrl(url);
    };

    loadCharactersWithUrl = async (url: string): Promise<ApiResponse> => {
        const resp = await fetch(url);
        // Throw error depending on status (e.g. 404 -> NoResultsException)
        if (!resp.ok) throw new Error('Request failed');
        const data: ApiResponse = await resp.json();
        return data;
    };
}

export class CharactersSaga {
    api: CharactersApi;
    // Inject api
    constructor(api: CharactersApi) {
        this.api = api;
    }

    mapNext = (response: ApiResponse): string => response.info.next;

    mapCharacters = (response: ApiResponse): Character[] => {
        return response.results.map(c => new Character(c.id, c.name, c.status, c.image));
    };

    *refreshCharactersSaga(action: RefreshCharactersAction) {
        yield put(updateRefreshingAction(true));
        try {
            const response = yield this.api.loadCharactersWithFilter(action.filter);
            const info = new CharactersInfo(this.mapCharacters(response), this.mapNext(response), action.filter);
            yield put(updateCharactersAction(info));
        } catch (e) {
            console.log(e)
            // We should propagate the error and show it to the user, for now we show an empty list
            const info = new CharactersInfo([], '', action.filter);
            yield put(updateCharactersAction(info));
        }
        yield put(updateRefreshingAction(false));
    }

    *loadMoreCharactersSaga(action: LoadCharactersAction) {
        yield put(updateLoadingAction(true));
        try {
            const response = yield this.api.loadCharactersWithUrl(action.url);
            const info = new CharactersInfo(this.mapCharacters(response), this.mapNext(response), '');
            yield put(addCharactersAction(info));
        } catch (e) {
            console.log(e)
            // We should propagate the error and show it to the user, for now we do nothing to the user can try again
        }
        yield put(updateLoadingAction(false));
    }
}

const api = new RickAndMortyApi();
const saga = new CharactersSaga(api);

export function* charactersSaga() {
    yield all([
        takeLatest(REFRESH_CHARACTERS, saga.refreshCharactersSaga.bind(saga)),
        takeLatest(MORE_CHARACTERS, saga.loadMoreCharactersSaga.bind(saga)),
    ]);
}
