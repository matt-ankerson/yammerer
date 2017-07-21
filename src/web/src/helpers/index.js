const adjectives = [
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
const nouns = [
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
const avatars = [
      'https://semantic-ui.com/images/avatar/small/elliot.jpg',
      'https://semantic-ui.com/images/avatar/small/jenny.jpg',
      'https://semantic-ui.com/images/avatar/small/joe.jpg',
      'https://semantic-ui.com/images/avatar/small/matt.jpg',
      'https://semantic-ui.com/images/avatar/small/helen.jpg',
      'https://semantic-ui.com/images/avatar/small/justen.jpg',
      'https://semantic-ui.com/images/avatar/small/laura.jpg'
    ];

export default {
  getNewMessage (user, content) {
    return {
      author: user.name,
      avatar: user.avatar,
      content: content,
      likers: [],
      replies: [],
      time: (new Date()).toLocaleString()
    };
  },
  getRandomUserName () {
    return adjectives[Math.floor(Math.random() * adjectives.length)] + ' ' +
            nouns[Math.floor(Math.random() * nouns.length)];
  },
  getRandomAvatarUrl () {
    return avatars[Math.floor(Math.random() * avatars.length)];
  },
  guid () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  },
  getRandonUserList () {
    return Array.from({length: 5}, (v, i) => {
      return {
      name: this.getRandomUserName(),
      avatar: this.getRandomAvatarUrl()
      }
    })
  }
}
