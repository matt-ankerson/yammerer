export default {
    // Our persistent storage is not reactive.
    // So, we need to provide an object which we can bind to.
    reactive: {
        messages: []
    },
    hasMessages() {
        // Is this the first visit for this browser?
        if (localStorage.getItem('messages') === null) {
            return false;
        }
        return true;
    },
    saveState() {
        // Persist the current messages.
        this.setMessages(this.reactive.messages);
    },
    loadMessages() {
        // Hydrate the reactive messages with the contents of localStorage.
        let parsedMessages = JSON.parse(localStorage.getItem('messages'));
        this.reactive.messages = parsedMessages;
    },
    setMessages(newMessages) {
        // Write/Overwrite messages into localStorage
        localStorage.setItem('messages', JSON.stringify(newMessages));
    }
}
