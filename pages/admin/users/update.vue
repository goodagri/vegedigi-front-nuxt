<template>
  <BasePage page-title="会員情報変更" :breadcrumb-items="breadcrumbItems">
    <template #main>
      <v-container fluid>
        <v-row
          justify="space-around">
          <v-col cols="8">
            <v-form>
              <v-text-field
                v-model="query.username"
                label="氏名"
                placeholder="氏名を入力してください"
                :rules="[required]"
              />
              <v-text-field
                v-model="password"
                label="パスワード"
                placeholder="パスワードを入力してください"
                :rules="[required]"
              />
              <v-text-field
                v-model="query.mail"
                label="メールアドレス"
                placeholder="メールアドレスを入力してください"
                :rules="[required]"
              />
              <v-text-field
                v-model="phoneNumber"
                label="電話番号"
                placeholder="電話番号を入力してください"
                :rules="[required]"
              />
              <v-text-field
                v-model="postalcode"
                label="郵便番号"
                placeholder="000-1111"
                :rules="[required]"
              />
              <v-text-field
                v-model="query.address"
                label="住所"
                placeholder="住所を入力してください"
                :rules="[required]"
              />
              <v-select
                v-model="selectedMethod"
                label="主な生産方法"
                :items="productMethod"
                :rules="[required]"
              />
              <v-card class="mt-5">
                <v-card-subtitle class="ml-1">主な生産品目</v-card-subtitle>
                <v-flex v-for="production in productions" :key="production" class="ml-5">
                  <v-checkbox
                    v-model="selectedProductions"
                    :label="production"
                    :value="production"
                  />
                </v-flex>
              </v-card>
            <div class="text-center mt-5">
              <v-btn color="primary" @click="onSubmit">この内容で会員情報を変更する</v-btn>
            </div>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </BasePage>
</template>

<script>
import BasePage from '@/components/BasePage'
export default {
  components: {
    BasePage
  },
  async asyncData (context) {
    const query = await context.query
    return {
      query
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
      ],
      username: '',
      password: '',
      email: '',
      postalcode: '',
      address: '',
      phoneNumber: '',
      productMethod: ['Foo', 'Bar', 'Baz'],
      selectedMethod: '',
      productions: ['なす', 'トマト', 'きゅうり', 'じゃがいも'],
      selectedProductions: [],
      required: value => !!value || '必ず入力してください'
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