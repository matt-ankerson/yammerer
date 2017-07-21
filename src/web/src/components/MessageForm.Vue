<template>
    <transition name="fade">
        <form class="ui reply form">
            <div class="field">
                <textarea name="newMessageContent" v-model="messageContent"></textarea>
            </div>
            <div class="ui primary labeled icon button" v-on:click.stop="addMessage">
                <i class="icon edit"></i> {{defaultText}}
            </div>
            <div class="ui button" v-on:click="hide">
                Cancel
            </div>
            <div class="ui divider hidden"></div>
        </form>
    </transition>
</template>

<script>
import $ from 'jquery'
import messageStore from '../data'
import { mapGetters } from 'vuex'

export default {
    name: 'message-form',
    data() {
        return {
            defaultText: 'Add Message',
            messageContent: ''
        }
    },
    props: {
        content: '',
        isNew: Boolean,
        text: undefined,
        channelId: undefined,
        replyTo: undefined
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    created: function () {
        if (!this.isNew) this.messageContent = this.content
        if (this.text) this.defaultText = this.text
    },
    methods: {
        hide: function () {
            this.$emit('visible', false);
        },
        addMessage: async function () {
            // Form validation with semantic UI
            let messageForm = $(this.$el)
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
                if (this.isNew) {
                    // Add a message to the beginning of array, pass in the authoring details.
                    let newMessage = await messageStore.sendMessage(this.channelId, this.replyTo, this.messageContent, this.currentUser.id)
                    this.$emit('new', newMessage)
                }else{                    
                    await messageStore.update(this.channelId, this.replyTo, this.messageContent, this.currentUser.id)                    
                    this.$emit('updated', this.messageContent)
                }

                this.hide();
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
