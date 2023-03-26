import {applyMiddleware, combineReducers, createStore} from 'redux';
import logger from 'redux-logger';

import {auth} from './auth';

const middlewares = [logger];
const rootReducer = combineReducers({
    auth,
});
const store = createStore(rootReducer, {}, applyMiddleware(...middlewares));
const getState = store.getState;
const dispatch = store.dispatch;

export {dispatch, getState, store};
