<template>
  <v-text-field
    v-model="setPassword"
    :rules="rules"
    :hint="hint"
    label="パスワードを入力してください(必須)"
    placeholder="password"
    outlined
  >
  </v-text-field>
</template>
<script>
export default {
  data () {
    return {
      hint: '',
      rules: [],
      setPassword: ''
    }
  }
}
</script>

<style>

</style>