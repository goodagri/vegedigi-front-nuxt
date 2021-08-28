<template>
  <v-text-field
    v-model="setAddress"
    label="住所を入力してください"
    placeholder="東京都***市**番**号"
    outlined
  >
  </v-text-field>
</template>
<script>
export default {
  data () {
    return {
      setAddress: ''
    }
  }
}
</script>

<style>

</style>