<template>
  <div class="multi-bar-cascade">
    <table class="legend-table table is-narrow">
      <tbody>
        <tr v-for="key in legendKeys" :key="key">
          <td>
            <span 
              class="legend-colour" 
              :style="{ 'background-color': legendColour[key] }">
            </span>
          </td>
          <td>{{key}}</td>
          <td style="width: 50px; font-weight: bold; text-align: right;">
            <div v-if="showLegend">
              {{legend[key]}}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { transformMultiData } from '@/modules/data-transform'
import cascadeStep from '@/modules/cascade-step'

export default {
  name: 'multi-bar-cascade',

  props: {
    multiData: Object,
    h: Number,
    yAxisTitle: String,
    colourScheme: Array,
    year: Number,
  },

  data() {
    return {
      id: null,
      currentData: {},
      keys: [],
      svgWidth: 0,
      svgHeight: this.h || 300,
      width: 0,
      height: 0,
      colours: d3.schemeSet1,
      margin: { left: 75, right: 40, top: 10, bottom: 20 },
      t: d3.transition().duration(0),
      svg: null,
      g: null,
      x1: null,
      x0: null,
      y: null,
      z: null, // stacked colours
      area: null,
      xAxis: null,
      yAxis: null,
      xAxisGroup: null,
      yAxisGroup: null,
      yAxisLabel: null,
      tooltip: null,
      legendKeys: [],
      legend: {},
      legendColour: {},
      showLegend: false,
    }
  },

  watch: {
    multiData(newData) {
      this.updateOptions(newData)
    },
    keys(newData) {
      this.setupLegend(newData)
    },
    year() {
      this.update()
    },
  },

  created() {
    this.setupLegend(this.keys)

    if (this.colourScheme && this.colourScheme.length > 0) {
      this.colours = this.colourScheme
    }
  },

  mounted() {
    this.id = this._uid
    window.addEventListener('resize', this.handleResize)

    this.setupWidthHeight()
    this.setup()
  },

  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    setupLegend(keys) {
      // create the legend
      keys.forEach((key, i) => {
        this.legend[key] = 0
        this.legendColour[key] = this.colours[i]
      })

      this.legendKeys = keys.slice()
    },

    redraw() {
      // redraw
      this.svg.remove()
      this.setupWidthHeight()
      this.setup()
      this.update()
    },

    updateOptions(data) {
      const updated = data
      this.keys = updated.results

      this.currentData = updated.data
      this.update()
    },

    handleResize() {
      this.redraw()
    },

    setupWidthHeight() {
      this.svgWidth = this.$el.offsetWidth
      this.width = this.$el.offsetWidth - this.margin.left - this.margin.right
      this.height = this.svgHeight - this.margin.top - this.margin.bottom
    },

    getId(string) {
      return string.toLowerCase().replace(/\s/g, '')
    },
 
    setup() {
      this.x0 = d3.scaleBand()
        .rangeRound([0, this.width])
        .paddingInner(0.2)
        .paddingOuter(0.3)

      this.x1 = d3.scaleBand()
        .padding(0.1)

      this.y = d3.scaleLinear()
      this.z = d3.scaleOrdinal()
        .range(this.colours)
        
      this.xAxis = d3.axisBottom(this.x0)
      this.yAxis = d3.axisLeft(this.y)
        .tickFormat(d => {
          if (d < 1000 && d > 99) {
            return `${d/1000}k`
          } else {
            return d3.format('~s')(d)
          }
        })

      this.svg = d3.select(this.$el)
        .append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
      
      this.g = this.svg.append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
      
      this.xAxisGroup = this.g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${this.height})`)
      
      this.yAxisGroup = this.g.append('g')
        .attr('class', 'y-axis')

      // x axis label
      this.g.append('text')
        .attr('class', 'x-label')
        .attr('x', this.width/2)
        .attr('y', this.height + 40)
        .attr('font-size', '20px')
        .attr('text-anchor', 'middle')
      
      // y axis label
      this.yAxisLabel = this.g.append('text')
        .attr('class', 'y-label')
        .attr('x', -(this.height/2))
        .attr('y', -50)
        .attr('transform', 'rotate(-90)')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .style('text-anchor', 'middle')
    },

    update() {
      const data = transformMultiData(this.keys, this.multiData, this.year)

      // axis and domain setup
      this.x0.domain(data.map(r => r.stage))
      this.x1.domain(this.keys).rangeRound([0, this.x0.bandwidth()])
      this.y.domain([0, d3.max(data, r => r.highest )]).range([this.height, 0]).nice()

      this.z.domain(this.keys)
      
      this.xAxisGroup
        .call(this.xAxis)
      this.yAxisGroup
        .call(this.yAxis)

      this.yAxisLabel
        .text(this.yAxisTitle)

      // Setup area curve and drawing data
      const area = d3.area()
        .curve(d => cascadeStep(d, this.x1.bandwidth()))
        .x0(d => this.x0(d.stage) + this.x1(d.key))
        .y0(d => this.y(0))
        .y1(d => this.y(d.value))
      
      // Remove existing vis for redraw
      this.g.select('.multi-bars').remove()
      this.g.select('.multi-areas').remove()

      // Cascade Area
      const multiAreasGroup = this.g.append('g').attr('class', 'multi-areas')
      const multiAreas = multiAreasGroup
        .selectAll('.layer')
        .data(() => this.keys.map(function(key) {
            const areaData = { key }
            areaData.stages = []
            
            data.forEach(d => {
              areaData.stages.push({
                key,
                stage: d.stage,
                value: d[key]
              })
            })

            return areaData
          })
        )
      
      multiAreas
        .enter()
          .append('g')
          .attr('class', 'layer')
          .append('path')
            .attr('class', d => `area ${this.getId(d.key)}-area`)
            .style('opacity', 0)
            .style('fill', d => this.z(d.key))
            .attr('d', d => area(d.stages))
      
      // Bars
      const multiBarsGroup = this.g.append("g")
        .attr('class', 'multi-bars')
        .selectAll('.multi-bars')
        .data(data)

      const multiBars = multiBarsGroup.enter().append('g')
        .attr('transform', d => 'translate(' + this.x0(d.stage) + ',0)')
        .selectAll('rect')
        .data(d => this.keys.map((key) => {
          return {
            key: key,
            value: d[key]
          }
        }))
      
      multiBars.enter().append('rect')
        .attr('x', d => this.x1(d.key))
        .attr('y', d => this.y(d.value))
        .attr('width', this.x1.bandwidth())
        .attr('height', d => this.height - this.y(d.value))
        .attr('fill', d => this.z(d.key))
        .attr('fillOpacity', 0)
        .attr('class', d => `rect ${this.getId(d.key)}-rect`)
        // .on('mousedown', d => {
        //   this.$emit('click', d)
        // })
        .on('mouseover', d => {
          this.$emit('mouseover', d)

          const className = this.getId(d.key)
          d3.selectAll('.rect')
            .style('opacity', 0.1)
          d3.selectAll(`.${className}-area`).transition()
            .style('opacity', 0.2)
          d3.selectAll(`.${className}-rect`)
            .style('opacity', 1)
        })
        .on('mouseout', d => {
          this.$emit('mouseout', d)
          d3.selectAll('.area').transition().duration(100)
            .style('opacity', 0)
          d3.selectAll('.rect')
            .style('opacity', 1)
        })
        .merge(multiBars)
        .transition(this.t)
          .attr('opacity', 1)

    }
  }
}
</script>

<style lang="scss" scoped>
.multi-bar-cascade {
  position: relative;
}

.legend-colour {
  display: block;
  width: 15px;
  height: 15px;
}

.legend-table {
  position: absolute;
  right: 2rem;
  top: 0;
  width: auto;
}

.legend-table.table {
  border: none;

  td, th {
    padding: 3px 2px 2px;
    text-align: left;
    border: none;
    font-size: 11px;
    font-weight: normal;
  }

  thead > tr > th,
  tbody > tr > td {
    background: transparent;
    color: #000;
    line-height: 1;
  }
}
</style>
