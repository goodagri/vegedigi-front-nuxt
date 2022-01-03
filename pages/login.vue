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
              <v-text-field
                v-model="credentials.username"
                placeholder="メールアドレス"
                outlined
              />
              <v-text-field
                v-model="credentials.password"
                placeholder="パスワード"
                :type="passwordInputType"
                outlined
              >
                <v-icon
                  slot="append"
                  :color="passwordInputTypeIconColor"
                  @click="switchPasswordInputType"
                >
                  mdi-eye-off
                </v-icon>
              </v-text-field>
              <div
                justify="end"
              >
                <v-btn
                  @click.prevent="login()"
                >
                  ログイン
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      isPasswordHidden: true,
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
    switchPasswordInputType () {
      this.isPasswordHidden = !this.isPasswordHidden
    },
    async login() {
      try {
        await this.$auth.loginWith('cognito', {
          data: this.credentials
        })
      } catch (error) {
        console.error('error:', error)
      }
    },
  },
}
</script>