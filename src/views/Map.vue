<template>
  <div :id="`geoMap-${id}`">
    <svg width="500" height="500" style="border: 1px solid #00000060">
      <g class="counties" />
      <path class="county-borders" />
    </svg>
  </div>
</template>
<script>
import axios from "axios";
import * as d3 from "d3";
import shortid from "shortid";
import * as topojson from "topojson-client";
export default {
  name: "DrawMap",
  data() {
    return {
      id: shortid.generate(),
      DataAPI: "/COUNTY_MOI_1081121topo.json",
      MapData: undefined,
      population1:
        "/1-1+土地面積、戶數、人口數、人口密度、年齡結構及扶養比例.csv",
      // population2:
      //   "/1-2+土地面積、戶數、人口數、人口密度、年齡結構及扶養比例按主要都市分.csv",
      zoneData: ""
      // abc: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      // bbc: [2, 2, 2, 2, 2, 2, 2, 2]
    };
  },
  mounted() {
    const vm = this;
    axios
      .get(this.DataAPI)
      .then(res => {
        // eslint-disable-next-line no-console
        console.log("取得地圖JSON檔", res);
        vm.MapData = res.data;
        this.draw();
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log("err", err);
      });
    // this.abc.forEach(d => {
    //   this.bbc.forEach(b => {
    //     // eslint-disable-next-line no-console
    //     console.log(d, b);
    //   });
    // });
  },
  methods: {
    getData(api) {
      const vm = this;
      axios
        .get(api)
        .then(res => {
          // eslint-disable-next-line no-console
          console.log("取得地圖JSON檔", res);
          vm.MapData = res;
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log("err", err);
        });
    },
    async draw() {
      const vm = this;
      const geoMap = d3
        .geoMercator()
        .center([123, 23.5])
        .scale(6000);

      //由於 MapData 取得的是 topojson 格式，所以需要夠過插件來做解析才能畫地圖
      // eslint-disable-next-line no-console
      console.log(
        topojson.feature(vm.MapData, vm.MapData.objects["COUNTY_MOI_1081121"])
      );
      // // 生成地區名稱資料
      // const counties = topojson
      //   .feature(vm.MapData, vm.MapData.objects["COUNTY_MOI_1081121"])
      //   .features.map(item => {
      //     return item.properties.COUNTYNAME;
      //   });
      // // eslint-disable-next-line no-console
      // console.log("counties", counties);

      // 取得csv資料，與地圖資料合併
      // 這邊要注意，因為 csv 使用 Promise，若直接非同步處理，會造成 population 因 csv 還未完成取得，
      // 後面函式直接取用時 population 還未完成，造成它實際是取到空值，無法進行資料處理。
      let population = [];
      await d3
        .csv(vm.population1, d => {
          return {
            county: d["地區"],
            population: d["年底人口數"],
            density: d["人口密度"]
          };
        })
        .then(res => {
          population = res;
        });
      let formatMapData = topojson.feature(
        vm.MapData,
        vm.MapData.objects["COUNTY_MOI_1081121"]
      );

      // 這邊將地圖資料透過陣列函式與csv資料做比對並找到符合的資料後來新增人口密度與人口數
      formatMapData.features.forEach(d => {
        population.forEach(e => {
          if (d.properties.COUNTYNAME === e.county) {
            d.properties.density = e.density;
            d.properties.population = e.population;
          }
        });
      });
      // // eslint-disable-next-line no-console
      // console.log("population", population);
      // // eslint-disable-next-line no-console
      // console.log("formatMapData", formatMapData);

      //

      const geoPath = d3.geoPath(geoMap);
      d3.select("g.counties")
        .selectAll("path")
        .data(formatMapData.features)
        .enter()
        .append("path")
        .attr("d", geoPath);
      d3.select("path.county-borders").attr(
        "d",
        geoPath(
          topojson.mesh(vm.MapData, vm.MapData.objects["COUNTY_MOI_1081121"])
        )
      );
    }
  }
};
</script>
<style lang="scss">
.counties {
  fill: #547480;
}
.counties :hover {
  fill: #6c858e;
  transition: 0.1s;
}
.county-borders {
  fill: none;
  stroke: #fff;
  stroke-width: 0.5px;
}
</style>
