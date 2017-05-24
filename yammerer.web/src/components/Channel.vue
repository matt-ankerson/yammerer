<template>
  <div class="channel">
    <h2>Yammerer</h2>
    <message v-for="message in messages" :model="message" :key="message.id"></message>
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
        replies: [{
          content: 'first reply',
          replies: []
        }]
      }]
    }
  },
  components: {
    'message': Message
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
