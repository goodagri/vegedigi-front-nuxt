<template>
  <v-app>
    <BasePage page-title="会員情報変更画面" :breadcrumb-items="breadcrumbItems">
      <template #main>
        <v-container fluid>
          <p class="text-subtitle-1 font-weight-bold">会員情報変更</p>
          <p>会員ID: {{appResponse}}</p>
          <UserForm />
          <v-row class="justify-center">
            <v-btn class="primary" @click="onSubmit">この内容で会員情報を変更する</v-btn>
          </v-row>
        </v-container>
      </template>
    </BasePage>
  </v-app>
</template>
<script>
import BasePage from '@/components/BasePage'
export default {
  components: {
    BasePage
  },
  async asyncData(context) {
    const appResponse = await context.route.params.user_id
    return {
      appResponse
    }
  },
  data () {
    return {
      breadcrumbItems: [
        {
          text: '会員一覧',
          disabled: false,
          href: '/admin/users'
        },
        {
          text: '会員情報変更',
          disabled: true,
          href: ''
        }
      ]
    }
  },
  computed: {
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
