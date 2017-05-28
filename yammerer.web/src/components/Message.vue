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
      </div>
    </div>
    <!-- conditional rendering with v-if -->
    <div v-if="hasReplies()" class="comments">
      <message v-for="message in model.replies" 
                :model="message" 
                :reply-as="replyAs" 
                :reply-as-avatar="replyAsAvatar" 
                :key="message.id"></message>
    </div>
    <form v-if="showReplyForm" class="ui reply form">
      <div class="field">
        <textarea v-model="replyContent" class="ui focus"></textarea>
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
  methods: {
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
      // Add a reply, pass in the authoring details.
      this.model.replies.push(helpers.getNewMessage(this.replyAs, this.replyAsAvatar, this.replyContent));
      this.toggleReplyForm();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
