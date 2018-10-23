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

    <div class="chart" style="max-width: 800px; margin: 2rem auto;">
      <stacked-cascade class="cascade"
        :h="200"
        :yAxisTitle="'Number of people'"
        :cascadeData="cascadeData"
        :year="year"
        :scenario="result"
        :legendDisplay="true" />
    </div>

    <div class="chart" style="max-width: 800px; margin: 2rem auto;"
      v-for="option in resultsOptions" :key="option">
      <h4>{{option}}</h4>
      <stacked-cascade class="cascade"
        :h="200"
        :yAxisTitle="'Number of people'"
        :cascadeData="cascadeData"
        :year="year"
        :scenario="option"
        :legendDisplay="true" />
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { transformCascadeData } from '@/modules/data-transform'
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
.selections {
  border-bottom: 1px solid #e4ecfc;
  padding: 1rem;
  margin-bottom: 1rem;

  .select {
    margin-right: 1rem;
  }
}
</style>