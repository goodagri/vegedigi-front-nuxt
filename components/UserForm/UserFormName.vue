<template>
<div>
  <v-text-field
    v-model="setName"
    :rules="rules"
    :counter="max"
    label="氏名を入力してください(必須)"
    placeholder="氏名"
    outlined
  >
  </v-text-field>
  </div>
</template>
<script>
export default {
  data () {
    const max = 30
    return {
      setName: '',
      breadcrumbItems: [],
      max,
      rules: [
        v => !!v || '',
        v => (!!v && max >= v.length) || `${max}文字以内で入力してください`
      ]
    }
  },
}
</script>

<style scoped>
</style>