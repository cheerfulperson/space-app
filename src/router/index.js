import Vue from "vue";
import VueRouter from "vue-router";
import PlanetCreation from "../views/PlanetCreation.vue";
import PlanetInfo from "../views/PlanetInfo.vue";
import SearchPage from "../views/SearchPage.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "PlanetCreation",
      component: PlanetCreation
    },
    {
      path: "/planet",
      name: "PlanetInfo",
      component: PlanetInfo
    },
    {
      path: "/search",
      name: "SearchPage",
      component: SearchPage
    }
  ]
});

export default router;
