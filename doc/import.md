## Vue Echarts 按需引入
### 需求
首先在项目中使用`npm install echarts -S`安装echarts
一般如果将echarts全局引入的话，我们可以在vue-cli构建的`main.js`中全局引入
```
 import Echarts from "echarts";
 Vue.prototype.$echarts = Echarts;
 Vue.use(Echarts);
```
这样我们在其他组件中就可以直接使用`this.$echarts`使用echarts了。
或者我们可以直接在要使用`echarts`的组件内导入echarts
```
import echarts from 'echarts'
```
有时候我们不需要使用echarts的全部功能，为了减少打包后的代码体积，我们需要将echarts按需引入。
### 解决方案
按需引入的方法也有两种，一种是手动将需要的echarts文件引入，可以建一个`initEcharts.js`文件，专门处理echarts的引入，然后将echarts导出;另一种方法是搭配使用`babel-plugin-equire`插件实现。
#### 不使用插件方法
initEcharts.js
```
import echarts from 'echarts/lib/echarts'
// 再引入你需要使用的图表类型，标题，提示信息等
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'

export default echarts
```
#### 搭配babel-plugin-equire
1. 安装`babel-plugin-equire`
```
npm i babel-plugin-equire --save-dev
```
2. 配置babel.config.js
```
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [["equire"]]
};

```
3. 引入echarts
在initEchartss.js文件中引入
```
// eslint-disable-next-line
const echarts = equire([
  "pie",
  "bar",
  "line",
  "map",
  "legend",
  "tooltip",
  "title",
  "dataZoom",
  "geo",
  "visualMap"
]);
export default echarts;

```
然后在需要用到echarts的组件中导入initEcharts.js文件就可以。
### 常用的图表类型和组件
```
exports.chart = [
  'bar',
  'boxplot',
  'candlestick',
  'chord',
  'custom',
  'effectScatter',
  'funnel',
  'gauge',
  'graph',
  'heatmap',
  'line',
  'lines',
  'map',
  'parallel',
  'pictorialBar',
  'pie',
  'radar',
  'sankey',
  'scatter',
  'themeRiver',
  'tree',
  'treemap'
]
exports.component = [
  'angleAxis',
  'axis',
  'axisPointer',
  'brush',
  'calendar',
  'dataZoom',
  'dataZoomInside',
  'dataZoomSelect',
  'geo',
  'graphic',
  'grid',
  'gridSimple',
  'legend',
  'legendScroll',
  'markArea',
  'markLine',
  'markPoint',
  'parallel',
  'parallelAxis',
  'polar',
  'radar',
  'radiusAxis',
  'singleAxis',
  'timeline',
  'title',
  'toolbox',
  'tooltip',
  'visualMap',
  'visualMapContinuous',
  'visualMapPiecewise'
]
```
