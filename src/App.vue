<template>
  <div id="app">
    <div id="nav">
      <router-link to="/cascade-stacked-3">Cascade Stacked 2</router-link> |
      <router-link to="/cascade-stacked-1">Cascade Stacked</router-link> |
      <router-link to="/cascade-stacked-2">Cascade Stacked Comparisons</router-link> |
      <router-link to="/multibar">Multi Bar w/ Cascade Stacked</router-link> |
      <router-link to="/multibar2">Multi Bar 2 w/ Cascade Stacked</router-link> |
      <router-link to="/multibar3">Multi Bar 3 w/ Cascade Stacked</router-link>
    </div>
    
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  text-align: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;

  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.columns {
  display: flex;

  .column {
    display: block;
    flex-grow: 1;
  }
}
*:before, *:after {
  box-sizing: border-box;
}
</style>
