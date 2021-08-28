<template>
  <v-text-field
    v-model="setNumber"
    label="電話番号を入力してください"
    placeholder="080-****-****"
    outlined
  >
  </v-text-field>
</template>
<script>
export default {
  data () {
    return {
      setNumber: ''
    }
  }
}
</script>

<style>

</style>