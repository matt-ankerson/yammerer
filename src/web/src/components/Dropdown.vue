<template>
  <div class="ui fluid selection dropdown">
    <input type="hidden" name="user">
    <i class="dropdown icon"></i>
    <div class="default text">Select User</div>
    <div class="menu">
      <div :key="item.name" v-for="(item, index) in items" :data-value="item.name" class="item">
        <img class="ui mini avatar image" :src="item.avatar"> {{item.name}}
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'dropdown',
  data () {
    return {
      internalValue: undefined
    }
  },
  props: {
    items: Array,
    value: undefined
  },
  watch: {
    internalValue: function() {
      this.$emit('input', this.internalValue);
    }
  },
  created: function () {
    this.internalValue = this.value
  },
  mounted: function () {
    let that = this;
    $(this.$el).dropdown({
      onChange: (value, text, $choice) => {
        this.internalValue = that.items.filter((item) => item.name === value)[0];
      }
    })
  },
  beforeDestroy: function () {
    $(this.$el).dropdown('destroy')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
