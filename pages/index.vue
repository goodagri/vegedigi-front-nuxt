<template>
  <v-app>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <div class="logo py-4 d-flex justify-center">
          <CompanyLogo />
        </div>
        <v-card>
          <v-card-title class="headline">
            ベジデジアプリ
          </v-card-title>
          <v-card-text>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore deserunt saepe magni minima veritatis quae repudiandae. Nobis animi quibusdam excepturi, perspiciatis est in nulla, accusamus ex culpa architecto non nam?</p>
            <a
              href="https://tech-goodagri.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              &mdash; Good Agri Technologies
            </a>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              nuxt
              to="/auth/login"
            >
              ログイン画面へ進む
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>
