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
        saga = new CharactersSaga(api);
    });

    it('moreCharactersAction > no error', async () => {
        api.loadCharactersWithUrl = jest.fn()
        const action = moreCharactersAction('https://example.com/mock_endoint');
        const gen = saga.loadMoreCharactersSaga(action);
        expect(gen.next().value).toEqual(put(updateLoadingAction(true)));
        gen.next().value // load data
        // TODO: check that api was called
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
        expect(true).toEqual(gen.next().done)
    });

    it('refreshCharactersAction > no error', async () => {
        api.loadCharactersWithFilter = jest.fn()
        const action = refreshCharactersAction('');
        const gen = saga.refreshCharactersSaga(action);
        expect(gen.next().value).toEqual(put(updateRefreshingAction(true)));
        gen.next().value // load data
        // TODO: check that api was called
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
        expect(true).toEqual(gen.next().done)
    });
});
