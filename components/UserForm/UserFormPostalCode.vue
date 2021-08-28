<template>
  <!-- <v-text-field
    v-model="setPostalcode"
    :rules="rules"
    :hint="hint"
    label="郵便番号を入力してください"
    placeholder="000-1111"
    outlined
  > -->
  <v-text-field
    v-model="setPostalcode"
    label="郵便番号を入力してください"
    placeholder="000-1111"
    outlined
  >
  </v-text-field>
</template>
<script>
export default {
  data () {
    return {
      setPostalcode: ''
    }
  }
}
</script>

<style>

</style>