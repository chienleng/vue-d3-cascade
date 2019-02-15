<template>
  <div class="multi-bar-view">
    <budget-view-controller :budgetData="budgetData" />
    <div style="margin-bottom: 60px" ></div>
    <scenarios-view-controller :scenariosData="chartData" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import ScenariosViewController from '@/components/ScenariosViewController2.vue'
import BudgetViewController from '@/components/BudgetViewController.vue'

export default {
  components: {
    ScenariosViewController,
    BudgetViewController,
  },
  data() {
    return {
      chartData: null,
      budgetData: null,
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    this.fetchData()
  },
  methods: {

    fetchData() {
      fetch(`/data/json_test2.json`)
        .then(response => response.json())
        .then(response => {
          this.chartData = response
        })
      
      fetch(`/data/budget.json`)
        .then(response => response.json())
        .then(response => {
          this.budgetData = response
        })
    }

  }
}
</script>
<style lang="scss" scoped>
</style>