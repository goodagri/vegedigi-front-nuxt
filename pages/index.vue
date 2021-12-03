<template>
  <v-app>
    <v-card width="400px" class="mx-auto mt-5">
      <v-card-title>
        <CompanyLogo />
      </v-card-title>
      <v-card-text>
      <v-card-actions>
        <v-row justify="space-between">
          <v-btn text color="blue-grey" class="white--text" href="https://tech-goodagri.com/">グッドアグリ・テクノロジーズ</v-btn>
          <v-btn
            nuxt
            outlined
            large
            to="/auth/login"
          >
            ログイン
          </v-btn>
        </v-row>
      </v-card-actions>
      </v-card-text>
    </v-card>
  </v-app>
</template>
