import { createRouter, createWebHashHistory } from "vue-router";
// import MainView from "@/views/MainView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: ()=>import("@/views/MainView.vue"),
    },
  ],
});

export default router;
