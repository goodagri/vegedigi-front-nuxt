<template>
  <div class="app_top">
    <v-app-bar
      color="light"
      fixed
      app
    >
      <v-app-bar-title class="text-no-wrap">
        {{ pageTitle }}
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <slot name="headerActions"></slot>
      <v-menu>
        <template #activator="{ on }" >
          <v-btn icon v-on="on">
            <v-icon>mdi-apps</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            nuxt
            :to="item.link"
            @click="item.action"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-breadcrumbs :items="breadcrumbItems">
        <template #item="props">
          <v-breadcrumbs-item
            exact
            :disabled="props.item.disabled"
            :to="props.item.href"
            nuxt
          >
            {{ props.item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-row>
        <v-col class="col-xs-12 col-sm-12 col-md-4">
          <p class="bg-black">aaaa</p>
          <NaviMenu class="navimenu-area"></NaviMenu>
        </v-col>
          <v-col class="col-xs-12 col-sm-12 col-md-8">
          <slot name="main">
          </slot>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
export default {
  props: {
    pageTitle: {
      type:String,
      default: null,
    },
    breadcrumbItems: {
      type:Array,
      default: null,
    },
  },
  data () {
    return {
      menuItems: [],
      isShow: true,
    }
  },
  created() {
    //  一般ユーザー
    this.menuItems.push({
      title: '売り場状況',
      link: '/admin/stores/floor/',
      action: () => {}
    })
    this.menuItems.push({
      title: '新規会員登録',
      link: '/admin/users/create/',
      action: () => {}
    })
    //  管理者
    // if (this.$auth.user.is_superuser) {
    //   this.menuItems.push({
    //     title: '新規会員登録',
    //     link: '/admin/users/',
    //     action: () => {}
    //   })
    // }
    this.menuItems.push({
      title: '会員情報変更',
      link: '/admin/users/update/',
      action: () => {}
    })
    this.menuItems.push({
      title: 'ログアウト',
      action: this.logout
    })
  },
  methods: {
    logout() {
      this.$router.push('/auth/login')
    },
    // logout () {
    //   this.$auth.logout().then(() => {
    //     this.$router.push('/auth/login/')
    //   }).catch((err) => {
    //     console.log(err)
    //   })
    // }
  }
}
</script>
<style scoped>

</style>
