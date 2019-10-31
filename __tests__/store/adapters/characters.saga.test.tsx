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
} from '../../../src/store/adapters';
import {put} from 'redux-saga/effects';
import {CharactersInfo} from '../../../src/store/models';

const buildApiCharacter = (): ApiCharacter => ({id: 1, name: 'Rick', status: 'Alive', image: 'https://some_url'});

const buildApiPageInfo = (moreData: boolean): ApiPageInfo => ({
    next: moreData ? 'https://example.com/mock_endoint?page=2' : '',
});

const buildApiResponseAsync = async (moreData: boolean): Promise<ApiResponse> => ({
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


    it.only('moreCharactersAction  > no error', async () => {
        api.loadCharactersWithUrl = jest.fn((url) => buildApiResponseAsync(false));
        const action = moreCharactersAction('https://example.com/mock_endoint');
        const gen = saga.loadMoreCharactersSaga(action);
        expect(gen.next().value).toEqual(put(updateLoadingAction(true)));
        await gen.next().value // load data
        expect(gen.next().value).toEqual(
            put(
                addCharactersAction({
                    characters: [{id: 1, name: 'Rick', status: 'Alive', imageUrl: 'https://some_url'}],
                    filter: '',
                    next: '',
                }),
            ),
        );
    });
});
