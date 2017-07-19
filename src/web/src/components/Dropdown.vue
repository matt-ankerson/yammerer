<template>
  <div class="ui fluid selection dropdown">
    <input type="hidden" name="user">
    <i class="dropdown icon"></i>
    <div class="default text">Select User</div>
    <div class="menu">
      <div :key="item.username" v-for="(item, index) in items" :data-value="item.username" class="item">
        <img class="ui mini avatar image" :src="item.avatar"> {{item.username}}
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'dropdown',
  props: {
    items: Array,
    selected: Object
  },
  mounted: function () {
    let that = this;
    $(this.$el).dropdown({
      onChange: (value, text, $choice) => {
        that.$emit('update:selected', that.items.filter((item) => item.username === value)[0])
      }
    })
    .dropdown('set selected', this.selected.username)
  },
  beforeDestroy: function () {
    $(this.$el).dropdown('destroy')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
