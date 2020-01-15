<template>
  <div :id="`line-chart-${id}`" style="position:relative"></div>
</template>
<script>
import * as d3 from "d3";
import shortid from "shortid";
export default {
  name: "LineChart",
  data() {
    return {
      id: shortid.generate()
    };
  },
  methods: {
    drawChart() {
      // 假資料
      const data = [
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
        }
      ];
      // 設定 svg chart 外的圖示或座標空間
      const margin = {
        top: 20,
        bottom: 20,
        left: 10,
        right: 10
      };
      const chartWidth = 520 - margin.left - margin.right; // 計算SVG的寬度
      const chartHeight = 280 - margin.top - margin.bottom; // 計算SVG的高度
      // 設定 x 方向分段比例（Band Scale），計算等比例的區間，並 return 出來
      const x = d3
        .scaleBand()
        .domain(
          data.map(a => {
            return a.name;
          })
        ) // 實際有幾個分段
        .range([0, chartWidth]) // 畫布大小
        .paddingInner(0.4);
      // eslint-disable-next-line no-console
      console.log("x.bandwidth", x.bandwidth);
      // eslint-disable-next-line no-console
      console.log("x", x);
      // 設定 ｙ 方向線性比例（Linear Scale）
      // eslint-disable-next-line no-unused-vars
      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(
            data.map(d => {
              // eslint-disable-next-line no-console
              console.log(d.value);
              return d.value;
            })
          )
        ])
        .range([chartHeight, 0]); // 數據顛倒，帶入數值越大，計算後的數字越小
      // 選取 div 產生 svg
      const svg = d3
        .select(`#line-chart-${this.id}`)
        // .attr(
        //   "style",
        //   `width:${chartWidth +
        //     margin.left +
        //     margin.right}px;height:${chartHeight +
        //     margin.top +
        //     margin.bottom}px`
        // )
        .append("svg")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom);
      // 生成 g 組件並移動到 svg 中間
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      const xAxisCall = d3.axisLeft(y).tickSize(chartWidth);
      // 產生後方 y軸座標並延長 tick 長度，這邊原本寫在生成長柱體的後面，但這樣會蓋過柱體，所以改寫在前面
      g.append("g")
        .call(xAxisCall)
        .attr("transform", `translate(${chartWidth},0)`)
        .attr("class", "y-axis");
      // g組件內生成長柱體
      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("width", x.bandwidth) // x.bandwidth  是 function 會 return bandwidth
        .attr("x", d => {
          return x(d.name);
        }) // 當 attr 第 2參數是函式時，會按順序載入數據，這邊利用 scaleband 來幫我們計算分段 x
        .attr("y", chartHeight) //動畫開始前的y是圖表底部，柱子才會從底下開始長，動畫過程包含height變高及往上位移
        .attr("fill", "#0990CA")
        .attr("rx", "4") // x軸 圓角
        .attr("height", 0)
        .transition()
        .duration(1500)
        .ease(d3.easeBounce) // 動畫時間曲線
        .attr("height", d => chartHeight - y(d.value)) // scale後的結果是顛倒的，這邊利用chartHeight 最大值去扣掉，計算要呈現的數值，再位移到適當位置
        .attr("y", d => y(d.value)); // 因 SVG的(x,y)是從左上角開始，要以下方 x軸開始堆積長柱，需要位移，故利用 Scale後的值來位移
      // 生成 x 座標文字
      g.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .text((d, i) => (i % 2 === 0 ? d.name : "")) // 奇數位置給予空字串，不要顯示，讓下方數字不要太壅擠
        .attr("x", d => x(d.name) + x.bandwidth() / 2) // x(d.name)的位置其實是柱子的最左邊，所以文字位置還必須加上半個柱子的寬度
        .attr("y", chartHeight + margin.bottom)
        .attr("font-size", "12")
        .attr("text-anchor", "middle") // 文字置中
        .attr("color", "#9B9B9B");
      // 生成透明 bar 作為 hover 觸發 tooltip 使用
      g.selectAll(".hover-bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "hover-bar")
        .attr("fill", "transparent")
        .attr("height", chartHeight) // 每個 hover-bar 都一樣高
        .attr("width", x.step) // 寬度包含 inner
        .attr("y", 0)
        .attr("x", d => x(d.name) - (x.step() - x.bandwidth()) / 2) // 這邊 step跟 bandwidth要用函式方式取得，往後位移一半的 inner
        .on("mouseover", d => {
          // 監控滑鼠動作
          dashLine
            .attr("x1", x(d.name) + x.bandwidth() / 2)
            .attr("x2", x(d.name) + x.bandwidth() / 2)
            .attr("opacity", 0.8);
          d3.select(".tooltip-wrapper .data").html(`${d.value} mm`);
          tooltip.attr("style", () => {
            return `display:flex;left: ${x(d.name) + 95}px`;
          });
        })
        .on("mouseleave", () => {
          dashLine.attr("opacity", 0);
          tooltip.attr("style", "display: none;");
        });
      // 添加 svg 直線到中，並設定樣式屬性
      const dashLine = g
        .append("line")
        .attr("y1", 0)
        .attr("y2", chartHeight)
        .attr("stroke", "#454545")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", 8)
        .attr("opacity", 0); // 先隱藏
      // 添加 tooltip 到 div 內，並在tooltip內寫入兩個tag，分別作為圓形及文字訊息所用，其餘樣式都是透過CSS去撰寫，
      // 另外要記得到div添加position:relative
      const tooltip = d3
        .select(`#line-chart-${this.id}`)
        .append("div")
        .attr("class", "tooltip-wrapper")
        .html('<div class="circle"></div><div class="data">123444</div>')
        .attr("style", "display:none"); // 先隱藏
    }
  },
  mounted() {
    this.drawChart();
    // this.frawdemo();
  }
};
</script>
<style lang="scss">
// 改變 y 座標 tick 顏色
.y-axis .tick line {
  stroke: #e8e8e8;
}
// 隱藏偶數條 tick
.y-axis .tick:nth-child(even) {
  display: none;
}
// 隱藏座標的數值
.y-axis text {
  display: none;
}
// 隱藏 y 座標
.y-axis .domain {
  display: none;
}
.tooltip-wrapper {
  border-radius: 4px;
  width: 102px;
  height: 34px;
  background: #f9f9f9;
  box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 20px;
  align-items: center;
  padding-left: 15px;
}
.tooltip-wrapper .circle {
  border-radius: 50%;
  height: 11px;
  width: 11px;
  background-color: #0990ca;
}
.tooltip-wrapper .data {
  font-size: 12px;
  color: #7e7e7e;
  margin-left: 10px;
}
</style>
