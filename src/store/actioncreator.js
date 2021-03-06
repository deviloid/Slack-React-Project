import { SET_USER, SET_CHANNEL, SET_FAVORITECHANNEL, REMOVE_FAVORITECHANNEL } from "./actiontypes";

export const setUser = (user) => {
    return {
        type    : SET_USER,
        payload : {
            currentUser : user
        }
    }
}

export const setChannel = (channel) => {
    return {
        type    : SET_CHANNEL,
        payload : {
            currentChannel : channel
        }
    }
}

export const setFavoriteChannel = (channel) => {
    return {
        type    : SET_FAVORITECHANNEL,
        payload : {
            favoriteChannel : channel
        }
    }
}

export const removeFavoriteChannel = (channel) => {
    return {
        type    : REMOVE_FAVORITECHANNEL,
        payload : {
            favoriteChannel : channel
        }
    }
}

