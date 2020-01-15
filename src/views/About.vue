<template>
  <div class="about">
    <!-- <svg width="600" height="400" style="border: 1px solid black" id="painter">
      <rect width="50" height="50" fill="#afafaf" id="foo"></rect>
      <rect width="50" height="50" fill="#afafaf" x="100"></rect>
      <rect width="50" height="50" fill="#afafaf" x="200" class="bar"></rect>
    </svg>
    <svg
      width="600"
      height="400"
      style="border: 1px solid black"
      class="editArea"
    ></svg> -->
    <!-- <p></p>
    <p></p>
    <p></p> -->
    <svg
      width="600"
      height="400"
      style="border: 1px solid black"
      id="painter"
    ></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  mounted() {
    // d3.select("#painter")
    //   .append("circle")
    //   .attr("fill", "blue")
    //   .attr("cx", 200)
    //   .attr("cy", 300)
    //   .attr("r", "50");
    // const data = [1, 2, 3, 4, 5, 6];
    // const editArea = d3.select(".editArea");
    // const text = editArea.selectAll("p").data(data);
    // // text
    // //   .enter()
    // //   .append("p")
    // //   .text((item, i) => {
    // //     return `這是Data：${item}，他的index為${i}`;
    // //   });
    // text
    //   .enter()
    //   .append("circle")
    //   .attr("cx", (r, i) => {
    //     return i * 100 + 10;
    //   })
    //   .attr("cy", "100")
    //   .attr("r", r => {
    //     return r * 5;
    //   })
    //   .attr("fill", "black");
    // ----------------
    // 當資料長度 > 元素長度
    // const data = [1, 2, 3, 4, 5];
    // const p = d3.select(".about").selectAll("p");
    // const update = p.data(data);
    // // eslint-disable-next-line no-console
    // console.log("update:", update);
    // const enter = update.enter();
    // // eslint-disable-next-line no-console
    // console.log("enter:", enter);
    // update.text(d => {
    //   return `updata ${d}`;
    // });
    // enter.append("p").text(d => {
    //   return `enter ${d}`;
    // });
    // ----------------
    // 當資料長度 < 元素長度
    // const data = [1];
    // const element = d3.select(".about").selectAll("p");
    // const update = element.data(data);
    // // eslint-disable-next-line no-console
    // console.log("update:", update);
    // const exit = update.exit();
    // // eslint-disable-next-line no-console
    // console.log("exit:", exit);
    // update.text(d => {
    //   return `update: ${d}`;
    // });
    // exit.remove();
    // Scale 調整數值比例
    // const data = [
    //   { value: 100, name: 1 },
    //   { value: 300, name: 2 },
    //   { value: 800, name: 3 },
    //   { value: 500, name: 4 },
    //   { value: 300, name: 5 }
    // ];
    // const linear = d3.select("#painter").selectAll("rect");
    // const update = linear.data(data);
    // const scale = d3
    //   .scaleLinear()
    //   .domain([
    //     0,
    //     d3.max(
    //       data.map(e => {
    //         return e.value; // 這邊直接進陣列取最大值
    //       })
    //     )
    //   ])
    //   .range([0, 400]); // 對應畫布的高度
    // const scaleband = d3
    //   .scaleBand()
    //   .domain(data.map(e => e.name)) // 這邊與上遍的比例尺不同，要帶入數組
    //   .range([0, 600]) // 對應畫布的寬度
    //   .paddingInner(0.3)
    //   .paddingOuter(0.3);
    // const enter = update.enter();
    // enter
    //   .append("rect")
    //   .attr("x", d => {
    //     return scaleband(d.name); // 利用scaleband幫我們計算 x
    //   })
    //   .attr("height", d => {
    //     return scale(d.value);
    //   })
    //   .attr("width", scaleband.bandwidth) // 直接利用 scaleband bar 計算寬度
    //   .attr("fill", "red");
    // 添加座標
    const data = [
      { value: 100, name: 1 },
      { value: 300, name: 2 },
      { value: 800, name: 3 },
      { value: 500, name: 4 },
      { value: 300, name: 5 }
    ];
    const svg = d3
      .select("#painter")
      .append("g")
      .attr("transform", "scale(0.9)") // 將圖表縮小，不會壓縮到座標
      .attr("transform-origin", "center"); // 設置中心點
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data.map(e => {
            return e.value; // 這邊直接進陣列取最大值
          })
        )
      ])
      .range([0, 400]); // 對應畫布的高度
    const x = d3
      .scaleBand()
      .domain(data.map(e => e.name)) // 這邊與上遍的比例尺不同，要帶入數組
      .range([0, 600]) // 對應畫布的寬度
      .paddingInner(0.3)
      .paddingOuter(0.3);
    const xAxis = d3.axisTop(x);
    const yAxis = d3.axisLeft(y);
    svg
      .append("g")
      .attr("class", "x axis")
      .call(xAxis);
    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => {
        return x(d.name); // 當 attr 第2參數是函式時，會按順序載入數據，這邊利用 scaleband 來幫我們計算分段 x
      })
      .attr("height", d => {
        return y(d.value);
      })
      .attr("width", x.bandwidth) // 直接利用 scaleband bar 計算寬度
      .attr("fill", "red");
  }
};
</script>
