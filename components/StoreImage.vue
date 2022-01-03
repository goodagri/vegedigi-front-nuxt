<template>
  <v-img
    max-height="500"
    contain
    :src="item.src"
  ></v-img>
</template>

<script>
export default {
  props: {
    item: {
      type:Object,
      default: null,
    }
  },
  }
</script>

<style></style>
