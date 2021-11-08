<template>
  <BasePage page-title="会員一覧" :breadcrumb-items="breadcrumbItems">
    <template #headerActions>
      <v-btn
        rounded
        dark
        to="/admin/users/create"
        nuxt
      >
        <v-icon left>
          mdi-plus
        </v-icon>
        新規会員登録
      </v-btn>
    </template>
    <template #main>
      <v-container fluid>
        <!-- 削除時のダイアログ -->
        <v-dialog
          v-model="dialogDelete"
          max-width="600px"
        >
          <v-card>
            <v-card-title class="headline">下記のアカウントを削除してよろしいですか？</v-card-title>
            <v-card-subtitle v-if="editedItem" class="mt-3 text-h5 text-center">{{editedItem.username}}</v-card-subtitle>
            <div class="text-center">
              <v-btn class="ma-2" color="error" @click="deleteItemConfirm">削除</v-btn>
              <v-btn class="ma-2" @click="closeDelete">キャンセル</v-btn>
            </div>
          </v-card>
        </v-dialog>
      <!-- 会員一覧テーブル -->
      <v-data-table
        :headers="headers"
        :items="users"
        class="elevation-1"
      >
        <template #[`item.actions`]="{ item }">
          <v-icon @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template #no-data>
          会員が存在しません
        </template>
      </v-data-table>
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
  asyncData () {
    const headers = [
      { text: '会員ID', value: 'id' },
      { text: '名前', value: 'username' },
      { text: 'メールアドレス', value: 'mail' },
      { text: '生年月日', value: 'birthday' },
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
      dialogDelete: false,
      headers: [],
      users: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        username: '',
        mail: 0,
        birthday: 0,
        address: 0,
        product: 0,
      },
      defaultItem: {
        id: 0,
        username: '',
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
  watch: {
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
          username: '宇多田 恵麻',
          mail: 'utada_ema@example.com',
          birthday: '1988/3/2',
          address: '宮城県気仙沼市大林2-4-10',
          product: 'トマト',
        },
        {
          id: 2,
          username: '松原 恭子',
          mail: 'matsubara_kyouko@example.com',
          birthday: '1985/3/5',
          address: '宮城県黒川郡大衡村奥田4-20-5',
          product: 'なす',
        },
        {
          id: 3,
          username: '細野 さやか',
          mail: 'hosono_sayaka@example.com',
          birthday: '1990/4/1',
          address: '宮城県栗原市築館唐竹林4-14-13',
          product: 'きゅうり',
        },
        {
          id: 4,
          username: '川畑 倫子',
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
      this.$router.push({ 
        path: '/admin/users/update', 
        query: {
          id: this.editedItem.id,
          username:  this.editedItem.username,
          mail:  this.editedItem.mail,
          address:  this.editedItem.address
        }
      })
    },
    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      this.users.splice(this.editedIndex, 1)
      this.closeDelete()
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