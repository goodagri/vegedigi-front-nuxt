<template>
  <v-app>
    <v-img
    src="/A_yoko1.svg"
    max-height="60"
    max-width="180"
    class="mt-2 ml-2"
    />
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <div class="logo py-4 d-flex justify-center">
          <AppLogo />
        </div>
        <v-card>
          <v-card-title class="headline">
            ログイン
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field v-model='user.mail' label="メールアドレス" :error-messages="errors.mail" />
              <v-text-field
                v-model="user.password"
                label="パスワード"
                :type="passwordInputType"
                :error-messages="errors.password"
              >
                <v-icon
                  slot="append"
                  :color="passwordInputTypeIconColor"
                  @click="switchPasswordInputType"
                >
                  mdi-eye-off
                </v-icon>
              </v-text-field>
              <!-- <div class="error--text" v-for="(err, index) in errors.non_field_errors" :key="index">
                {{ err }}
              </div> -->
              <v-card-actions>
                <v-row justify="end">
                  <v-btn color="success" @click="onLoginClick">ログイン</v-btn>
                </v-row>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      user: {
        mail: '',
        password: ''
      },
      errors: {},
      isPasswordHidden: true
    }
  },
  computed: {
    passwordInputType () {
      if (this.isPasswordHidden) {
        return 'password'
      } else {
        return 'text'
      }
    },
    passwordInputTypeIconColor () {
      if (this.isPasswordHidden) {
        return ''
      } else {
        return 'primary'
      }
    }
  },
  methods: {
    onLoginClick () {
      this.errors = {}
      this.$router.push('/admin/stores/floor/')
      // this.$auth.loginWith(
      //   'cookie',
      //   { data: this.user }
      // ).then(() => {
      //   // this.$router.push('/images/')
      //   this.$router.push('/')
      // }).catch((err) => {
      //   for (const d of err.response.data.detail) {
      //     this.$set(this.errors, d.field, d.message)
      //   }
      // })
    },
    switchPasswordInputType () {
      this.isPasswordHidden = !this.isPasswordHidden
    }
  }
}
</script>
<style scoped>
</style>
