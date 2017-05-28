export default {
  getNewMessage (author, avatar, content) {
    return {
      author: author,
      avatar: avatar,
      content: content,
      likes: 0,
      replies: [],
      time: (new Date()).toLocaleString()
    };
  },
  getRandomUserName () {
    let adjectives = [
      'Noisy',
      'Agreeable',
      'Calm',
      'Eager',
      'Happy',
      'Jolly',
      'Kind',
      'Nice',
      'Relieved',
      'Crazy',
      'Victorious',
      'Witty',
      'Zealous'
    ];
    let nouns = [
      'Cat',
      'Dog',
      'Mouse',
      'Horse',
      'Giraffe',
      'Robin',
      'Sparrow',
      'Goat',
      'Duck',
      'Gull',
      'Owl',
      'Trout'
    ];
    return adjectives[Math.floor(Math.random() * adjectives.length)] + ' ' +
            nouns[Math.floor(Math.random() * nouns.length)];
  },
  getRandomAvatarUrl () {
    let avatars = [
      'https://semantic-ui.com/images/avatar/small/elliot.jpg',
      'https://semantic-ui.com/images/avatar/small/jenny.jpg',
      'https://semantic-ui.com/images/avatar/small/joe.jpg',
      'https://semantic-ui.com/images/avatar/small/matt.jpg'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }
}
