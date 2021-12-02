<template>

    <BasePage page-title="売り場状況" :breadcrumb-items="breadcrumbItems">
    <template #sideMenu>
    <v-col cols="12" sm="12" md="2" lg="2" xl="2" xs="12">
      <v-sheet
        rounded="lg"
      >
        <v-list color="transparent">
          <v-list-item>
            <v-list-item-content>
              売り場状況
              <v-list-item-title>                
              <v-select
                :items="Shops"
                item-text="shopName"
                label="店舗選択"
                solo
                return-object
                @input="SelectShop"
              ></v-select>

              <!-- 売上グラフ
              <v-select
                :items="Shops"
                label="店舗選択"
                solo
              ></v-select> -->
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-sheet>
    </v-col>
    </template>

    <template #main>
      <v-container fluid>
        <v-row>
          <v-col>
            <div class="mb-5">
              <h2>{{tenpo}}</h2>
              <p class="text-subtitle-1 font-weight-bold">最新の売り場状況</p>
              <v-img
                max-height="500"
                contain
                :src="item.src"
              ></v-img>              
              <!-- <v-carousel>
                <v-carousel-item
                  v-for="(item,i) in items"
                  :key="i"
                  :src="item.src"
                  reverse-transition="fade-transition"
                  transition="fade-transition"
                ></v-carousel-item>
              </v-carousel> -->
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
                      v-for="forecast in forecasts"
                      :key="forecast.day"
                    >
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
            </div>

          </v-col>
        </v-row>
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
  async asyncData({ $axios }) {
    
    // 前ページでとってきたAPIをsessionStrageかlocalStrageに保存
    // const defaultCity = 'Tokyo'
    const defaultStore = 'aeon_rifu_1'
    const coord = {lon:'139.768889',lat:'35.676111'}

    // URL、環境変数に移動する
    // const URL = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity},jp&units=metric&lang=ja&exclude=hourly,daily&appid=${process.env.API_KEY}`;
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&units=metric&lang=ja&exclude=hourly,daily&appid=${process.env.API_KEY}`;
    const URL_THREE_HOUR = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metric&lang=ja&exclude=hourly,daily&appid=${process.env.API_KEY}`;
    const URL_AWS_IMAGE = `https://r67xjz1uyc.execute-api.ap-northeast-1.amazonaws.com/store/${defaultStore}/image`

    // promise.allにする予定
    const todaysRes = await $axios.$get(URL)
    const threehoursRes = await $axios.$get(URL_THREE_HOUR)
    let S3_IMAGE = {}
    try{
      S3_IMAGE = await $axios.$get(URL_AWS_IMAGE)
    }catch(e){
      try{
        S3_IMAGE = await $axios.$get(URL_AWS_IMAGE+'?date=yesterday')
        }catch(e){
          S3_IMAGE = {url:"/no-image.png"}
        }
    }
    return {
      city: {
        name: todaysRes.name,
        date: new Date(todaysRes.dt * 1000),
        temp: parseInt(todaysRes.main.temp + 0.5),
        tempMax: todaysRes.main.temp_max,
        tempMin: todaysRes.main.temp_min,
        main: todaysRes.weather[0].main,
        icon: todaysRes.weather[0].icon,
        coord: todaysRes.coord
      },
      threehoursRes,
      item: {
        src: S3_IMAGE.url
      },
      S3_IMAGE,
    }
  },
  data () {
    return {
      tenpo:'イオン利府1',
      // Shops: ['Foo', 'Bar', 'Fizz', 'Buzz'],
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
      coord:{},
      breadcrumbItems: [],
      S3_IMAGE:{},
      city: {
        name: '',
        date: '',
        time: '',
        temp: '',
        tempMin: '',
        tempMax: '',
        main: '',
        coord:{}
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
      forecasts: [],
      vegetables: [
        {
          name: '人参',
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
      item: {},
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
    this.getThreeHourRes()
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
    getThreeHourRes(){
      this.forecasts = []
      for(let i=0; i < 15; i++) {
        const splitDate = this.threehoursRes.list[i].dt_txt.split(/:| |-/)
        const weatherIcon = this.getWeatherDiscriptionToJapanese(this.threehoursRes.list[i].weather[0].main)
        const regex = /09|12|15|18/g;
        if(splitDate[3].search(regex) !== -1) {
          this.forecasts.push({
            day: `${splitDate[1]}/${splitDate[2]} ${splitDate[3]}:${splitDate[4]}`,
            icon: weatherIcon.icon,
            temp: `${parseInt(this.threehoursRes.list[i].main.temp_max + 0.5)}\xB0/${parseInt(this.threehoursRes.list[i].main.temp_min + 0.5)}\xB0`
          })
        }
      }      
    },
    async SelectShop(value){
      await this.$nuxt.$loading.start()
      this.tenpo = value.shopName
      Promise.all([this.todaysRes(value.coord),this.get3h(value.coord),this.getS3Data(value.shopId)]).then(values=>{
        this.getThreeHourRes()
        this.$nuxt.$loading.finish()
        })

      // await this.todaysRes(value.city)
      // await this.get3h(value.city)
      // await this.getS3Data(value.shopId)
      // this.getThreeHourRes()
      // this.$nuxt.$loading.finish()
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
      console.log(todaysRes)
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
      this.threehoursRes = await this.$axios.$get(URL_THREE_HOUR)
    }
  }
}
</script>
<style scoped>
</style>