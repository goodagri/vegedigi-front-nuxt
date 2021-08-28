<template>
  <v-text-field
    v-model="setProductionItem"
    label="主な生産品目を選択してください"
    placeholder="なす"
    outlined
  >
  <!-- <v-text-field
    v-model="setProductionItem"
    :rules="rules"
    :hint="hint"
    label="主な生産品目を選択してください"
    placeholder="なす"
    outlined
  > -->
  </v-text-field>
</template>
<script>
export default {
  data () {
    return {
      setProductionItem: ''
    }
  }
}
</script>

<style>

</style>