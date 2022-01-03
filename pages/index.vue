<template>
  <v-app>
        <div>
          <h1>{{ $auth.user }}</h1>
          <button @click.prevent="$auth.logout()">Logout</button>
        </div>
  </v-app>
</template>
