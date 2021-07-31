export function appReducer(draft, action) {
    switch (action.type) {
        case "login":
            draft.user = action.value
            break
        case "logout":
            draft.user = null
            break
        case "flashMessage":
            draft.flashMessages.push(action.value)
            break
    }
}
