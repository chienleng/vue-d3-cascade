<template>
  <div class="multi-bar-view">
    <scenarios-view-controller :scenariosData="chartData" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import ScenariosViewController from '@/components/ScenariosViewController.vue'

export default {
  components: {
    ScenariosViewController,
  },
  data() {
    return {
      chartData: null
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
    }

  }
}
</script>
<style lang="scss" scoped>
</style>