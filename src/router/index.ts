import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Index",
    component: () => import("../components/IndexPage.vue"),
  },
  /** Config pages */
  {
    path: "/game/funambulation/config",
    name: "Funambulation Configuration",
    component: () => import("../components/Game/Funambulation/ConfigPage.vue"),
  },
  {
    path: "/game/player-vs-player/config",
    name: "Player VS Player Configuration",
    component: () => import("../components/Game/PlayerVsPlayer/ConfigPage.vue"),
  },
  {
    path: "/game/relay/config",
    name: "Relay Configuration",
    component: () => import("../components/Game/Relay/ConfigPage.vue"),
  },
  /** Play pages */
  {
    path: "/game/play/teacher",
    name: "Game Play Teacher",
    component: () => import("../components/Game/Play/TeacherPage.vue"),
  },
  {
    path: "/game/play/student",
    name: "Game Play Student",
    component: () => import("../components/Game/Play/StudentPage.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
