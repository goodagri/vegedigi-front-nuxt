import colors from 'vuetify/es5/util/colors'
import { defineNuxtConfig } from '@nuxt/bridge'
import dotenv from 'dotenv'
dotenv.config();
// const { API_KEY } = process.env;
const { API_KEY,COGNITO_CLIENT_ID } = process.env;

export default defineNuxtConfig({
  loading: './components/Loading.vue',
  bridge: false,
  // ssr: false,
  target: 'static',
  privateRuntimeConfig: {
  //   apiKey: API_KEY
  // },
  // publicRuntimeConfig: {
  //   apiKey: process.env.NODE_ENV !== 'production' ? API_KEY : undefined
  // },
  // Global page headers: https://go.nuxtjs.dev/config-head
  },
  head: {
    titleTemplate: '%s - digivede web app',
    title: 'デジベジ',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],
  router: {
    middleware: ['auth'],
  },
  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: false,
      home: '/',
    },
    watchLoggedIn: true,
    strategies: {
      cognito: {
        scheme: '@a1ter/nuxt-auth-aws-cognito-scheme/scheme/scheme',
        credentials: {
          userPoolId: process.env.COGNITO_USER_POOL_ID,
          userPoolWebClientId: process.env.COGNITO_CLIENT_ID,
          region: process.env.COGNITO_REGION
        },
        endpoints: {
          user: false,
        }
      }
    }
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BASE_API_URL
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['@nuxtjs/auth-next']
  },
  // env: {
  //   API_KEY,
  //   COGNITO_USER_POOL_ID,
  //   COGNITO_CLIENT_ID,
  //   COGNITO_ID_POOL_ID,
  //   COGNITO_REGION
  // },
  env: {
    API_KEY,
    COGNITO_CLIENT_ID
  }
})