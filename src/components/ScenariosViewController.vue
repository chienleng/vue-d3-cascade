<template>
  <div class="multi-bar-view">
    <h1>Multi Bar</h1>

    <div class="selections">
      <label v-if="resultsOptions.length > 1">
        <select class="select" v-model="result">
          <option v-for="option in resultsOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
      
      <label>
        Year
        <select class="select" v-model="year">
          <option v-for="option in yearOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
    </div>

    <div class="chart" style="max-width: 800px; margin: 0 auto;">
      <stacked-cascade class="cascade"
        :h="400"
        :yAxisTitle="'Number of people'"
        :cascadeData="cascadeData"
        :legendDisplay="true" />
    </div>
    
  </div>
</template>

<script>
import * as d3 from 'd3'
import { transformDataForChartRender, transformCascadeData } from '@/modules/data-transform'
import StackedCascade from './StackedCascade3.vue'

export default {
  components: {
    StackedCascade,
  },
  props: {
    scenariosData: Object,
  },
  data() {
    return {
      result: null,
      resultsOptions: [],
      year: null,
      yearOptions: []
    }
  },
  computed: {
    cascadeData() {
      const transformed = this.scenariosData ? transformCascadeData(this.scenariosData) : {}

      if (this.scenariosData) {
        this.resultsOptions = transformed.results
        this.result = transformed.results[0]

        this.yearOptions = transformed.years
        this.year = transformed.years[0]
      }

      return transformed
    },
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>  
</style>