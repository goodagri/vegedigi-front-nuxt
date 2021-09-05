<template>
  <v-app>
    <BasePage page-title="売り場状況" :breadcrumb-items="breadcrumbItems">
    <template #main>
      <v-container fluid>
        <v-row>
          <v-col>
            <div class="mb-5">
              <p class="text-subtitle-1 font-weight-bold">最新の売り場状況</p>
              <v-img
                max-height="300"
                max-width="500"
                src="/yasai_img.jpg"
              />
            </div>

            <div class="mb-5">
              <p class="text-subtitle-1 font-weight-bold">野菜の量</p>
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        野菜の種類
                      </th>
                      <th class="text-left">
                        残りの数量
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in vegetables"
                      :key="item.name"
                    >
                    <td>{{ item.name }}</td>
                    <td>{{ item.numbers }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>

            <div class="mb-5">
              <p class="text-subtitle-1 font-weight-bold">天気情報</p>
              <v-card max-width="500">
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
                    </v-list-item>
                  </v-list>
              </v-card>
            </div>

          </v-col>
        </v-row>
      </v-container>
    </template>
    </BasePage>
  </v-app>
</template>

<script>
import BasePage from '@/components/BasePage'
export default {
  components: {
    BasePage
  },
  async asyncData({ $axios }) {
    const defaultCity = 'Tokyo'
    const API_KEY = '3f81b4731f11e28db726caf55956e46e'
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity},jp&units=metric&lang=ja&exclude=hourly,daily&appid=${API_KEY}`;
    const URL_THREE_HOUR = `https://api.openweathermap.org/data/2.5/forecast?q=${defaultCity},jp&units=metric&lang=ja&exclude=hourly,daily&appid=${API_KEY}`;

    const AWS_ID = 'VEGEDIGI'
    console.log(AWS_ID)
    const URL_AWS_IMAGE = `https://vda9ujojtg.execute-api.ap-northeast-1.amazonaws.com/store/${AWS_ID}/image?date=20210815`
    await $axios.$get(URL_AWS_IMAGE)
    // .then((res) => {
    //   this.drawImage(res)
    //   console.log("res1:", res)
    // })
    // .catch((error) => {
    //   (error, 'サーバー側で何らかのエラーが発生しました。')
    // })
    const res = await $axios.$get(URL)
    const resThreeHour = await $axios.$get(URL_THREE_HOUR)
    return {
      city: {
        name: res.name,
        date: new Date(res.dt * 1000),
        temp: parseInt(res.main.temp + 0.5),
        tempMax: res.main.temp_max,
        tempMin: res.main.temp_min,
        main: res.weather[0].main,
        icon: res.weather[0].icon
      },
      resThreeHour,
    }
  },
  data () {
    return {
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
      resThreeHour: '',
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
      ]
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
    // console.log("resImage:", this.resImage)
    //  for文でresThreeHourのデータをforecastに入れる
    for(let i=0; i < 15; i++) {
      const splitDate = this.resThreeHour.list[i].dt_txt.split(/:| |-/)
      const weatherIcon = this.getWeatherDiscriptionToJapanese(this.resThreeHour.list[i].weather[0].main)
      const regex = /09|12|15|18/g;
      if(splitDate[3].search(regex) !== -1) {
        this.forecast.push({
          day: `${splitDate[1]}/${splitDate[2]} ${splitDate[3]}:${splitDate[4]}`,
          icon: weatherIcon.icon,
          temp: `${parseInt(this.resThreeHour.list[i].main.temp_max + 0.5)}\xB0/${parseInt(this.resThreeHour.list[i].main.temp_min + 0.5)}\xB0`
        })
      }
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
    drawImage(res) {
      console.log("res:", res)
    }
  }
}
</script>
<style scoped>
</style>