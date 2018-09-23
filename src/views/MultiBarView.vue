<template>
  <div class="multi-bar-view">

    <div class="selectors">
      <label>Scenarios in</label>
      <select class="select" v-model="year">
        <option v-for="option in yearOptions" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <label>Show</label>
      <select class="select" v-model="cascade">
        <option v-for="option in cascadeOptions" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>

    <div style="max-width: 800px; margin: 0 auto;">
      <!-- @click="handleBarClicked"
        @mouseover="handleBarOver"
        @mouseout="handleBarOut"  -->

      <multibar class=""
        :h="400"
        :yAxisTitle="'Number of people'"
        :multiData="multiData"
        :colourScheme="colourScheme2"
        :keys="['default', 'doubled', 'zero']"
        :dict="{ 
          default: 'Default budget',
          doubled: 'Doubled budget',
          zero: 'Zero budget',
        }"
      />
    </div>

    <div class="columns">
      <div class="column chart" v-if="cascade === 'total'">
        <stacked-cascade class="cascade"
          :h="300"
          :marginObj="marginObj"
          :yAxisTitle="''"
          :chartData="defaultData"
          :colourScheme="[colourScheme2[0]]"
          :keys="['_total']"
          :dict="{ _total: 'Default budget' }"
          :legendDisplay="true" />
        
        <stacked-cascade class="cascade"
          :h="300"
          :marginObj="marginObj"
          :yAxisTitle="''"
          :chartData="doubledData"
          :colourScheme="[colourScheme2[1]]"
          :keys="['_total']"
          :dict="{ _total: 'Doubled budget' }"
          :legendDisplay="true" />
        
        <stacked-cascade class="cascade"
          :h="300"
          :marginObj="marginObj"
          :yAxisTitle="''"
          :chartData="zeroData"
          :colourScheme="[colourScheme2[2]]"
          :keys="['_total']"
          :dict="{ _total: 'Zero budget' }"
          :legendDisplay="true" />
      </div>

      <div class="column chart" v-if="cascade === 'breakdown'">
        <stacked-cascade class="cascade"
          :h="250"
          :marginObj="marginObj"
          :yAxisTitle="'Default'"
          :chartData="defaultData"
          :colourScheme="colourScheme"
          :keys="keys"
          :dict="dict"
          :legendDisplay="false" />
        
        <stacked-cascade class="cascade"
          :h="250"
          :marginObj="marginObj"
          :yAxisTitle="'Doubled'"
          :chartData="doubledData"
          :colourScheme="colourScheme"
          :keys="keys"
          :dict="dict"
          :legendDisplay="false" />
        
        <stacked-cascade class="cascade"
          :h="250"
          :marginObj="marginObj"
          :yAxisTitle="'Zero'"
          :chartData="zeroData"
          :colourScheme="colourScheme"
          :keys="keys"
          :dict="dict"
          :legendDisplay="true" />
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { transformDataForChartRender } from '@/modules/data-transform'
import Multibar from '@/components/Multibar.vue'
import StackedCascade from '@/components/StackedCascade.vue'

export default {
  components: {
    Multibar,
    StackedCascade
  },
  data() {
    return {
      project: 'hypertension',
      cascade: 'total',
      cascadeOptions: [
        { text: 'Total', value: 'total' },
        { text: 'Breakdown', value: 'breakdown' },
      ],
      year: '2031',
      yearOptions: [
        { text: '2018', value: '2018' },
        { text: '2030', value: '2030' },
        { text: '2031', value: '2031' },
      ],
      chartData: [],
      multiData: [],
      defaultData: [],
      doubledData: [],
      zeroData: [],
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
      colourScheme: d3.schemePaired,
      colourScheme2: d3.schemeDark2,
      marginObj: { left: 40, right: 20, top: 10, bottom: 20 }
    }
  },
  computed: {
  },
  watch: {
    year(newYear) {
      this.fetchData(this.project, newYear)
    }
  },
  mounted() {
    this.fetchData(this.project, this.year)
  },
  methods: {
    // handleBarClicked(data) {
    //   console.log(data)
    // },
    // handleBarOver(data) {
    //   console.log(data)
    // },
    // handleBarOut(data) {
    //   console.log(data)
    // },

    getTotal(stage, data) {
      const stageData = data.find(d => d.stage === stage)
      let total = stageData._total
      return total
    },

    fetchData(project, year) {
      Promise.all([
        fetch(`/data/${project}/${year}/data.json`).then(response => response.json()),
        fetch(`/data/${project}/${year}/doubled.json`).then(response => response.json()),
        fetch(`/data/${project}/${year}/zero.json`).then(response => response.json())
      ]).then(([defaultData, doubledData, zeroData]) => {
        const de = transformDataForChartRender(this.keys, defaultData)
        const doubled = transformDataForChartRender(this.keys, doubledData)
        const zero = transformDataForChartRender(this.keys, zeroData)

        const stages = de.map(d => d.stage)

        this.defaultData = de
        this.doubledData = doubled
        this.zeroData = zero
        this.multiData = []
        
        stages.forEach(stage => {
          this.multiData.push({
            stage,
            default: this.getTotal(stage, de),
            doubled: this.getTotal(stage, doubled),
            zero: this.getTotal(stage, zero),
          })
        })
      })

    },

  }
}
</script>
<style lang="scss" scoped>
h2 {
  text-align: center;
  border-bottom: 1px dotted #eee;
}
.column {
  display: flex;
}
.chart {
  width: 30%;
}
.cascade {
  width: 100%;
  margin: 0;
}
.selectors {
  text-align: center;
  border-bottom: 1px dashed #ccc;
  margin-bottom: 1rem;
  padding-bottom: 1rem;

  label {
    margin-right: 10px;
  }
}
.selectors .select {
  font-size: 1rem;
  margin-right: 1rem;
}
</style>