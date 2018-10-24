<template>
  <div class="multi-bar-view">
    <div class="selections">
      <!-- <label v-if="resultsOptions.length > 1">
        <select class="select" v-model="result">
          <option v-for="option in resultsOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label> -->
      
      <label>
        Year
        <select class="select" v-model="year">
          <option v-for="option in yearOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
    </div>

    <div class="scenarios-vis">

      <div class="multi-bar-vis">
        <multibar
          :h="300"
          :yAxisTitle="'Number of people'"
          :multiData="cascadeData"
          :year="year"
        />
      </div>

      <div class="stacked-cascade-vis">
        <div class="chart" v-for="option in resultsOptions" :key="option">
          <h4>{{option}}</h4>
          <stacked-cascade class="cascade"
            :h="180"
            :yAxisTitle="'Number of people'"
            :cascadeData="cascadeData"
            :year="year"
            :scenario="option"
            :legendDisplay="true" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { transformCascadeData } from '@/modules/data-transform'
import Multibar from './Multibar2.vue'
import StackedCascade from './StackedCascade3.vue'

export default {
  components: {
    Multibar,
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
      yearOptions: [],
      cascadeData: {},
      colorScheme: d3.schemeDark2
    }
  },
  computed: {},
  watch: {
    scenariosData(newData) {
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

.scenarios-vis {

  .multi-bar-vis {
    max-width: 800px;
    margin: 0 auto;
  }
  .stacked-cascade-vis {
    display: flex;
    flex-wrap: wrap;

    .chart {
      width: 50%;
    }
  }
}
</style>