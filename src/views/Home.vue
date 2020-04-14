<template>
  <div class="home">
    <h2>主页</h2>
    <div class="chart-container">
      <div class="chart-item">
        <w-map id="map-chart" />
      </div>
      <div class="chart-item"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import WMap from "@/components/Charts/WMap.vue";
export default {
  name: "Home",
  components: {
    WMap
  }
};
</script>
<style lang="css">
.chart-container {
  width: 90%;
  height: 600px;
  margin: 0 auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
}
.chart-item {
  width: 50%;
  height: 100%;
}
</style>
