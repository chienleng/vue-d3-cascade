<template>
  <div class="stacked-cascade-view">
    <h1>Stacked Cascade Bar</h1>

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
    stackedCascadeData: Object,
  },
  data() {
    return {
      result: null,
      resultsOptions: [],
      year: null,
      yearOptions: [],
      cascadeData: {}
    }
  },
  computed: {
  },
  watch: {
    stackedCascadeData(newData) {
      if (newData) {
        this.updateCascadeData(newData)
      }
    }
  },
  mounted() {
  },
  methods: {
    updateCascadeData(d) {
      const transformed = transformCascadeData(d)

      this.resultsOptions = transformed.results
      this.result = transformed.results[0]

      this.yearOptions = transformed.years
      this.year = transformed.years[0]

      this.cascadeData = transformed
    }
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