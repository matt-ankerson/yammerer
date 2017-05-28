<template>
  <div class="ui container">
    <h2>Yammerer</h2>
    <div class="ui centered grid">
      <div class="ten wide column">
        <div class="ui threaded comments">
          <h3 class="ui dividing header">Discussion</h3>
          <message v-for="message in messages" :model="message" :key="message.id"></message>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Message from './Message'
export default {
  name: 'channel',
  data () {
    return {
      messages: [{
        content: 'first message',
        likes: 2,
        time: '2017-5-28 17:49:24',
        replies: [{
          content: 'first reply',
          likes: 0,
          replies: [],
          time: '2017-5-28 17:49:24'
        }]
      }]
    }
  },
  components: {
    'message': Message
  }
}
</script>

<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
