<template>
  <div class="stacked-cascade-view">
    <div class="selections" v-if="resultsOptions.length > 1">
      <label>
        <select class="select" v-model="result">
          <option v-for="option in resultsOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
    </div>

    <!-- <div style="margin: 0 auto 3rem;">
      <range-slider
        class="slider"
        min="10"
        max="1000"
        step="10"
        v-model="sliderValue">
      </range-slider>

      <h1>Time example</h1>
    <div class="row align-items-center">
      <div class="col-sm-2">
        <p id="value3"></p>
      </div>
      <div class="col-sm">
        <div id="slider3"></div>
      </div>
    </div>
    <a id="setValue3" href="#">Reset</a>
    </div> -->

    <div class="year-slider">
      <year-slider
        :years="yearOptions"
        @yearChanged="yearChanged"
      ></year-slider>
    </div>

    <div class="chart">
      <stacked-cascade class="cascade"
        :h="300"
        :yAxisTitle="'Number of people'"
        :cascadeData="updatedData"
        :year="year"
        :scenario="result"
        :colourScheme="colours"
        :legendDisplay="true" />
    </div>
  </div>
</template>

<script>
// import { transformCascadeData } from './data-transform'
// import StackedCascade from './StackedCascade.vue'
import { transformCascadeData } from '@/modules/data-transform'
import StackedCascade from './StackedCascade3.vue'
import YearSlider from './YearSlider.vue'

export default {
  components: {
    StackedCascade,
    YearSlider,
  },
  props: {
    cascadeData: Object,
    colourScheme: Array
  },
  data() {
    return {
      result: null,
      resultsOptions: [],
      year: null,
      yearOptions: [],
      updatedData: {},
      colours: this.colourScheme || null
    }
  },
  computed: {
  },
  watch: {
    cascadeData(newData) {
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
      this.year = this.yearOptions[0]

      this.updatedData = transformed

      // this.drawSlider()
    },
    yearChanged(year) {
      this.year = year
    },
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
.chart {
  max-width: 1200px;
  margin: 1rem auto;
}

.year-slider {
  width: 100%;
  margin: 0 auto;
}

@media only screen and (min-width: 800px) {
  .year-slider {
    width: 80%;
  }
}

@media only screen and (min-width: 1200px) {
  .year-slider {
    width: 60%;
  }
}

</style>