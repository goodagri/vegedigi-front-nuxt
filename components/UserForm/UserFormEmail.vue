<template>
  <v-text-field
    v-model="setEmail"
    :rules="rules"
    label="メールアドレスを入力してください(必須)"
    placeholder="example@email.com"
    outlined
  >
  </v-text-field>
</template>

<script>
export default {
  data() {
    return {
      rules: [
        v => !!v || '',
        // test()メソッドを使い、正しければtrueを返します。
        // 「@と.が含まれているか」の簡易チェック
        v => /.+@.+\..+/.test(v) || ''
      ],
      setEmail: ''
    }
  }
}
</script>

<style>

</style>