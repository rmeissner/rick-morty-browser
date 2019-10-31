import 'react-native';
import {
    ApiResponse,
    CharactersSaga,
    CharactersApi,
    moreCharactersAction,
    ApiPageInfo,
    ApiCharacter,
    updateLoadingAction,
    addCharactersAction,
    refreshCharactersAction,
    updateRefreshingAction,
    updateCharactersAction,
} from '../../../src/store/adapters';
import {put} from 'redux-saga/effects';
import {CharactersInfo} from '../../../src/store/models';

const buildApiCharacter = (): ApiCharacter => ({id: 1, name: 'Rick', status: 'Alive', image: 'https://some_url'});

const buildApiPageInfo = (moreData: boolean): ApiPageInfo => ({
    next: moreData ? 'https://example.com/mock_endoint?page=2' : '',
});

const buildApiResponse = (moreData: boolean): ApiResponse => ({
    info: buildApiPageInfo(moreData),
    results: [buildApiCharacter()],
});

describe('CharactersSaga', () => {
    let api: jest.Mocked<CharactersApi>;
    let saga: CharactersSaga;

    beforeEach(async () => {
        api = jest.mock<CharactersApi>();
        api.loadCharactersWithUrl = jest.fn();
        api.loadCharactersWithFilter = jest.fn();
        saga = new CharactersSaga(api);
    });

    it('moreCharactersAction > no error no additional data', async () => {
        const action = moreCharactersAction('https://example.com/mock_endoint');
        const gen = saga.loadMoreCharactersSaga(action);
        expect(gen.next().value).toEqual(put(updateLoadingAction(true)));
        gen.next().value; // load data
        expect(gen.next(buildApiResponse(false)).value).toEqual(
            put(
                addCharactersAction({
                    characters: [{id: 1, name: 'Rick', status: 'Alive', imageUrl: 'https://some_url'}],
                    filter: '',
                    next: '',
                }),
            ),
        );
        expect(gen.next().value).toEqual(put(updateLoadingAction(false)));
        expect(true).toEqual(gen.next().done);
        expect([]).toEqual(api.loadCharactersWithFilter.mock.calls);
        expect([['https://example.com/mock_endoint']]).toEqual(api.loadCharactersWithUrl.mock.calls);
    });

    it('moreCharactersAction > no error with additional data', async () => {
        const action = moreCharactersAction('https://example.com/mock_endoint?page=1');
        const gen = saga.loadMoreCharactersSaga(action);
        expect(gen.next().value).toEqual(put(updateLoadingAction(true)));
        gen.next().value; // load data
        expect(gen.next(buildApiResponse(true)).value).toEqual(
            put(
                addCharactersAction({
                    characters: [{id: 1, name: 'Rick', status: 'Alive', imageUrl: 'https://some_url'}],
                    filter: '',
                    next: 'https://example.com/mock_endoint?page=2',
                }),
            ),
        );
        expect(gen.next().value).toEqual(put(updateLoadingAction(false)));
        expect([]).toEqual(api.loadCharactersWithFilter.mock.calls);
        expect([['https://example.com/mock_endoint?page=1']]).toEqual(api.loadCharactersWithUrl.mock.calls);
    });

    it('moreCharactersAction > error', async () => {
        const action = moreCharactersAction('https://example.com/mock_endoint');
        const gen = saga.loadMoreCharactersSaga(action);
        expect(gen.next().value).toEqual(put(updateLoadingAction(true)));
        gen.next().value; // load data
        expect(gen.throw(new Error("Some error")).value).toEqual(put(updateLoadingAction(false)));
        expect(true).toEqual(gen.next().done);
        expect([]).toEqual(api.loadCharactersWithFilter.mock.calls);
        expect([['https://example.com/mock_endoint']]).toEqual(api.loadCharactersWithUrl.mock.calls);
    });

    it('refreshCharactersAction > no error', async () => {
        const action = refreshCharactersAction('');
        const gen = saga.refreshCharactersSaga(action);
        expect(gen.next().value).toEqual(put(updateRefreshingAction(true)));
        gen.next().value; // load data
        expect(gen.next(buildApiResponse(false)).value).toEqual(
            put(
                updateCharactersAction({
                    characters: [{id: 1, name: 'Rick', status: 'Alive', imageUrl: 'https://some_url'}],
                    filter: '',
                    next: '',
                }),
            ),
        );
        expect(gen.next().value).toEqual(put(updateRefreshingAction(false)));
        expect(true).toEqual(gen.next().done);
        expect([['']]).toEqual(api.loadCharactersWithFilter.mock.calls);
        expect([]).toEqual(api.loadCharactersWithUrl.mock.calls);
    });

    it('refreshCharactersAction > no error with filter and more data', async () => {
        const action = refreshCharactersAction('some filter');
        const gen = saga.refreshCharactersSaga(action);
        expect(gen.next().value).toEqual(put(updateRefreshingAction(true)));
        gen.next().value; // load data
        expect(gen.next(buildApiResponse(true)).value).toEqual(
            put(
                updateCharactersAction({
                    characters: [{id: 1, name: 'Rick', status: 'Alive', imageUrl: 'https://some_url'}],
                    filter: 'some filter',
                    next: 'https://example.com/mock_endoint?page=2',
                }),
            ),
        );
        expect(gen.next().value).toEqual(put(updateRefreshingAction(false)));
        expect(true).toEqual(gen.next().done);
        expect([['some filter']]).toEqual(api.loadCharactersWithFilter.mock.calls);
        expect([]).toEqual(api.loadCharactersWithUrl.mock.calls);
    });

    it('refreshCharactersAction > error', async () => {
        const action = refreshCharactersAction('filter');
        const gen = saga.refreshCharactersSaga(action);
        expect(gen.next().value).toEqual(put(updateRefreshingAction(true)));
        gen.next().value; // load data
        expect(gen.throw(new Error("Some error")).value).toEqual(
            put(
                updateCharactersAction({
                    characters: [],
                    filter: 'filter',
                    next: '',
                }),
            ),
        );
        expect(gen.next().value).toEqual(put(updateRefreshingAction(false)));
        expect(true).toEqual(gen.next().done);
        expect([['filter']]).toEqual(api.loadCharactersWithFilter.mock.calls);
        expect([]).toEqual(api.loadCharactersWithUrl.mock.calls);
    });
});
