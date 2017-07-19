<template>
  <div class="comment">
    <a class="avatar">
      <!-- bind a html property to a computed value -->
      <img v-bind:src="model.avatar">
    </a>
    <div class="content">
      <a class="author">{{model.author}}</a>
      <div class="metadata">
        <span class="date">{{model.time}}</span>
        <div class="rating">
          <i class="thumbs up icon"></i>
          {{model.likers.length}} likes 
        </div>
      </div>
      <div class="text">
        {{model.content}}
      </div>
      <div class="actions">
        <a v-if="!showReplyForm" v-on:click.stop="toggleReplyForm()" class="reply">Reply</a>
        <a v-else                v-on:click.stop="toggleReplyForm()" class="reply">Cancel</a>
        <a v-if="liked" v-on:click.stop="removeLike()" class="like active">You like this</a>
        <a v-else-if="!currentUserOwnsComment" v-on:click.stop="addLike()" class="like">Like</a>
        <a v-if="currentUserOwnsComment" v-on:click.stop="remove()" class="like">Delete</a>
      </div>
    </div>
    <!-- conditional rendering with v-if -->
    <div v-if="hasReplies()" class="comments">
      <message v-for="(message, index) in model.replies" 
                :model="message" 
                :reply-as="replyAs"
                :key="message.id"
                v-on:remove="removeChild(index)"></message>
    </div>
    <transition name="fade">
      <form v-if="showReplyForm" class="ui reply form" v-bind:id="replyFormIdentifier">
        <div class="field">
          <textarea v-model="replyContent" class="ui focus" name="replyContent"></textarea>
        </div>
        <div class="ui primary labeled icon button" v-on:click.stop="addReply()">
          <i class="icon edit"></i> Add Reply
        </div>
        <div class="ui button" v-on:click.stop="toggleReplyForm()">
          Cancel 
        </div>
      </form>
    </transition>
  </div>
</template>

<script>
import helpers from '../helpers'
import messageStore from '../data'
import $ from 'jquery'
export default {
  name: 'message',
  props: {
    replyAs: Object,
    model: Object
  },
  data () {
    return {
      showReplyForm: false,
      replyContent: ''
    }
  },
  computed: {
    replyFormIdentifier: function () {
      return helpers.guid();
    },
    liked: function () {
      return this.model.likers.includes(this.replyAs.username)
    },
    currentUserOwnsComment: function () {
      // ensure the current user is the owner of the message
      // (obviously buggy, fix this with proper user management)
      if (this.replyAs.username === this.model.author) {
        return true;
      }
      return false;
    }
  },
  methods: {
    remove: function () {
      if (!this.currentUserOwnsComment) { return; }
      /* eslint-disable no-undef */
      this.$emit('remove');  // emit an event which the parent will recieve.
      messageStore.saveState();
    },
    hasReplies: function () {
      // short cicuit evaluation
      return this.model.hasOwnProperty('replies') && this.model.replies.length > 0;
    },
    addLike: function () {
      this.model.likers.push(this.replyAs.username);
      messageStore.saveState();
    },
    removeLike: function () {
      this.model.likers.splice(this.model.likers.indexOf(this.replyAs.username), 1);
      messageStore.saveState();
    },
    toggleReplyForm: function () {
      this.showReplyForm = !this.showReplyForm;
      this.replyContent = '';
    },
    addReply: function () {
      // Form validation with semantic UI
      let replyForm = $('#' + this.replyFormIdentifier);
      replyForm.form({
        inline: true,
        fields: {
          replyContent: {
            identifier: 'replyContent', // <-- binds to id, name or data-validate
            rules: [{
              type: 'empty',
              prompt: 'Please enter your reply'
            }]
          }
        }
      });
      replyForm.form('validate form');

      if (replyForm.form('is valid')) {
        // Add a reply, pass in the authoring details.
        this.model.replies.push(helpers.getNewMessage(this.replyAs, this.replyContent));
        this.toggleReplyForm();
        messageStore.saveState();
      }
    },
    removeChild: function (index) {
      this.model.replies.splice(index, 1);
      messageStore.saveState();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
