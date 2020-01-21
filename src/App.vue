<template>
  <div id="app">
    <div class="nav">
      <router-link to="/about">BarChart1</router-link> |
      <router-link to="/Chart">Chart</router-link> |
      <router-link to="/BubblePlot">BubblePlot</router-link> |
      <router-link to="/Map">Map</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import "@/assets/all.scss";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav {
  padding: 10px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
