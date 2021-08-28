<template>
  <v-text-field
    v-model="setBirthday"
    label="誕生日を入力してください"
    placeholder="1970/01/01"
    outlined
  >
  </v-text-field>
</template>
<script>
export default {
  data () {
    return {
      setBirthday: ''
    }
  }
}
</script>

<style>

</style>