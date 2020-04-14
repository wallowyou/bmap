<template>
  <div :id="id" :class="className"></div>
</template>
<script>
import echarts from "@/plugins/initEchart.js";
import resize from "./mixins/resize";
import { get } from "@/utils/request.js";
import cityMap from "@/utils/cityMap.js";
export default {
  name: "w-map",
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "w-chart"
    },
    id: {
      type: String,
      default() {
        return Math.random()
          .toString(36)
          .substr(9);
      }
    },
    customOption: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      chart: null,
      mapName: "",
      level: 1 // 地图层级, 1显示省级地图 2 显示市级地图
    };
  },
  mounted() {
    this.registerMap("zhejiang");
  },
  methods: {
    // 注册地图
    registerMap(name) {
      get(`/mapdata/${name}.json`).then(res => {
        const geoJson = res.data;
        echarts.registerMap(name, geoJson);
        this.initChart();
      });
    },
    initChart() {
      if (this.chart) {
        this.chart.dispose(); // 销毁之前的实例
      }
      this.chart = echarts.init(document.getElementById(this.id));
      const option = {
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        tooltip: {
          trigger: "item",
          show: true,
          formatter: function(params) {
            let res = `<div><p style="text-align: left;"> ${params.name}</p></div>`;
            return res;
          }
        },
        geo: {
          // 设置地图的显示信息
          map: "", // 注意  哪个区域的就显示哪个区域的名称
          label: {
            normal: {
              // 设置字体相关信息
              show: true,
              color: "#ffffff"
            },
            emphasis: {
              // 设置鼠标移上去hover效果
              show: true,
              color: "#fff"
            }
          },
          roam: false,
          itemStyle: {
            // 设置地图块的相关显示信息
            normal: {
              areaColor: "#0AFFFC",
              borderColor: "#6367ad",
              borderWidth: 1
            },
            emphasis: {
              areaColor: "#feb6aa" // hover效果
            }
          },
          left: "0",
          right: "0",
          top: "0",
          bottom: "0"
        },
        series: [
          {
            type: "map",
            map: "zhejiang",
            zoom: 1.2,
            selectedMode: "single",
            label: {
              normal: {
                show: true,
                formatter: function(params) {
                  const str = params.name;
                  return str; //地图上展示文字
                }
              }
            },
            // data: [],
            itemStyle: {
              areaColor: "#0AFFFC"
            }
          }
        ]
      };
      this.chart.setOption(option);
      if (this.chart) {
        this.chart.on("click", params => {
          if (this.level === 2) {
            return;
          }
          this.mapName = params.name;
          const name = cityMap[params.name];
          get(`/mapdata/${name}.json`)
            .then(res => {
              const geoJson = res.data;
              echarts.registerMap(name, geoJson);
              const option = this.chart.getOption();
              option.series[0] = {
                type: "map",
                map: name,
                mapType: name,
                selectedMode: "single",
                zoom: 1.2,
                label: {
                  normal: {
                    show: true,
                    formatter: function(params) {
                      const str = params.name;
                      return str; //地图上展示文字 + 数值
                    }
                  }
                },
                // data: [],
                itemStyle: {
                  areaColor: "#0AFFFC"
                }
              };
              this.chart.setOption(option, true);
              this.level = 2;
              // 派发事件
            })
            .catch(error => {
              console.log("地图未找到" + error);
            });
        });
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  }
};
</script>
<style lang="css">
@import "./styles/index.css";
</style>
