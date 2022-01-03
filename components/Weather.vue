<template>
  <v-card>
    <!-- 取得都市,現在時刻,現在の天気 -->
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          {{ city.name }}
        </v-list-item-title>
        <v-list-item-subtitle
          >{{ currentDate }}, {{ currentWeather.word }}</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>

    <!-- 現在の温度と天気アイコン -->
    <v-card-text>
      <v-row align="center">
        <v-col class="text-h2" cols="6"> {{ city.temp }}&#8451; </v-col>

        <v-col cols="3">
          <h4 class="red--text">最高気温{{ city.tempMax }}&#8451;</h4>
          <h4 class="blue--text">最低気温{{ city.tempMin }}&#8451;</h4>
        </v-col>

        <v-col cols="3">
          <v-icon large>{{ currentWeather.icon }}</v-icon>
        </v-col>
      </v-row>
    </v-card-text>

    <v-list class="transparent">
      <v-list-item v-for="forecast in forecasts" :key="forecast.day">
        <v-list-item-title>{{ forecast.day }}</v-list-item-title>

        <v-list-item-icon>
          <v-icon>{{ forecast.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-subtitle class="text-right">
          {{ forecast.temp }}
        </v-list-item-subtitle>
        <v-divider></v-divider>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    city: {
      type:Object,
      default: null,
    },
    weather: {
      type:Object,
      default: null,
    },
    forecasts:{
      type:Array,
      default:null,
    }
  },
  }
</script>

<style></style>
