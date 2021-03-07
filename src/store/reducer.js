import { SET_USER, SET_CHANNEL, SET_FAVORITECHANNEL, REMOVE_FAVORITECHANNEL } from "./actiontypes";
import { combineReducers } from "redux";

let defaultUserState = {
    currentUser: null
}

const userReducer = (state = defaultUserState, action) => {
    if (action.type === SET_USER) {
        let payload = action.payload;
        state = { ...payload };
        return state;
    }
    return state;
}

let defaultChannelState = {
    currentChannel: null,
    loading : true
}

const channelReducer = (state = defaultChannelState, action) => {
    if (action.type === SET_CHANNEL) {
        let payload = action.payload;
        state = { ...payload };
        state.loading = false;
        return state;
    }
    return state;
}

let defaultFavoriteChannelState = {
    favoriteChannel: {}
}

const favoriteChannelReducer = (state = defaultFavoriteChannelState, action) => {
    if (action.type === SET_FAVORITECHANNEL) {
        let payload = action.payload.favoriteChannel;
        let updatedState = { ...state.favoriteChannel };
        updatedState[payload.channelId] = payload.channelName;
        return { favoriteChannel : updatedState };
    }
    else if (action.type === REMOVE_FAVORITECHANNEL) {
        let payload = action.payload.favoriteChannel;
        let updatedState = { ...state.favoriteChannel };
        delete updatedState[payload.channelId];
        return { favoriteChannel : updatedState };
    }
    return state;
}

export const combinedReducers = combineReducers({ user: userReducer, channel: channelReducer, favoriteChannel : favoriteChannelReducer });