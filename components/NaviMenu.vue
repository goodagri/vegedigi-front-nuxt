<template>
<div>
  
  <v-navigation-drawer permanent class="light" dark>
    <v-list dense nav>
      <v-list-item
        v-for="(item, index) in menuItems"
        :key="index"
        nuxt
        :to="item.link"
        @click="item.action"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon>{{ item.iconright }}</v-icon>
        </v-list-item-icon>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</div>
</template>

<script>
export default {
  data () {
    const menuItems = []
    //  管理者かつ売り場状況内
    if (this.$route.path.startsWith('/admin/stores/')) {
      menuItems.push({
        title: '売り場状況',
        icon: 'mdi-image',
        iconright: 'mdi-chevron-right',
        link: '/admin/stores/floor/',
        action: () => {}
      })
      menuItems.push({
        title: '過去売り上げグラフ',
        icon: 'mdi-chart-bar',
        iconright: 'mdi-chevron-right',
        link: '/admin/stores/graph/',
        action: () => {}
      })
    }
    if (this.$route.path.startsWith('/admin/users/')) {
      menuItems.push({
        title: '新規会員登録',
        icon: 'mdi-account-plus',
        iconright: 'mdi-chevron-right',
        link: '/admin/users/create/',
        action: () => {}
      })
      menuItems.push({
        title: '会員情報変更',
        icon: 'mdi-account-cog',
        iconright: 'mdi-chevron-right',
        link: '/admin/users/update/',
        action: () => {}
      })
    }
    return {
      menuItems,
    }
  },
  mounted() {
    //  管理者ページ内
    // if (this.$route.path.startsWith('/admin')) {
    //   console.log("ノチホド")
    // }
    // 管理者かつ売り場状況内
    if (this.$route.path.startsWith('/admin/stores/')) {
      // this.naviMenuItems.push({
      //   title: '売り場状況',
      //   icon: 'mdi-image',
      //   iconright: 'mdi-chevron-right',
      //   link: '/admin/stores/',
      //   action: () => {}
      // })
      // this.naviMenuItems.push({
      //   title: '過去売り上げグラフ',
      //   icon: 'mdi-chart-bar',
      //   iconright: 'mdi-chevron-right',
      //   link: '/admin/stores/graph/',
      //   action: () => {}
      // })
      //  管理者かつ画像一覧
      // if (this.$route.path.startsWith('/images') || this.$route.path === '/admin/camera_senses/' || this.$route.path === '/admin/light_sources/') {
      //   this.menuItems.push({
      //     title: 'カメラ感度ファイル管理',
      //     link: '/admin/camera_senses/',
      //     action: () => {}
      //   })
      //   this.menuItems.push({
      //     title: '光源ファイル管理',
      //     link: '/admin/light_sources/',
      //     action: () => {}
      //   })
      // }
    }
  },
  methods: {
    // handleClick(title) {
    //   if(title==='過去売り上げグラフ') {
    //     this.$router.push('/admin/stores/graph/')
    //   } else if (title==='売り場状況') {
    //     this.$router.push('/admin/stores/')
    //   }
    //   console.log('aaa', title)
    // }
  }
}
</script>

<style>
</style>