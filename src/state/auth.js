import {createSelector} from "reselect";

export const AUTH_SET_AUTH_DATA = 'app/auth/AUTH_SET_AUTH_DATA';
export const AUTH_SET_UAM_TOKEN = 'app/auth/AUTH_SET_UAM_TOKEN';

const getInitialData = () => ({
    accessToken: null,
    refreshToken: null,
});

export const auth = (state = getInitialData(), action) => {
    switch (action.type) {
        case AUTH_SET_AUTH_DATA: {
            const {id, accessToken, refreshToken} = action.payload || {};

            return {...state, accessToken, refreshToken, id};
        }
        default:
            return state;
    }
}

export const setAuthData = ({accessToken, refreshToken, id, expirationDate, isAnonymous}) => ({
    type: AUTH_SET_AUTH_DATA,
    payload: {accessToken, refreshToken, id, expirationDate, isAnonymous},
});

export const clearUamAuthToken = (isHolder) => {
    const dic = {
        type: AUTH_SET_UAM_TOKEN,
    };

    if (isHolder) {
        dic.holderUamAuthToken = undefined;
    } else {
        dic.uamAuthToken = undefined;
    }

    return dic;
};
export const removeAuthData = () => ({type: AUTH_SET_AUTH_DATA, payload: null});

const selectAuth = (state) => state.auth;
export const makeSelectAccessToken = () => createSelector(selectAuth, (authState) => authState.accessToken);
export const makeSelectUserId = () => createSelector(selectAuth, (authState) => authState.id);
