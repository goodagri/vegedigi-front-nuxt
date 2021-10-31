<template>
  <v-app>
    <BasePage page-title="会員一覧" :breadcrumb-items="breadcrumbItems">
      <template #main>
      <v-btn
        dark
        class="mb-2"
        to="/admin/users/create"
        nuxt
      >
        <v-icon left>
          mdi-plus
        </v-icon>
        新規会員登録
      </v-btn>
        <v-data-table
          :headers="headers"
          :items="users"
          class="elevation-1"
        >
          <template #[`item.actions`]="{ item }">
            <v-icon
              small
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template #no-data>
            会員が存在しません
          </template>
        </v-data-table>
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
  asyncData () {
    const headers = [
      {
        text: '会員ID',
        value: 'id'
      },
      {
        text: '名前',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'メールアドレス', value: 'mail' },
      { text: '電話番号', value: 'birthday' },
      { text: '住所', value: 'address' },
      { text: '主な生産品目', value: 'product' },
      { text: '操作', value: 'actions', sortable: false },
    ]
    return {
      headers
    }
  },
  data () {
    return {
      dialog: false,
      dialogDelete: false,
      headers: [],
      users: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        mail: 0,
        birthday: 0,
        address: 0,
        product: 0,
      },
      defaultItem: {
        id: 0,
        name: '',
        mail: 0,
        birthday: 0,
        address: 0,
        product: 0,
      },
      breadcrumbItems: [
        {
          text: '会員一覧',
          disabled: true,
          href: '/admin/users'
        }
      ],
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新規会員登録' : '会員情報変更'
    }
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
          id: 1,
          name: '宇多田 恵麻',
          mail: 'utada_ema@example.com',
          birthday: '1988/3/2',
          address: '宮城県気仙沼市大林2-4-10',
          product: 'トマト',
        },
        {
          id: 2,
          name: '松原 恭子',
          mail: 'matsubara_kyouko@example.com',
          birthday: '1985/3/5',
          address: '宮城県黒川郡大衡村奥田4-20-5',
          product: 'なす',
        },
        {
          id: 3,
          name: '細野 さやか',
          mail: 'hosono_sayaka@example.com',
          birthday: '1990/4/1',
          address: '宮城県栗原市築館唐竹林4-14-13',
          product: 'きゅうり',
        },
        {
          id: 4,
          name: '川畑 倫子',
          mail: 'kawahata_noriko@example.com',
          birthday: '1984/2/21',
          address: '宮城県岩沼市空港南2-13-7 空港南タウン409',
          product: 'ジャガイモ',
        },
      ]
    },
    editItem (item) {
      this.editIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.$router.push('/admin/users/' + item.id)
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
.v-data-table {
  white-space : nowrap;
}
</style>
