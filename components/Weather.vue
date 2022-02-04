<template>
  <v-card>
    <!-- 取得都市,現在時刻,現在の天気 -->
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          {{ storeName }}周辺の天気
        </v-list-item-title>
        <v-list-item-subtitle
          >{{ newCurrentWeather.weather }}</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>

    <!-- 現在の温度と天気アイコン -->
    <v-card-text>
      <v-row align="center">
        <v-col class="text-h2" cols="6"> {{ newCurrentWeather.temp }}&#8451; </v-col>

        <v-col cols="3">
          <h4 class="red--text">最高気温{{ newCurrentWeather.tempMax }}&#8451;</h4>
          <h4 class="blue--text">最低気温{{ newCurrentWeather.tempMin }}&#8451;</h4>
        </v-col>

        <v-col cols="3">
          <v-icon large>{{ newCurrentWeather.icon }}</v-icon>
        </v-col>
      </v-row>
    </v-card-text>

    <v-list class="transparent">
      <v-list-item v-for="forecast in newForecasts" :key="forecast.day">
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
    currentWeather: {
      type:Object,
      default: null,
    },
    forecasts:{
      type:Array,
      default:null,
    },
    storeName:{
      type:String,
      default:null
    }
  },
  data(){
    return{
      newForecasts:[],
      newCurrentWeather:{}
    }
  },
  mounted(){
    for(const forecast of this.forecasts) {
      const d = new Date(forecast.dt * 1000)
      if (d.getHours() >= 9 && d.getHours() <= 18){
      const Day = this.getDateTime(forecast.dt)
      const weatherIcon = this.getWeatherDescriptionToJapanese(forecast.weather)
      this.newForecasts.push({
          day: Day,
          icon: weatherIcon.icon,
          temp: `${parseInt(forecast.temp)}\u2103`
        })
      }}

    const day2 = this.getCurrentDate(this.currentWeather.dt)
    const weatherIcon2 = this.getWeatherDescriptionToJapanese(this.currentWeather.weather)
    this.newCurrentWeather = {
          day: day2,
          icon: weatherIcon2.icon,
          temp: `${parseInt(this.currentWeather.temp)}`,
          tempMax: `${parseInt(this.currentWeather.temp_max)}`,
          tempMin: `${parseInt(this.currentWeather.temp_min)}`
    }
  },

  methods:{
    getWeatherDescriptionToJapanese(disc){
      switch (disc) {
        case 'Clear':
            return {word: '快晴', icon: 'mdi-white-balance-sunny'};
        case 'Clouds':
            return {word: '曇り', icon: 'mdi-cloud'};
        case 'Rain' || 'Drizzle':
            return {word: '雨', icon: 'mdi-umbrella'};
        case 'Thunderstorm':
            return {word: '雷雨', icon: 'mdi-weather-lightning'};
        case 'Snow':
            return {word: '雪', icon: 'mdi-snowflake'};
        case 'Mist' || 'Smoke' || 'Haze' || 'Dust' || 'Fog' || 'Sand' || 'Ash' || 'Squall':
          return {word: '靄', icon: 'mdi-weather-fog'};
        case 'Tornado':
          return {word: '強風', icon: 'mdi-weather-tornado'};
        default:
            return disc;
      }
    },
    getCurrentDate(dt) {
      const date = new Date(dt * 1000)
      this.current = {
        timezone: date,
        month: date.getMonth() + 1,
        day: date.getDate(),
        hours: date.getHours(),
        minutes: ('0' + date.getMinutes()).slice(-2),
      }
      this.current.date = this.current.month + '月' + this.current.day + '日'
      this.current.time = this.current.hours + '時' + this.current.minutes + '分'
      this.current.timeText = this.current.date + '' + this.current.time + '現在'
      return this.current.timeText
    },
    getDateTime(dt) {
      const date = new Date(dt * 1000)
      const current = {
        timezone: date,
        month: date.getMonth() + 1,
        day: date.getDate(),
        hours: date.getHours(),
        minutes: ('0' + date.getMinutes()).slice(-2),
      }
      return `${current.month}/${current.day} ${current.hours}:${current.minutes}`

    }
}
  }
</script>

<style></style>
