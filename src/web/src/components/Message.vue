<template>
  <div class="comment">
    <a class="avatar">
      <!-- bind a html property to a computed value -->
      <img v-bind:src="user.avatar">
    </a>
    <div class="content">
      <a class="author">{{user.name}}</a>
      <div class="metadata">
        <span class="date">{{model.createdAt.toLocaleString()}}</span>
        <div class="rating">
          <i class="thumbs up icon"></i>
          {{model.likes.length}} likes
        </div>
      </div>
      <div class="text">
        {{model.content}}
      </div>      
      <div class="actions unset">
        <a v-if="!showReplyForm" v-on:click.stop="toggleReplyForm" class="reply">Reply</a>
        <a v-if="liked" v-on:click.stop="unlike" class="like active">You like this</a>
        <a v-else-if="!currentUserOwnsComment" v-on:click.stop="like" class="like">Like</a>
      </div>
      <div v-if="currentUserOwnsComment" class="actions">
        <a v-if="!showEditForm" v-on:click.stop="toggleEditForm" class="like">Edit</a>
        <a v-on:click.stop="remove" class="like">Delete</a>
      </div>
    </div>
    <div v-if="hasReplies" class="comments">
      <message v-for="(message, index) in model.replies" :model="message" :channelId="channelId" :key="message.id" v-on:remove="removeReply(index)"></message>
    </div>
    <message-form v-if="showReplyForm" :key="model.id + 'Reply'" :is-new="1 === 1" text="Add Reply" :channelId="channelId" :replyTo="model.id" v-on:visible="toggleReplyForm" v-on:new="addNewReply"></message-form>
    <message-form v-if="showEditForm" :key="model.id + 'Edit'" :is-new="1 !== 1" text="Update" :content="model.content" :channelId="channelId" :replyTo="model.id" v-on:visible="toggleEditForm" v-on:updated="updateContent"></message-form>
  </div>
</template>

<script>
import MessageForm from './MessageForm'
import helpers from '../helpers'
import messageStore from '../data'
import $ from 'jquery'
import { mapGetters } from 'vuex'
export default {
  name: 'message',
  data() {
    return {
      showReplyForm: false,
      showEditForm: false,
      replyContent: ''
    }
  },
  props: {
    model: Object,
    channelId: String
  },
  computed: {
    liked: function () {
      let that = this
      return this.model.likes.includes(that.currentUser.id)
    },
    currentUserOwnsComment: function () {
      return this.currentUser.id === this.user.id
    },
    user: function () {
      let that = this
      return this.users.filter(u => u.id === that.model.postedBy)[0]
    },
    hasReplies: function () {
      return this.model.replies && this.model.replies.length > 0;
    },
    ...mapGetters(['currentUser', 'users'])
  },
  methods: {
    remove: async function () {
      await messageStore.remove(this.channelId, this.model.id, this.currentUser.id)
      this.$emit('remove');
    },
    like: async function () {
      await messageStore.like(this.channelId, this.model.id, this.currentUser.id)
      this.model.likes.push(this.currentUser.id)
    },
    unlike: async function () {
      await messageStore.unlike(this.channelId, this.model.id, this.currentUser.id)      
      this.model.likes.splice(this.model.likes.indexOf(this.currentUser.id), 1)
    },
    toggleReplyForm: function () {
      if(!this.showReplyForm){
        this.showEditForm = false
      }
      this.showReplyForm = !this.showReplyForm;
    },
    toggleEditForm: function () {
      if(!this.showEditForm){
        this.showReplyForm = false
      }
      this.showEditForm = !this.showEditForm
    },
    updateContent: function (content) {
      this.model.content = content
    },
    addNewReply: function (data) {
      this.model.replies.push(messageStore.getReply(data))
    },
    removeReply: function (index) {
      this.model.replies.splice(index, 1)
    }
  },
  components: {
    'message-form': MessageForm
  }
}
</script>

<style scoped>
.ui.minimal.comments .comment .actions.unset {
  all: unset
}
</style>
