<template>
  <v-card>
    <v-card-text>{{ storeStatus.latestTime }}</v-card-text>
    <v-card-text>{{ storeStatus.manyVegetable }}</v-card-text>
    <v-card-text>{{ storeStatus.wellVegetable }}</v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    storeStatus: {
      type:Object,
      default: null,
    }
  },
  }
</script>

<style></style>
