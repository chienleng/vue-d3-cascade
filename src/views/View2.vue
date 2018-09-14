<template>
  <div class="view2">

    <div class="columns">
      <div class="column chart">
        <h2>2016</h2>
        <stacked-cascade class="cascade"
          :h="200"
          :yAxisTitle="'Number of people'"
          :chartData="data2016"
          :colourScheme="['#3182bd']"
          :keys="['total']"
          :dict="{ total: 'Total' }" />

        <stacked-cascade class="cascade"
          :h="300"
          :yAxisTitle="'Number of people'"
          :chartData="data2016"
          :colourScheme="colourScheme2"
          :keys="keys"
          :dict="dict" />
      </div>

      <div class="column chart">
        <h2>2017</h2>
        <stacked-cascade class="cascade"
          :h="200"
          :yAxisTitle="'Number of people'"
          :chartData="data2017"
          :colourScheme="['#3182bd']"
          :keys="['total']"
          :dict="{ total: 'Total' }" />
        <stacked-cascade class="cascade"
          :h="300"
          :yAxisTitle="''"
          :chartData="data2017"
          :colourScheme="colourScheme2"
          :keys="keys"
          :dict="dict" />
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import StackedCascade from '@/components/StackedCascade.vue'

export default {
  components: {
    StackedCascade,
  },
  data() {
    return {
      project: 'hypertension',
      selected: '2016',
      options: [
        { text: '2016', value: '2016' },
        { text: '2017', value: '2017' },
      ],
      chartData: [],
      data2016: [],
      data2017: [],
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
  },
  watch: {
  },
  mounted() {
    this.fetch2016Data(this.project)
    this.fetch2017Data(this.project)
  },
  methods: {
    transformData(data) {
      const lastIndex = data.length - 1
      const transformed = data.map(d => {
        let obj = { stage: d.stage }
        let total = 0;

        this.keys.forEach(key => {
          total += d[key]
          obj[key] = d[key]
        })

        obj.total = total

        return obj
      })

      transformed.forEach((d, i) => {
        if (i === lastIndex) {
          d.loss = 0
          d.conversion = 0
        } else {
          d.loss = transformed[i].total - transformed[i+1].total
          d.conversion = transformed[i+1].total / transformed[i].total * 100
        }
      })

      return transformed
    },

    fetchData(project, year) {
      fetch(`/data/${project}/${year}/data.json`)
        .then(response => response.json())
        .then(response => {
          this.chartData = this.transformData(response)
        })
        // .catch(err => {
        //   console.log('Fetch error', err)
        // })
    },

    fetch2016Data(project) {
      fetch(`/data/${project}/2016/data.json`)
        .then(response => response.json())
        .then(response => {
          this.data2016 = this.transformData(response)
        })
        // .catch(err => {
        //   console.log('Fetch error', err)
        // })
    },

    fetch2017Data(project) {
      fetch(`/data/${project}/2017/data.json`)
        .then(response => response.json())
        .then(response => {
          this.data2017 = this.transformData(response)
        })
        // .catch(err => {
        //   console.log('Fetch error', err)
        // })
    }
  }
}
</script>
<style lang="scss" scoped>
h2 {
  text-align: center;
  border-bottom: 1px dotted #eee;
}
.chart {
  width: 50%;
}
.cascade {
  margin: 3rem 0;
}
</style>