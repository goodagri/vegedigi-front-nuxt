<template>
  <v-app>
    <BasePage page-title="会員情報変更画面" :breadcrumb-items="breadcrumbItems">
      <template #main>
        <p>会員ID</p>
        <p>{{appResponse}}</p>
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
      breadcrumbItems: []
    }
  },
  computed: {
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  created () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.users = [
        {
          name: '宇多田 恵麻',
          mail: 'utada_ema@example.com',
          birthday: '1988/3/2',
          carbs: 24,
          protein: 4.0,
        },
        {
          name: '松原 恭子',
          mail: 'matsubara_kyouko@example.com',
          birthday: '1985/3/5',
          carbs: 37,
          protein: 4.3,
        },
        {
          name: '細野 さやか',
          mail: 'hosono_sayaka@example.com',
          birthday: '1997/4/1',
          carbs: 51,
          protein: 4.9,
        },
        {
          name: '川畑 倫子',
          mail: 'kawahata_noriko@example.com',
          birthday: '1984/2/21',
          carbs: 65,
          protein: 7,
        },
      ]
    },
    editItem (item) {
      this.editIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.$router.push('/users/' + item.id)
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.dessets.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      this.users.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem)
      } else {
        this.users.push(this.editedItem)
      }
      this.close()
    },
  }
}
</script>
<style scoped>
</style>
