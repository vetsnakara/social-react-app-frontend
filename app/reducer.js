export function appReducer(state, action) {
    switch (action.type) {
        case "login":
            return {
                ...state,
                loggedIn: true,
            }
        case "logout":
            return {
                ...state,
                loggedIn: false,
            }
        case "flashMessage":
            return {
                ...state,
                flashMessages: state.flashMessages.concat(action.value),
            }
        default:
            return state
    }
}
