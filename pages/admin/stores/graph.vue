<template>
  <v-app>
    <BasePage page-title="過去売り上げグラフ" :breadcrumb-items="breadcrumbItems">
    <template #main>
      <v-container fluid>
        <v-row>
          <v-col>
            <div class="mb-5">
              <p class="text-subtitle-1 font-weight-bold">グラフ表示エリア</p>
              <v-card
                class="mx-auto text-center"
                color="blue"
                dark
                max-width="600"
              >
                <v-card-text>
                  <v-sheet color="rgba(0, 0, 0, .12)">
                    <v-sparkline
                      :value="value"
                      color="rgba(255, 255, 255, .7)"
                      height="100"
                      padding="24"
                      stroke-linecap="round"
                      smooth
                    >
                      <template #label="item">
                        ${{ item.value }}
                      </template>
                    </v-sparkline>
                  </v-sheet>
                </v-card-text>
            
                <v-card-text>
                  <div class="text-h4 font-weight-thin">
                    Sales Last 24h
                  </div>
                </v-card-text>
            
                <v-divider></v-divider>
            
                <v-card-actions class="justify-center">
                  <v-btn
                    block
                    text
                  >
                    Go to Report
                  </v-btn>
                </v-card-actions>
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
  data () {
    return {
      breadcrumbItems: [],
      value: [
      423,
      446,
      675,
      510,
      590,
      610,
      760,
      ]
    }
  }
}
</script>

<style>

</style>