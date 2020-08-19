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
      geoCoordMap: {
        监狱1: [120.171465, 30.250236],
        监狱2: [119.878199, 30.70695]
      },
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
            console.log(params);
            let val = "";
            if (params.value && Array.isArray(params.value)) {
              if (params.value.length === 3) {
                val = params.value[2];
              }
            }
            let res = `<div><p style="text-align: left;"> ${params.name}:${val}</p></div>`;
            return res;
          }
        },
        // visualMap: {
        //   type: "piecewise",
        //   textStyle: {
        //     color: "#fff"
        //   }
        // },
        geo: {
          // 设置地图的显示信息
          map: "zhejiang", // 注意  哪个区域的就显示哪个区域的名称
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
              areaColor: "#004259",
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
          // {
          //   type: "map",
          //   map: "zhejiang",
          //   zoom: 1.2,
          //   selectedMode: "single",
          //   label: {
          //     normal: {
          //       show: true,
          //       formatter: function(params) {
          //         const str = params.name;
          //         return str; //地图上展示文字
          //       }
          //     }
          //   },
          //   // data: [],
          //   itemStyle: {
          //     areaColor: "#0AFFFC"
          //   }
          // },
          {
            type: "scatter",
            coordinateSystem: "geo",
            data: this.convertData([
              { name: "监狱1", value: 110 },
              { name: "监狱2", value: 110 }
            ]),
            symbol:
              "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAPCAYAAADQ4S5JAAAABHNCSVQICAgIfAhkiAAAAblJREFUKFOVkcFLG0EYxd/nBqMx6RpkiSVSlaIVPOgWsvVScq6X0kvxqIeeq0h7Vf8Dhd4UjCcPHhSRnoN4aBLI9NBTKEgPYiQxuO5Gm3V3R2ZcJVER/A47szPv982beYSgxhnrbofzFeDTAA0EyzsANvL6OzHKIvFJsfw4wd9uEt7uy5GDZwr6xIwEbjo3mBAroIvJnp76h7im2Z6LreqJWbDO1QBaKegTs2Sw3CKABSHOvBmNDHdG8O2whC+9fRDz1fIR1spH8iQH/iAZxdxvEMY+a4l/88n+frGxWSmj7nkY6owgrcYx+Yc1Tt2rsA8+J07gQvTj9UhdDYW6vh+WcOw40KMxxBQFU9pL7NUq+FmrCtlSC/D3/0UXsy0pPnYaKFoW0t1xlC7r2DfPboAUy2UJSL9X4ye25yZeKCFEFUX636tV8TYaw+5pxb30/RAHzVCK5acJfF3gc8lXmNJ6757U8jwIi0XbAucwr6h9QOZgsF87AH0U82Q4bBpRlWzfbTswzzpE56DDJxGgBGQW3MmK12pJLPgRVgq6kblL+imoWdwCPAbdFz8AmiFOtHxro9mmvMNz6hrMcb7ZbtYwtAAAAABJRU5ErkJggg==",
            symbolSize: 12,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                borderColor: "#fff",
                borderWidth: 1
              }
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
    },
    convertData(data) {
      const res = [];
      for (let i = 0; i < data.length; i++) {
        const geoCoord = this.geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
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
