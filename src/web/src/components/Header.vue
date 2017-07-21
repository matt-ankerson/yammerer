<template>
  <div class="ui text menu">
    <dropdown :items="users" v-model="currentUser" />
    <div class="right menu">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import messageStore from '../data'
import Dropdown from './Dropdown'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'header',
  data() {
    return {
      userList: [],
      currentUser: undefined
    }
  },
  watch: {
    currentUser: function () {
      this.setUser(this.currentUser)
    }
  },
  computed: {
    ...mapGetters(['users'])
  },
  methods: {
    ...mapActions(['setUser'])
  },
  components: {
    'dropdown': Dropdown
  }
}
</script>
