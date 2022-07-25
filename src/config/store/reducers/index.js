import * as actionTypes from '../types'
import { combineReducers } from 'redux'
const intialState = {
    currentUser: null,
    isLoading: true
}
const user_reducer = (state = intialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            }
        case actionTypes.CLEAR_USER:
            return {
                currentUser: null,
                isLoading: false
            }

        default:
            return state
    }
}
// channel reducer
const intialChannelState = {
    currentChannel: null,
    isPrivateChannel: false,
    userPosts: null

}
const channel_reducer = (state = intialChannelState, action) => {
    let { type, payload } = action
    switch (type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: payload.currentChannel
            }
        case actionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: payload.isPrivateChannel
            }
        case actionTypes.SET_USER_POSTS:
            return {
                ...state,
                userPosts: payload.userPosts
            }
        default:
            return state

    }
}

let intialColorState = {
    primaryColor:"",
    secondaryColor:""
}
const color_reducer = ( state=intialColorState,action) => {
  
    switch (action.type){
        case actionTypes.SET_COLORS:
            return {
                primaryColor:action && action.payload.primaryColor,
                secondaryColor:action && action.payload.secondaryColor
            }
        default:
            return state
    }
}
const rootReducer = combineReducers({ user: user_reducer, channel: channel_reducer,colors:color_reducer })

export default rootReducer