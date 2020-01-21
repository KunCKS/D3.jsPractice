import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "home",
    redirect: "/about"
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/Chart",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/Chart.vue"),
    children: [
      {
        path: "/",
        name: "LineChart",
        component: () => import("../components/LineChart.vue")
      },
      {
        path: "BarChart",
        name: "BarChart",
        component: () => import("../components/BarChart.vue")
      },
      {
        path: "LineChartPlusBrushing",
        name: "LineChartPlusBrushing",
        component: () => import("../components/LineChartPlusBrushing.vue")
      }
    ]
  },
  {
    path: "/BubblePlot",
    name: "HeatMap",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/BubblePlot.vue")
  },
  {
    path: "/Map",
    name: "Map",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/Map.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
