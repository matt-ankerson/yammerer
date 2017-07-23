<template>
  <div class="ui container">
    <h2>Yammerer</h2>
    <div class="ui centered grid">
      <div class="ten wide column">
        <div class="ui threaded comments">
          <user-header>
            <div class="item">
              <div class="circular ui icon button" v-on:click.stop="toggleMessageForm">
                <i class="plus icon"></i>
              </div>
            </div>
          </user-header>
          <template v-if="showMessageForm">
            <div class="ui divider"></div>
            <message-form v-on:visible="toggleMessageForm" v-on:new="addNewChhannel" :is-new="1 === 1"></message-form>
          </template>
          <div class="ui minimal comments" v-for="(channel, index) in channels" :channel="channel" :key="channel.id">
            <div class="ui divider"></div>
            <message :model="channel.message" :channelId="channel.id" v-on:remove="removeChannel(index)"></message>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './Header'
import Message from './Message'
import MessageForm from './MessageForm'
import messageStore from '../data'

import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'channels',
  data() {
    return {
      channels: [],
      showMessageForm: false
    }
  },
  computed: {
    ...mapGetters(['currentUser'])
  },
  created: function () {
    this.initData()
  },
  methods: {
    toggleMessageForm: function () {
      if (!this.currentUser) return;
      this.showMessageForm = !this.showMessageForm;
    },
    addNewChhannel: function (data) {
      this.channels.push(messageStore.getChannel(data));
    },
    removeChannel: function (index) {
      this.channels.splice(index, 1);
    },
    initData: async function () {
      let users = await messageStore.getUsers()
      this.setUsers(users)
      // this.setUser(users[0])
      let channels = await messageStore.getPosts()
      channels.forEach((channel) => {
        this.channels.push(channel);
      })
    },
    ...mapActions(['setUsers'])
  },
  components: {
    'user-header': Header,
    'message-form': MessageForm,
    'message': Message
  }
}
</script>

<style>
h1,
h2 {
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

.fade-enter-active
/*, .fade-leave-active*/

{
  transition: opacity .5s
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active in <2.1.8 */

{
  opacity: 0
}
</style>
