export function appReducer(draft, action) {
    switch (action.type) {
        case "login":
            draft.loggedIn = true
            break
        case "logout":
            draft.loggedIn = false
            break
        case "flashMessage":
            draft.flashMessages.push(action.value)
            break
    }
}
