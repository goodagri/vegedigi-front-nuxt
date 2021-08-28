<template>
  <!-- <v-text-field
    v-model="setMethod"
    :rules="rules"
    :hint="hint"
    label="主な生産方法を選択してください"
    placeholder="選択式にする"
    outlined
  > -->
  <v-text-field
    v-model="setMethod"
    label="主な生産方法を選択してください"
    placeholder="選択式にする"
    outlined
  >
  </v-text-field>
</template>
<script>
export default {
  data () {
    return {
      setMethod: ''
    }
  }
}
</script>

<style>

</style>