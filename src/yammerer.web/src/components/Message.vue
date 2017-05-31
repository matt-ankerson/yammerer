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
          {{model.likes}} likes 
        </div>
      </div>
      <div class="text">
        {{model.content}}
      </div>
      <div class="actions">
        <a v-if="!showReplyForm" v-on:click.stop="toggleReplyForm()" class="reply">Reply</a>
        <a v-else                v-on:click.stop="toggleReplyForm()" class="reply">Cancel</a>
        <a v-if="!liked" v-on:click.stop="addLike()" class="like">Like</a>
        <a v-else        v-on:click.stop="removeLike()" class="like active">You like this</a>
        <a v-if="currentUserOwnsComment" v-on:click.stop="remove()" class="like">Delete</a>
      </div>
    </div>
    <!-- conditional rendering with v-if -->
    <div v-if="hasReplies()" class="comments">
      <message v-for="(message, index) in model.replies" 
                :model="message" 
                :reply-as="replyAs" 
                :reply-as-avatar="replyAsAvatar" 
                :key="message.id"
                v-on:remove="model.replies.splice(index, 1)"></message>
    </div>
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
  </div>
</template>

<script>
import helpers from '../helpers'
import $ from 'jquery'
export default {
  name: 'message',
  props: {
    replyAs: String,
    replyAsAvatar: String,
    model: Object
    // custom validator here? (to ensure object props exist)
  },
  data () {
    return {
      liked: false,
      showReplyForm: false,
      replyContent: ''
    }
  },
  computed: {
    replyFormIdentifier: function () {
      return helpers.guid();
    },
    currentUserOwnsComment: function () {
      // ensure the current user is the owner of the message
      // (obviously buggy, fix this with proper user management)
      if (this.replyAs === this.model.author) {
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
    },
    hasReplies: function () {
      // short cicuit evaluation
      return this.model.hasOwnProperty('replies') && this.model.replies.length > 0;
    },
    addLike: function () {
      this.liked = true;
      this.model.likes++;
    },
    removeLike: function () {
      this.liked = false;
      this.model.likes--;
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
        this.model.replies.push(helpers.getNewMessage(this.replyAs, this.replyAsAvatar, this.replyContent));
        this.toggleReplyForm();
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
