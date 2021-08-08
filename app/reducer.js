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
        case "openSearch":
            draft.isSearchOpen = true
            break
        case "closeSearch":
            draft.isSearchOpen = false
            break
        case "toggleChat":
            draft.isChatOpen = !draft.isChatOpen
            break
        case "incrementUnreadChatCount":
            draft.unreadChatCount++
            break
        case "clearUnreadChatCount":
            draft.unreadChatCount = 0
            break
    }
}
