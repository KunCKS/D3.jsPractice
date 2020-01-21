<template>
  <div>
    <p>
      <button @click="drawBubble">basic</button
      ><button @click="drawBubble2">colorful</button>
    </p>
    <div :id="`my_dataviz_${id}`"></div>
  </div>
</template>
<script>
import * as d3 from "d3";
import shortid from "shortid";
export default {
  data() {
    return {
      id: shortid.generate()
    };
  },
  methods: {
    drawBubble() {
      d3.select(`#my_dataviz_${this.id}`).html("");
      // let vm = this;
      // 設定畫布的大小以及邊界
      var margin = { top: 10, right: 20, bottom: 30, left: 50 },
        width = 500 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;

      // 添加SVG畫布
      var svg = d3
        .select(`#my_dataviz_${this.id}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // TEST 無法 fetch 本地端的檔案
      d3.csv("../assets/ThreeNum.csv").then(data => {
        // eslint-disable-next-line no-console
        console.log("data", data);
      });
      //Read the data
      // d3.js v5 版本 csv 函式寫法不太一樣
      d3.csv(
        "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv"
      ).then(data => {
        // Add X axis
        var x = d3
          .scaleLinear()
          .domain([0, 10000])
          .range([0, width]);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3
          .scaleLinear()
          .domain([35, 90])
          .range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        // Add a scale for bubble size
        var z = d3
          .scaleLinear()
          .domain([200000, 1310000000])
          .range([1, 40]);

        // Add dots
        svg
          .append("g")
          .attr("class", ".bubble")
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function(d) {
            return x(d.gdpPercap);
          })
          .attr("cy", function(d) {
            return y(d.lifeExp);
          })
          .attr("r", 0)
          .transition()
          .duration(1000)
          .ease(d3.easeCubicInOut)
          .attr("r", function(d) {
            return z(d.pop);
          })
          .style("fill", "#69b3a2")
          .style("opacity", "0.7")
          .attr("stroke", "black");
      });
    },
    drawBubble2() {
      d3.select(`#my_dataviz_${this.id}`).html("");
      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 20, bottom: 30, left: 50 },
        width = 500 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3
        .select(`#my_dataviz_${this.id}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // eslint-disable-next-line no-console
      console.log("scheme", d3.schemeSet2);

      //Read the data
      d3.csv(
        "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv"
      ).then(data => {
        // Add X axis
        var x = d3
          .scaleLinear()
          .domain([0, 12000])
          .range([0, width]);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3
          .scaleLinear()
          .domain([35, 90])
          .range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        // Add a scale for bubble size
        var z = d3
          .scaleLinear()
          .domain([200000, 1310000000])
          .range([4, 40]);

        // Add a scale for bubble color
        var myColor = d3
          .scaleOrdinal()
          .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
          .range(["#DAAFA4", "#9CC8F5", "#1F4868", "#A4E6EF", "#64C3B4"]);
        // .range(d3.schemeSet2);

        // Add dots
        svg
          .append("g")
          .selectAll("dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function(d) {
            return x(d.gdpPercap);
          })
          .attr("cy", function(d) {
            return y(d.lifeExp);
          })
          .attr("r", 0)
          .transition()
          .duration(1000)
          .ease(d3.easeCubicInOut)
          .attr("r", function(d) {
            return z(d.pop);
          })
          .attr("r", function(d) {
            return z(d.pop);
          })
          .style("fill", function(d) {
            return myColor(d.continent);
          })
          .style("opacity", "0.7")
          .attr("stroke", "white")
          .style("stroke-width", "2px");
      });
    }
  },
  mounted() {
    this.drawBubble2();
  }
};
</script>
