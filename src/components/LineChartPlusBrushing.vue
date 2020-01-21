<template>
  <div>
    <div :id="`line-chart-${id}`"></div>
  </div>
</template>
<script>
import * as d3 from "d3";
import shortid from "shortid";
import axios from "axios";
export default {
  name: "LineChart",
  data() {
    return {
      id: shortid.generate(),
      rawData: [
        {
          value: 10,
          name: "18:35"
        },
        {
          value: 12,
          name: "18:55"
        },
        {
          value: 30,
          name: "19:15"
        },
        {
          value: 18,
          name: "19:35"
        },
        {
          value: 6,
          name: "19:55"
        },
        {
          value: 17,
          name: "20:15"
        },
        {
          value: 16,
          name: "20:35"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        },
        {
          value: 9,
          name: "20:55"
        },
        {
          value: 3,
          name: "21:15"
        },
        {
          value: 1,
          name: "21:35"
        },
        {
          value: 5,
          name: "21:55"
        }
      ],
      LocationsData: [],
      weatherData: [],
      selected: { value: "" }
    };
  },
  methods: {
    drawChart() {
      const vm = this;
      const margin = {
        top: 20,
        bottom: 0,
        left: 0,
        right: 0
      };
      const chartWidth = 255 - margin.left - margin.right;
      const chartHeight = 235 - margin.top - margin.bottom;
      // eslint-disable-next-line no-unused-vars
      const x = d3
        .scaleLinear()
        .domain([0, this.rawData.length - 1])
        .range([0, chartWidth]);
      // eslint-disable-next-line no-console
      console.dir(x);
      // eslint-disable-next-line no-unused-vars
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(this.rawData.map(d => d.value))])
        .range([chartHeight, 0]); //思考一下，因為 SVG 的(0,0)座標在左上角，曲線是利用點呈現在座標上，所以 data數值小時通過scale計算得到的數值要比較大
      //，這樣才能從上方往下位移 y軸位置
      // eslint-disable-next-line no-console
      console.log("y", y);
      const svg = d3
        .select(`#line-chart-${this.id}`)
        .attr(
          "style",
          `width:${chartWidth +
            margin.left +
            margin.right}px;height:${chartHeight +
            margin.top +
            margin.bottom}px;position:relative`
        )
        .append("svg")
        .attr("id", `svg-line-chart-${this.id}`)
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom)
        .attr(
          "style",
          "box-shadow:0px 0px 10px rgba(0,0,0,0.1);border-radius: 6px"
        );
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      // d3 提供產生 path 參數的函式
      const line = d3
        .line()
        .x((d, i) => x(i)) // 以 index 做 x 座標計算，注意一下，.x()是line的函式，在裡面帶入參數時使用的 x()才是我們在外面建立的。
        .y(d => y(d.value));
      // .curve(d3.curveMonotoneX); // 彎曲的線，原本使用 curveBasis
      g.append("path")
        .datum(this.rawData) //將所有資料全部綁定到所選取的元素上
        .attr("d", line) // 以 d 屬性綁定路徑值，datum 綁定的 data會帶入 line 函式中進行計算
        .attr("class", "main-line")
        .attr("fill", "none")
        .attr("stroke-width", 2) // 曲線寬度
        .attr("stroke", "#0990CA"); // 曲線顏色
      // 透過 d3提供函式畫出區塊
      const area = d3
        .area()
        .x((d, i) => x(i))
        .y0(chartHeight) // svg座標 (0,0)在左上角
        .y1(d => y(d.value));
      // .curve(d3.curveMonotoneX);
      // 新增一個 defs 來建立一個漸層圖層
      const gradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", "curveGradient")
        .attr("x1", "50%")
        .attr("x2", "50%")
        .attr("y1", "0%")
        .attr("y2", "100%");
      // 漸層圖層起點位置與顏色
      gradient
        .append("stop")
        .attr("class", "gradient-start")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(9,144,202,0.4)")
        .attr("stop-opacity", 1);
      // 漸層圖層終點位置與顏色
      gradient
        .append("stop")
        .attr("class", "gradient-end")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(9,144,202,0)")
        .attr("stop-opacity", 1);
      // 將漸層圖層加入
      g.append("path")
        .attr("class", "path-area")
        .datum(this.rawData)
        .attr("d", area)
        .attr("fill", "url(#curveGradient)");
      // 製作一個 mask 蓋住折線圖，再向左移製造動畫的效果
      svg
        .append("rect")
        .attr("class", "lineChart-mask")
        .attr("width", chartWidth)
        .attr("height", chartHeight + margin.top + margin.bottom)
        .attr("fill", "#ffffff")
        .attr("x", 0)
        .transition()
        .duration(1300)
        .ease(d3.easeCubicInOut)
        .attr("x", chartWidth);
      // 設計 hover 標點
      const dot = g
        .append("circle")
        .attr("class", "dot")
        .attr("r", "5")
        .attr("stroke", "#0990CA")
        .attr("stroke-width", "2")
        .attr("fill", "#ffffff")
        .attr("opacity", "0");
      // 設計 tooltip block
      const tooltip = d3
        .select(`#line-chart-${this.id}`)
        .append("div")
        .attr("class", "tooltip-wrapper")
        .html(`<div class="circle"></div><div class="data"></div>`)
        .attr("style", "display:none");
      // bar-hover
      g.selectAll(`.line-hover-block-${this.id}`)
        .data(this.rawData)
        .enter()
        .append("rect")
        .attr("class", `line-hover-block-${this.id}`)
        .attr("fill", "transparent")
        .attr("x", (d, i) => x(i) - chartWidth / this.rawData.length / 2)
        .attr("y", 0)
        .attr("width", chartWidth / this.rawData.length)
        .attr("height", chartHeight)
        .on("mouseover", (d, i) => {
          dot
            .attr("cx", () => x(i))
            .attr("cy", y(d.value))
            .attr("opacity", "1");
          tooltip.attr("style", `display:flex;left: ${x(i) + 15}px`);
          d3.select(".tooltip-wrapper .data").html(`${d.value} mm`);
        })
        .on("mouseleave", () => {
          dot.attr("opacity", "0");
          tooltip.attr("style", `display:none`);
        });
      // 新增 brushing
      let brush = d3
        .brushX() // Add the brush feature using the d3.brush function
        .extent([
          [0, 0],
          [
            chartWidth + margin.left + margin.right,
            chartHeight + margin.top + margin.bottom
          ]
        ]) // [[x0, y0], [x1, y1]], initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart); // 監聽事件.on('brush有三個事件',執行的函式)
      // 新增組件來組織 brush
      svg
        .append("g")
        .attr("class", "brush")
        .call(brush);
      let idleTimeout;
      function idled() {
        idleTimeout = null;
      }
      function updateChart() {
        // What are the selected boundaries?
        const extent = d3.event.selection; // return 陣列，內容包含[x0,x1]
        // eslint-disable-next-line no-console
        console.log("brush 選到的範圍", extent);
        // // eslint-disable-next-line no-console
        // console.log(x.invert(extent[0]));
        // 如果沒有選取範圍，則使用 scale 原本的 X axis domain， 其他情況則更新 X axis domain
        if (!extent) {
          // eslint-disable-next-line no-console
          console.log("!extent");
          if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
          x.domain([0, vm.rawData.length - 1]);
        } else {
          // eslint-disable-next-line no-console
          console.log("else");
          x.domain([x.invert(extent[0]), x.invert(extent[1])]); // invert 將原本已經透過 scale 處理後的數值，還原成原本的值
          svg.select(".brush").call(brush.clear); // This remove the grey brush area as soon as the selection has been done，也可用 .call(brush.move, null)
        }
        // Update axis and line position
        // xAxis
        //   .transition()
        //   .duration(1000)
        //   .call(d3.axisBottom(x));
        g.select(".main-line")
          .transition()
          .duration(1000)
          .attr(
            "d",
            d3
              .line()
              .x((d, i) => x(i))
              .y(d => y(d.value))
          );
        g.select(".path-area")
          .transition()
          .duration(1000)
          .attr("d", area);
      }
      // If user double click, reinitialize the chart
      svg.on("dblclick", function() {
        x.domain([0, vm.rawData.length - 1]);
        g.select(".main-line")
          .transition()
          .duration(1000)
          .attr(
            "d",
            d3
              .line()
              .x((d, i) => x(i))
              .y(d => y(d.value))
          );
        g.select(".path-area")
          .transition()
          .duration(1000)
          .attr("d", area);
      });
    },
    getLocationsData() {
      const vm = this;
      const api = "https://works.ioa.tw/weather/api/all.json";
      axios
        .get(api)
        .then(res => {
          vm.LocationsData = res.data.map(city => ({
            label: `${city.name},台灣`,
            value: city.id
          }));
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    getWeatherData(id) {
      axios
        .get(`https://works.ioa.tw/weather/api/weathers/${id}.json`)
        .then(res => {
          this.weatherData = res.data;
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
        });
    }
  },
  watch: {
    select() {
      this.getWeatherData(this.selected.value);
    }
  },
  created() {
    this.getLocationsData();
  },
  mounted() {
    this.drawChart();
  }
};
</script>
