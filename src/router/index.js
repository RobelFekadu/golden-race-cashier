import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { public: true },
  },
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/views/MainDashboard.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.refreshState();

  if (!to.meta.public && !isLoggedIn) {
    return { name: "login" };
  }

  if (to.meta.public && isLoggedIn) {
    return { name: "dashboard" };
  }

  return true;
});

export default router;
