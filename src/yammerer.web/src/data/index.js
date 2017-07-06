export default {
    // Seed the initial messages
    seedMessages() {
        if (localStorage.getItem('messages') !== null) {
            return;
        }
        localStorage.setItem('messages', JSON.stringify([{
            author: 'Mike Nolan',
            avatar: 'https://semantic-ui.com/images/avatar/small/matt.jpg',
            content: 'Gidday maaate!!',
            likes: 2,
            time: '2017-5-28 17:49:24',
            replies: [{
                author: 'Crazy Steve',
                avatar: 'https://semantic-ui.com/images/avatar/small/joe.jpg',
                content: 'Yeah nah yeah yeah nah.',
                likes: 0,
                replies: [],
                time: '2017-5-28 17:49:24'
            }]
        }]));
    },
    getMessages() {
        return JSON.parse(localStorage.getItem('messages'));
    },
    setMessages(messages) {
        localStorage.setItem('messages', JSON.stringify(messages));
    }
}