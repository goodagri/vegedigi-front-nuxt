<template>
  <v-app dark>
    <v-container fluid>
      <v-col cols="12">
        <h1 v-if="error.statusCode === 404">
          {{ pageNotFound }}
        </h1>
        <h1 v-else>
          {{ otherError }}
        </h1>
        <div class="mt-5">
        <p class="text--h5">エラーが発生しました</p>
        <p>ログアウトしてやり直してください。</p>
        <v-btn
          color="error"
          @click="logout()"
        >
          ログアウト
        </v-btn>
        </div>
      </v-col>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
      .then(() => {
        this.$router.push('/login')
      }).catch((err) => {
        console.log('error', err)
      })
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
