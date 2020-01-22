<template>
  <div :id="`geoMap-${id}`" style="position:relative">
    <svg width="500" height="500" style="border: 1px solid #00000060">
      <g class="counties" />
      <path class="county-borders" />
      <g
        class="sites"
        v-for="(site, i) in govSite"
        :key="i"
        :transform="`translate(${site.lng}, ${site.lat})`"
      >
        <circle r="2" :id="`site-${i}`" class="siteCircle" />
      </g>
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
      population:
        "/1-1+土地面積、戶數、人口數、人口密度、年齡結構及扶養比例.csv",
      govSite_url: "/各縣市位置.csv",
      govSite: "",
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
      let MapData_Area = topojson.feature(
        vm.MapData,
        vm.MapData.objects["COUNTY_MOI_1081121"]
      );
      const MapData_Border = topojson.mesh(
        vm.MapData,
        vm.MapData.objects["COUNTY_MOI_1081121"]
      );
      // eslint-disable-next-line no-console
      console.log("解析topojson feature", MapData_Area);
      // eslint-disable-next-line no-console
      console.log("解析topojson mesh", MapData_Border);

      // // 生成地區名稱資料
      // const counties = topojson
      //   .feature(vm.MapData, vm.MapData.objects["COUNTY_MOI_1081121"])
      //   .features.map(item => {
      //     return item.properties.COUNTYNAME;
      //   });
      // // eslint-disable-next-line no-console
      // console.log("counties", counties);

      // 取得 csv資料，與 topojson 地圖資料合併
      // 這邊要注意，因為 csv 使用 Promise，若直接非同步處理，會造成 population 因 csv 還未完成取得，
      // 後面函式直接取用 population 時還未完成，造成它實際是取到空值，無法進行資料處理。
      // 所以要用 await 同步語法來等待 csv 資料處理完畢再做後續的資料渲染
      let population = [];
      await d3
        .csv(vm.population, d => {
          return {
            county: d["地區"],
            population: d["年底人口數"],
            density: d["人口密度"]
          };
        })
        .then(res => {
          population = res;
        });

      // 這邊將 topojson 地圖資料透過陣列函式與 csv資料做比對後找到對應的資料後(如 topojson的台中市對上 csv的台中市)來新增人口密度與人口數的屬性
      MapData_Area.features.forEach(d => {
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
      // console.log("MapData_Area", MapData_Area);

      // test
      // eslint-disable-next-line no-console
      console.log("geoMap", geoMap([121.6739, 24.91571]));

      // test

      // 標定各縣市政府位置
      let govSite_rawData = [];
      await d3
        .csv(vm.govSite_url, d => {
          return {
            county: d["縣市"],
            lng: d["經度"],
            lat: d["緯度"]
          };
        })
        .then(res => {
          govSite_rawData = res;
        });
      vm.govSite = govSite_rawData.map(d => {
        let formatSite = geoMap([d.lng, d.lat]);
        return {
          county: d.county,
          lng: formatSite[0],
          lat: formatSite[1]
        };
      });
      // eslint-disable-next-line no-console
      console.log(vm.govSite);

      // ScaleLinear 設定密度與顏色的對應範圍
      // 這邊要注意陣列中是否有不需要的資料，否則 d3.max() or extent() 處理下去會不管資料是否需要，直接依最大值或會小值去拉
      const densityColor = d3
        .scaleLinear()
        .domain(
          // d3.min(
          //   MapData_Area.features.map(d => Number(d.properties.population))
          // ),
          // d3.max(
          //   MapData_Area.features.map(d => Number(d.properties.population))
          // )
          // extent 可以直接 return [d3.min, d3.max]
          d3.extent(
            MapData_Area.features.map(d => Number(d.properties.population)) // 注意資料的型別，因為原始資料為字串，這邊要轉為數值型別
          )
        )
        .range(["#00BD00", "#D90000"]);

      const geoPath = d3.geoPath(geoMap);
      d3.select("g.counties")
        .selectAll("path")
        .data(MapData_Area.features)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("fill", d => densityColor(Number(d.properties.population)))
        .on("mousemove", d => {
          let mouse = d3
            .mouse(d3.select(`#geoMap-${vm.id} svg`).node())
            .map(e => {
              return parseInt(e);
            });
          // let elWidth = parseFloat(
          //   d3.select(`#geoMap-${vm.id} .tooltip`).node().offsetWidth
          // );
          tooltip
            .classed("hidden", false)
            .attr("style", `left:${mouse[0]}px;top:${mouse[1] - 50}px`)
            .html(
              `${d.properties.COUNTYNAME}人口數為 ${d.properties.population}`
            );
          // // eslint-disable-next-line no-console
          // console.log(
          //   parseFloat(d3.select(`#geoMap-${vm.id} .tooltip`).style("width"))
          // );
        })
        .on("mouseout", () => {
          tooltip.classed("hidden", true);
        });
      d3.select("path.county-borders").attr("d", geoPath(MapData_Border));
      // 建立 tooltip tag
      const tooltip = d3
        .select(`#geoMap-${vm.id}`)
        .append("div")
        .attr("class", "hidden tooltip");
    }
  }
};
</script>
<style lang="scss">
// .counties {
//   fill: #547480;
// }
.counties :hover {
  fill: #6c858e;
  transition: 0.1s;
}
.county-borders {
  fill: none;
  stroke: #fff;
  stroke-width: 0.5px;
}
.hidden {
  display: none;
}
.tooltip {
  color: #222;
  background-color: #fff;
  padding: 0.5em;
  text-shadow: #f5f5f5 0 1px 0;
  border: 1px solid #000000;
  border-radius: 5px;
  opacity: 0.9;
  position: absolute;
}
.siteCircle {
  fill: rgb(182, 242, 231);
  cursor: pointer;
}
</style>
