<template>
  <div class="ui container">
    <h2>Yammerer</h2>
    <div class="ui centered grid">
      <div class="ten wide column">
        <div class="ui threaded comments">
  
          <div class="ui text menu">
            <dropdown :items="userList" :selected.sync="selectedUser" />
            <div class="right menu">
              <div class="item">
                <div class="circular ui icon button" v-on:click.stop="toggleMessageForm()">
                  <i v-if="!showMessageForm" class="plus icon"></i>
                  <i v-else class="remove icon"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="ui divider"></div>
  
          <transition name="fade">
            <form v-if="showMessageForm" class="ui reply form" id="messageForm">
              <div class="field">
                <textarea v-model="newMessageContent" name="newMessageContent"></textarea>
              </div>
              <div class="ui primary labeled icon button" v-on:click.stop="addMessage()">
                <i class="icon edit"></i> Add Message
              </div>
              <div class="ui button" v-on:click.stop="toggleMessageForm()">
                Cancel
              </div>
              <div class="ui divider hidden"></div>
            </form>
          </transition>
  
          <message v-for="(message, index) in messages" :model="message" :reply-as="selectedUser.username" :reply-as-avatar="selectedUser.avatar" :key="message.id" v-on:remove="removeChild(index)"></message>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helpers from '../helpers'
import Dropdown from './Dropdown'
import Message from './Message'
import messageStore from '../data'
import $ from 'jquery'
const users = helpers.getRandonUserList();
export default {
  name: 'channel',
  data: function () {
    return {
      messages: messageStore.reactive.messages,
      showMessageForm: false,
      newMessageContent: '',
      userList: users,
      selectedUser: users[0]
    }
  },
  beforeCreate: function () {
    if (!messageStore.hasMessages()) {
      // If empty, prime the message store
      messageStore.setMessages([{
        author: users[0].username,
        avatar: users[0].avatar,
        content: 'Gidday maaate!!',
        likes: 2,
        time: '2017-5-28 17:49:24',
        replies: []
      }]);
    }
    // Load messages into reactive memory
    messageStore.loadMessages();
  },
  // methods are evaluated every time they're invoked
  methods: {
    addMessage: function () {
      // Form validation with semantic UI
      let messageForm = $('#messageForm');
      messageForm.form({
        inline: true,
        fields: {
          newMessageContent: {
            identifier: 'newMessageContent', // <-- binds to id, name or data-validate
            rules: [{
              type: 'empty',
              prompt: 'Please enter your message'
            }]
          }
        }
      });
      messageForm.form('validate form');

      if (messageForm.form('is valid')) {
        // Add a message to the beginning of array, pass in the authoring details.
        this.messages.unshift(helpers.getNewMessage(this.selectedUser.username, this.selectedUser.avatar, this.newMessageContent));
        this.toggleMessageForm();
        messageStore.saveState();
      }
    },
    toggleMessageForm: function () {
      this.showMessageForm = !this.showMessageForm;
      this.newMessageContent = '';
    },
    removeChild: function (index) {
      this.messages.splice(index, 1);
      messageStore.saveState();
    }
  },
  components: {
    'message': Message,
    'dropdown': Dropdown
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
