<template>
  <BasePage
    v-if="userType"
    page-title="売り場状況"
    :user-type="userType"
    :breadcrumb-items="breadcrumbItems"
  >
  <template #sideMenu>
    <v-col cols="12">
      <v-sheet rounded="lg">
        <v-row class="d-flex justify-center">
          <v-col cols="12" lg="7" md="7" sm="12" xs="12" >
            <v-select
              label="店舗選択"
              outlined
              return-object
              :items="storesInfo"
              item-text="storeName"
              @input="SelectShop"
            />
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>
  </template>
  <template #main>
    <v-container fluid>
      <v-row class="d-flex justify-center">
        <v-col cols="12" lg="7" md="7" sm="12" xs="12" class="mb-5">
          <h3>店舗名: </h3>
          <p class="text-subtitle-1 font-weight-bold">最新の売り場状況</p>
          <!-- <StoreImage /> -->

                <v-carousel
                  height="auto"
                  width="auto"
                  >
                <v-carousel-item
                  v-for="(item,i) in images"
                  :key="i"
                  :src="item.url"
                  reverse-transition="fade-transition"
                  transition="fade-transition"
                >
                <v-img :src="i.url"/>
                </v-carousel-item>
              </v-carousel>
          <!-- <v-row>
            <v-col
            :key="image"
            :v-for="image in images"
            >
          <v-img
            max-height="500"
            contain
            :src="image.url"
          />
            </v-col>
          </v-row> -->
        </v-col>
        <v-col cols="7" class="mb-5">
          <p class="text-subtitle-1 font-weight-bold">野菜の量</p>
          <v-card>
            <v-card-text>{{ liveText }}</v-card-text>
          </v-card>
        </v-col>
        <v-col  cols="7" class="mb-5">
          <p class="text-subtitle-1 font-weight-bold">天気情報</p>
            <Weather
              :forecasts="forecasts"
              :current-weather="currentWeather"
              :store-name="storeName"
            ></Weather>
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
  async asyncData(context){

    const key = `CognitoIdentityServiceProvider.` + process.env.COGNITO_CLIENT_ID +'.'+ context.$auth.$state.user.cognito.username + '.userData'
    let storeids = []
    let usertype = ''
    if(context.$auth.$state[key] === undefined && context.$auth.$storage.state.attribute !== undefined){
      storeids = context.$auth.$storage.state.attribute.storeids
      usertype = context.$auth.$storage.state.attribute.usertype
    }else if(context.$auth.$state[key] !== undefined){
      const att = (JSON.parse(context.$auth.$state[key])).UserAttributes
      storeids = (att.find(a => a.Name === 'custom:store_ids')).Value.split(",")
      usertype = att.find(a => a.Name === 'custom:user_type').Value
    }else{
      // アトリビュートが取得できなかったときの処理
    }
    if(storeids.length > 0){
    const storenames = ["店舗1","店舗2"]
    const url = "https://hintnedgcfhvrcgxefmogqwctu.appsync-api.ap-northeast-1.amazonaws.com/graphql"
    const stores = []
    for(let i = 0; i < storeids.length; i++ ){
      stores.push({storeName:storenames[i],storeId:storeids[i]})
    }
    const que = `{getStoreOverview(id: "${stores[0].storeId}") {live_msg,current_weather{dt,temp,temp_max,temp_min,weather,icon},weather_forecasts{dt,temp,temp_max,temp_min,weather,icon}},getLatestStoreImgs(id: "${stores[0].storeId}") {sensor_id,url}}`
    const header = {
      "Content-Type": "application/graphql",
      "Authorization": context.$auth.strategy.token.session.idToken.jwtToken
      }

    const resp = await context.$axios.$post(url, {
      query: que
    }, {
      headers: header
    })
    console.log(resp.data.getLatestStoreImgs)
    return{
      storeName:storenames[0],
      userType: usertype,
      storesInfo: stores,
      images: resp.data.getLatestStoreImgs,
      liveText: resp.data.getStoreOverview.live_msg,
      currentWeather: resp.data.getStoreOverview.current_weather,
      forecasts: resp.data.getStoreOverview.weather_forecasts

    }}
  },
  data () {
    return {
      breadcrumbItems: [],
      storeName:'イオン利府1',
    }
  },
  mounted () {
    if(!this.userType){
      this.$nuxt.error({
        statusCode: 500
      })
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
      const res = await this.getGraphQL(value.storeId)
      if (res.getLatestStoreImgs === null || res.getStoreOverview === null){
        this.$nuxt.$loading.finish()
        alert("データが取得できません")
      }else{
        this.images = res.getLatestStoreImgs
        this.liveText = res.getStoreOverview.live_msg
        this.currentWeather = res.getStoreOverview.current_weather
        this.forecasts = res.getStoreOverview.weather_forecasts
        this.$nuxt.$loading.finish()}
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
    async getGraphQL(storeid){
      const url = "https://hintnedgcfhvrcgxefmogqwctu.appsync-api.ap-northeast-1.amazonaws.com/graphql"
      const que = `{getStoreOverview(id: "${storeid}") {live_msg,current_weather{dt,temp,temp_max,temp_min,weather,icon},weather_forecasts{dt,temp,temp_max,temp_min,weather,icon}},getLatestStoreImgs(id: "${storeid}") {sensor_id,url}}`
      const header = {
        "Content-Type": "application/graphql",
        "Authorization": this.$auth.strategy.token.session.idToken.jwtToken
        }

      const resp = await this.$axios.$post(url, {
        query: que
      }, {
        headers: header
      })
      return resp.data
    }
  }
}
</script>