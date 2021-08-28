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
              <p class="text-subtitle-1 font-weight-bold">天気情報</p>
              <v-card>
                <v-card-title>{{ city.name }}</v-card-title>
                <v-card-subtitle>{{ currentDate }}</v-card-subtitle>
                <v-card-text>
                  <ul>
                    <li>天気：{{ currentWeather.word }}<span><v-icon>{{ currentWeather.icon }}</v-icon></span></li>
                    <li>温度：{{ city.temp }}℃</li>
                    <li>最高気温：{{ city.tempMax }}℃</li>
                    <li>最低気温：{{ city.tempMin }}℃</li>
                  </ul>
                </v-card-text>
              </v-card>
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
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity},jp&units=metric&lang=ja&exclude=hourly,daily&appid=${API_KEY}`;
    const res = await $axios.$get(url)
    return {
      city: {
        name: res.name,
        date: new Date(res.dt * 1000),
        temp: res.main.temp,
        tempMax: res.main.temp_max,
        tempMin: res.main.temp_min,
        main: res.weather[0].main,
        icon: res.weather[0].icon
      },
      everyDay: {

      }
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
    // tomorrowDate() {
    //   return this.getWeatherEveryDay( ,0)
    // }
  },
  created() {
  },
  methods: {
    // 日付＋時間取得
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
    // 1日ごとに天気情報を取得
    getWeatherEveryDay(data, i) {
      // const week = ['日', '月', '火', '水', '木', '金', '土']
      const dt = data.list[i].dt_txt
      const date = new Date(dt.replace((/-/g, '/')))
      date.setHours(date.getHours() + 9)
      // const month = date.getMonth() + 1
      // const day = month + '/' + date.getDate()
      // const currentWeek = week[date.getDay()]
      // const time = date.getHours() + '：00'
      // const main = (data.list[i].weather[0].main).toLowerCase();
      // console.log(day, currentWeek, time, main)
    },
    // 天気情報分岐
    getWeatherDiscriptionToJapanese (disc) {
      switch (disc) {
        case 'Clear':
            return '快晴';
        case 'Clouds':
            return {word: '曇り', icon: 'mdi-cloud'};
        case 'Rain' || 'Drizzle':
            return {word: '雨', icon: 'mdi-umbrella'};;
        case 'Thunderstorm':
            return '雷雨';
        case 'Snow':
            return '雪';
        case 'Mist' || 'Smoke' || 'Haze' || 'Dust' || 'Fog' || 'Sand' || 'Ash' || 'Squall':
          return '靄';
        case 'Tornado':
          return '強風';
        default:
            return disc;
      }
    }
  }
}
</script>
<style scoped>
</style>