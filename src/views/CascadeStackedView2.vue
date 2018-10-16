<template>
  <div class="about">
    <div class="">
      <div class="chart" style="max-width: 800px; margin: 0 auto;">
        <stacked-cascade class="cascade"
          :h="400"
          :yAxisTitle="'Number of people'"
          :cascadeData="chartData"
          :colourScheme="projectColour"
          :legendDisplay="true" />
      </div>

    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import StackedCascade from '@/components/StackedCascade2.vue'

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
      chartData: {},
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
          // this.chartData = response
        })
        // .catch(err => {
        //   console.log('Fetch error', err)
        // })

      // `/data/json_test.json`
      fetch(`/data/json_test2.json`)
        .then(response => response.json())
        .then(response => {
          // let data = {}

          // const stages = response.stages.main
          // const pops = response.pops
          // const results = response.results

          // const keys = pops.map(p => {
          //   const s = p.replace(/ +/g, '')
          //   return s.toLowerCase()
          // })
          // let dict = {}
          // keys.forEach((k, i) => {
          //   dict[k] = pops[i]
          // })

          // results.forEach(r => {
          //   const yearRange = response.t[r]
          //   data[r] = {}

          //   yearRange.forEach((y, i) => {
          //     data[r][y] = []

          //     stages.forEach((stage, stageIndex) => {
          //       data[r][y].push({
          //         stage
          //       })

          //       pops.forEach(p => {
          //         const value = response.model[r].main[p][stage][i]
          //         const key = p.replace(/ +/g, '').toLowerCase()

          //         data[r][y][stageIndex][key] = value
          //       })
          //     })
          //   })            
          // })

          // this.keys = keys
          // this.dict = dict
          // this.chartData = data['Baseline']['2035']

          this.chartData = response
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