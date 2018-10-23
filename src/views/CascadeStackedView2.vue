<template>
  <div class="stacked-cascade-view">
    <stacked-cascade-view-controller :stackedCascadeData="chartData" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import StackedCascadeViewController from '@/components/StackedCascadeViewController.vue'

export default {
  components: {
    StackedCascadeViewController,
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