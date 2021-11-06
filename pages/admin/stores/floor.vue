<template>
  
    <BasePage page-title="売り場状況" :breadcrumb-items="breadcrumbItems">

    <template #navi>
      <v-navigation-drawer v-model="drawer" clipped app>
        <NaviMenu class="navimenu-area"></NaviMenu>
      </v-navigation-drawer>
    </template>

    <template #naviIcon>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </template>

    <template #main>
      <v-container fluid>
        <v-row>
          <v-col>
            <div class="mb-5">
              <p class="text-subtitle-1 font-weight-bold">最新の売り場状況</p>
              <v-carousel>
                <v-carousel-item
                  v-for="(item,i) in items"
                  :key="i"
                  :src="item.src"
                  reverse-transition="fade-transition"
                  transition="fade-transition"
                ></v-carousel-item>
              </v-carousel>
            </div>

            <div class="mb-5">
              <p class="text-subtitle-1 font-weight-bold">野菜の量</p>
              <v-card>
                <v-card-text>{{ storeStatus.latestTime }}</v-card-text>
                <v-card-text>{{ storeStatus.manyVegetable }}</v-card-text>
                <v-card-text>{{ storeStatus.wellVegetable }}</v-card-text>
              </v-card>
            </div>

            <div class="mb-5">
              <p class="text-subtitle-1 font-weight-bold">天気情報</p>
              <v-card>
                <!-- 取得都市,現在時刻,現在の天気 -->
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title class="text-h5">
                      {{ city.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ currentDate }}, {{ currentWeather.word }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <!-- 現在の温度と天気アイコン -->
                <v-card-text>
                    <v-row align="center">
                      <v-col
                        class="text-h2"
                        cols="8"
                      >
                        {{ city.temp }}&deg;C
                      </v-col>
                      <v-col cols="4">
                        <v-icon large>{{ currentWeather.icon }}</v-icon>
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-list class="transparent">
                    <v-list-item
                      v-for="item in forecast"
                      :key="item.day"
                    >
                      <v-list-item-title>{{ item.day }}</v-list-item-title>
              
                      <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                      </v-list-item-icon>
              
                      <v-list-item-subtitle class="text-right">
                        {{ item.temp }}
                      </v-list-item-subtitle>
                      <v-divider></v-divider>
                    </v-list-item>
                  </v-list>
              </v-card>
            </div>

          </v-col>
        </v-row>
      </v-container>
    </template>
    </BasePage>
</template>

<script>
import BasePage from '@/components/BasePage'
import NaviMenu from '@/components/NaviMenu'
export default {
  components: {
    BasePage,
    NaviMenu
  },
  async asyncData({ $axios }) {
    // 前ページでとってきたAPIをsessionStrageかlocalStrageに保存
    const defaultCity = 'Tokyo'
    // const AWS_ID = 'VEGEDIGI'


    // URL、環境変数に移動する
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity},jp&units=metric&lang=ja&exclude=hourly,daily&appid=${process.env.API_KEY}`;
    const URL_THREE_HOUR = `https://api.openweathermap.org/data/2.5/forecast?q=${defaultCity},jp&units=metric&lang=ja&exclude=hourly,daily&appid=${process.env.API_KEY}`;
    // const URL_AWS_IMAGE = `https://vda9ujojtg.execute-api.ap-northeast-1.amazonaws.com/store/${AWS_ID}/image?date=20210815`
    const URL_AWS_IMAGE = 'https://r67xjz1uyc.execute-api.ap-northeast-1.amazonaws.com/store/aeon_rifu_1/image'

    // promise.allにする予定
    const todaysRes = await $axios.$get(URL)
    const threehoursRes = await $axios.$get(URL_THREE_HOUR)
    const S3_IMAGE = await $axios.$get(URL_AWS_IMAGE)
    return {
      city: {
        name: todaysRes.name,
        date: new Date(todaysRes.dt * 1000),
        temp: parseInt(todaysRes.main.temp + 0.5),
        tempMax: todaysRes.main.temp_max,
        tempMin: todaysRes.main.temp_min,
        main: todaysRes.weather[0].main,
        icon: todaysRes.weather[0].icon
      },
      threehoursRes,
      items: [{
        src: S3_IMAGE.url
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
      }],
      S3_IMAGE,
    }
  },
  data () {
    return {
      drawer:null,
      breadcrumbItems: [],
      city: {
        name: '',
        date: '',
        time: '',
        temp: '',
        tempMin: '',
        tempMax: '',
        main: ''
      },
      current: {
        timezone: '',
        month: '',
        day: '',
        hours: '',
        minutes: '',
        time: '',
        timeText: '',
      },
      dummyText: '',
      storeStatus: {
        latestTime: '',
        stationName: '',
        manyVegetable: '',
        wellVegetable: ''
      },
      threehoursRes: '',
      forecast: [],
      vegetables: [
        {
          name: 'にんじん',
          numbers: 5,
        },
        {
          name: 'キャベツ',
          numbers: 0,
        },
        {
          name: 'なす',
          numbers: 3,
        },
        {
          name: 'トマト',
          numbers: 2,
        },
      ],
      items: [],
    }
  },
  computed: {
    currentWeather() {
      return this.getWeatherDiscriptionToJapanese(this.city.main)
    },
    currentDate() {
      return this.getCurrentDate(this.city.date)
    },
  },
  created() {
    //  for文でthreehoursResのデータをforecastに入れる
    for(let i=0; i < 15; i++) {
      const splitDate = this.threehoursRes.list[i].dt_txt.split(/:| |-/)
      const weatherIcon = this.getWeatherDiscriptionToJapanese(this.threehoursRes.list[i].weather[0].main)
      const regex = /09|12|15|18/g;
      if(splitDate[3].search(regex) !== -1) {
        this.forecast.push({
          day: `${splitDate[1]}/${splitDate[2]} ${splitDate[3]}:${splitDate[4]}`,
          icon: weatherIcon.icon,
          temp: `${parseInt(this.threehoursRes.list[i].main.temp_max + 0.5)}\xB0/${parseInt(this.threehoursRes.list[i].main.temp_min + 0.5)}\xB0`
        })
      }
    }
  },
  mounted() {
    this.dummyText = `_/_/_/_/_/_/_/_/ 10:00 野菜状況 _/_/_/_/_/_/_/_/\n\n売り場状況報告です。 東京駅 09月05日\n売場にたくさん並んでいるものは、シイタケ トマト です。\n全体的に動きは鈍いです。\n引き続きご出荷お待ちしております。\n下記のURLから売場の状況写真はこちらから見ることができます。`
    if (this.dummyText) {
      const dummyTextReplace = this.dummyText.replace('/\n| /g', '')
      const dummyTextArray = dummyTextReplace.split('\n')
      this.storeStatus = {
        latestTime: dummyTextArray[2],
        stationName: dummyTextArray[2],
        manyVegetable: dummyTextArray[3],
        wellVegetable: dummyTextArray[4]
      };

    };
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
    // 天気情報分岐
    getWeatherDiscriptionToJapanese (disc) {
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
<style scoped>
</style>