<template>
  <div class="wrapper">
    <div class="nav subtitle">
      <router-link to="/Chart">LineChart</router-link> |
      <router-link to="/Chart/BarChart">BarChart</router-link> |
      <router-link to="/Chart/LineChartPlusBrushing"
        >LineChartPlusBrushing</router-link
      >
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.nav.subtitle {
  padding: 10px;
  font-size: 0.75rem;
  a {
    font-weight: bold;
    color: #27384a;

    &.router-link-exact-active {
      color: #389a6e;
    }
  }
}
</style>
