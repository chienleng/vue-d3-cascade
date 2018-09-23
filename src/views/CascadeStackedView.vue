<template>
  <div class="about">
    <div class="selectors">
      <select class="select" v-model="project">
        <option v-for="option in projectOptions" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <select class="select" v-model="selected">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>

    <div class="">
      <div class="chart">
        <stacked-cascade class="cascade"
          :h="400"
          :yAxisTitle="'Number of people'"
          :chartData="chartData"
          :colourScheme="projectColour"
          :keys="projectKeys"
          :dict="projectDict"
          :legendDisplay="true" />
      </div>

      <div class="chart">
        <stacked-cascade class="cascade"
          :h="200"
          :yAxisTitle="'Number of people'"
          :chartData="chartData"
          :colourScheme="['#3182bd']"
          :keys="['_total']"
          :dict="{ _total: 'Total' }"
          :legendDisplay="true" />
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import dataTransform from '@/modules/data-transform'
import StackedCascade from '@/components/StackedCascade.vue'

export default {
  components: {
    StackedCascade,
  },
  data() {
    return {
      project: 'hypertension',
      projectOptions: [
        { text: 'Hypertension', value: 'hypertension' },
        { text: 'TB', value: 'tb' },
      ],
      selected: '2016',
      options: [
        { text: '2016', value: '2016' },
        { text: '2017', value: '2017' },
      ],
      chartData: [],
      keys: [
        'ufemale',
        'umale',
        'rfemale',
        'rmale',
      ],
      dict: {
        'rmale': 'Rural Males',
        'rfemale': 'Rural Females',
        'umale': 'Urban Males',
        'ufemale': 'Urban Females'
      },
      tbKeys: [
        'prisoners',
        'a65',
        'a15-64',
        'c5-14',
        'c0-4',
      ],
      tbDict: {
        'c0-4': 'Children 0-4',
        'c5-14': 'Children 5-14',
        'a15-64': 'Adults 15-64',
        'a65': 'Adults 65+',
        'prisoners': 'Prisoners'
      },
      colourScheme: d3.schemePaired,
      colourScheme2: d3.schemeDark2,
    }
  },
  computed: {
    projectKeys() {
      return this.project === 'tb' ? this.tbKeys : this.keys
    },
    projectDict() {
      return this.project === 'tb' ? this.tbDict : this.dict
    },
    projectColour() {
      return this.project === 'tb' ? this.colourScheme2 : this.colourScheme
    }
  },
  watch: {
    selected(newSelected) {
      this.fetchData(this.project, newSelected)
    },
    project(newSelected) {
      this.fetchData(newSelected, this.selected)
    }
  },
  mounted() {
    this.fetchData(this.project, this.selected)
  },
  methods: {
    fetchData(project, year) {
      fetch(`/data/${project}/${year}/data.json`)
        .then(response => response.json())
        .then(response => {
          this.chartData = dataTransform(this.projectKeys, response)
        })
        // .catch(err => {
        //   console.log('Fetch error', err)
        // })
    }
  }
}
</script>
<style lang="scss" scoped>
.selectors {
  text-align: center;
  border-bottom: 1px dashed #ccc;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
}
.selectors .select {
  font-size: 1rem;
  margin-right: 1rem;
}
.chart {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
</style>