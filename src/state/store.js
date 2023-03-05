import {createStore, combineReducers, applyMiddleware} from 'redux'
import {auth} from './auth'
import logger from "redux-logger";

const middlewares = [logger];
const rootReducer = combineReducers({
    auth,
});
const store = createStore(rootReducer, {}, applyMiddleware(...middlewares));
const getState = store.getState;
const dispatch = store.dispatch;

export {getState, dispatch, store}