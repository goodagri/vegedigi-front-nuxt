<template>
  <BasePage
    page-title="売り場状況"
    :user-type="userType"
    :breadcrumb-items="breadcrumbItems"
  >
  <template #sideMenu>
    <v-col cols="12">
      <v-sheet rounded="lg">
        <v-row class="align-baseline">
          <v-col>
            売り場状況
          </v-col>
          <v-col>
            <v-select
              label="店舗選択"
              outlined
              return-object
            />
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>
  </template>
  <template #main>
    <v-container fluid>
      <v-row>
        <v-col cols="12" class="mb-5">
          <h3>店舗名: </h3>
          <p class="text-subtitle-1 font-weight-bold">最新の売り場状況</p>
          <!-- <StoreImage /> -->
          <v-img
            max-height="500"
            contain
            :src="item.src"
          />
        </v-col>
        <v-col cols="12" class="mb-5">
          <p class="text-subtitle-1 font-weight-bold">野菜の量</p>
          <!-- <VegetableAmount /> -->
          <v-card>
            <v-card-text>{{ dummyText }}</v-card-text>
          </v-card>
        </v-col>
        <v-col  cols="12" class="mb-5">
          <p class="text-subtitle-1 font-weight-bold">天気情報</p>
          <!-- <Weather /> -->
        </v-col>
      </v-row>
    </v-container>
  </template>
  </BasePage>
</template>

<script>
// import { AuthenticationDetails, CognitoUserPool, CognitoUser  } from 'amazon-cognito-identity-js'
// import AWS from 'aws-sdk'
import BasePage from '@/components/BasePage'
// import VegetableAmount from '@/components/VegetableAmount'
// import StoreImage from '@/components/StoreImage'
// import Weather from '@/components/Weather'
export default {
  components: {
    BasePage,
    // VegetableAmount,
    // StoreImage,
    // Weather
  },
  data () {
    return {
      breadcrumbItems: [],
      storeName:'イオン利府1',
      Shops: [
        {
          shopName:'イオン利府1',
          shopId:'aeon_rifu_1',
          coord:{lon:'139.768889',lat:'35.676111'}
        },
        {
          shopName:'イオン利府2',
          shopId:'aeon_rifu_2',
          coord:{lon:'135.780833',lat:'35.026111'}
        }],
      S3_IMAGE:{},
      dummyText: '_/_/_/_/_/_/_/_/ 10:00 野菜状況 _/_/_/_/_/_/_/_/\n\n売り場状況報告です。 東京駅 09月05日\n売場にたくさん並んでいるものは、シイタケ トマト です。\n全体的に動きは鈍いです。\n引き続きご出荷お待ちしております。\n下記のURLから売場の状況写真はこちらから見ることができます。',
      item: {},
      userType: 'store_manager',
    }
  },
  methods: {
    // 現在日時取得
    getCurrentDate(date) {
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
    async SelectShop(value){
      await this.$nuxt.$loading.start()
      .then(() =>{
        this.$nuxt.$loading.finish()
        })
      },
    async getS3Data(shopId){
      const URL_AWS_IMAGE = `https://r67xjz1uyc.execute-api.ap-northeast-1.amazonaws.com/store/${shopId}/image`
      try{
        this.S3_IMAGE = await this.$axios.$get(URL_AWS_IMAGE)
      }catch(e){
        try{
        this.S3_IMAGE = await this.$axios.$get(URL_AWS_IMAGE+'?date=yesterday')
        }catch(e){
          this.S3_IMAGE = {url:"/no-image.png"}
        }
      }
      this.item = {
        src: this.S3_IMAGE.url
      }
    },
    async todaysRes(coord){
      const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&units=metric&lang=ja&exclude=hourly,daily&appid=${process.env.API_KEY}`
      const todaysRes = await this.$axios.$get(URL)
      this.city = {
          name: todaysRes.name,
          date: new Date(todaysRes.dt * 1000),
          temp: parseInt(todaysRes.main.temp + 0.5),
          tempMax: todaysRes.main.temp_max,
          tempMin: todaysRes.main.temp_min,
          main: todaysRes.weather[0].main,
          icon: todaysRes.weather[0].icon,
          coord: todaysRes.coord
        }
    },
    async get3h(coord){
      const URL_THREE_HOUR = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metric&lang=ja&exclude=hourly,daily&appid=${process.env.API_KEY}`
      this.threeHoursRes = await this.$axios.$get(URL_THREE_HOUR)
    },
    getThreeHourRes(){
      this.forecasts = []
      for(let i=0; i < 15; i++) {
        const splitDate = this.threeHoursRes.list[i].dt_txt.split(/:| |-/)
        const weatherIcon = this.getWeatherDescriptionToJapanese(this.threeHoursRes.list[i].weather[0].main)
        const regex = /09|12|15|18/g;
        if(splitDate[3].search(regex) !== -1) {
          this.forecasts.push({
            day: `${splitDate[1]}/${splitDate[2]} ${splitDate[3]}:${splitDate[4]}`,
            icon: weatherIcon.icon,
            temp: `${parseInt(this.threeHoursRes.list[i].main.temp)}\u2103`
          })
        }
      }      
    },
    // 天気情報を日本語に変更
    getWeatherDescriptionToJapanese (disc) {
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
  }
}
</script>