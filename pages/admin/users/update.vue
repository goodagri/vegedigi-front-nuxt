<template>
    <BasePage page-title="会員情報変更" :breadcrumb-items="breadcrumbItems">
      <template #main>
        <v-container fluid>
          <p class="text-subtitle-1 font-weight-bold">会員情報変更</p>
          <UserFormName />
          <UserFormPassword />
          <UserFormEmail />
          <UserFormBirthday />
          <UserFormNumber />
          <UserFormPostalCode />
          <UserFormAddress />
          <UserFormProductionItem />
          <UserFormMethod />
          <v-row class="justify-center">
            <v-btn class="primary" @click="onSubmit">この内容で会員情報を変更する</v-btn>
          </v-row>
        </v-container>
      </template>
    </BasePage>
</template>

<script>
import BasePage from '@/components/BasePage'
import UserFormName from '~/components/UserForm/UserFormName.vue'
export default {
  components: {
    BasePage,
    UserFormName
  },
  data () {
    return {
      breadcrumbItems: []
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    onSubmit () {
      alert('確認のEmail送信して、DBに会員情報を更新して、送信画面に遷移する。')
    }
  }
}
</script>
<style scoped>
</style>