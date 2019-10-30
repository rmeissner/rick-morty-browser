import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from 'redux-saga/effects'
import { charactersSaga, charactersReducer, loadingStateReducer } from "./adapters";

const rootReducer = {
  charactersInfo: charactersReducer,
  loadingState: loadingStateReducer
};

function* rootSaga() {
    yield all([charactersSaga()])
}

export const configureStore = () => {
  const middleware = [];
  const sagaMiddleware = createSagaMiddleware();

  middleware.push(sagaMiddleware);

  const store = createStore(
    combineReducers(rootReducer),
    applyMiddleware(...middleware),
  );

  sagaMiddleware.run(rootSaga);
  return store;
};