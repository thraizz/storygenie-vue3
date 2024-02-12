import { createRouter, createWebHistory } from "vue-router";
import { auth } from "./firebase";
import { useUser } from "./stores/user";
import HomeVue from "./views/Home.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      components: {
        default: HomeVue,
      },
      meta: {
        title: "Home",
        requiresAuth: true,
      },
    },
    {
      path: "/new",
      component: () => import("./views/product/ProductCreation.vue"),
      meta: {
        title: "Create Product",
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      component: () => import("./views/auth/Login.vue"),
      meta: {
        title: "Login",
      },
    },
    {
      path: "/register",
      component: () => import("./views/auth/Registration.vue"),
      meta: {
        title: "Registration",
      },
    },
    {
      path: "/settings",
      component: () => import("./views/user/Settings.vue"),
      meta: {
        title: "Settings",
        showBack: true,
        requiresAuth: true,
      },
    },
    {
      path: "/templates",
      component: () => import("./views/templates/Templates.vue"),
      meta: {
        title: "Templates",
        requiresAuth: true,
      },
    },
    {
      path: "/templates/new",
      component: () => import("./views/templates/CreateTemplate.vue"),
      meta: {
        title: "Create Template",
        showBack: true,
        requiresAuth: true,
      },
    },
    {
      path: "/:productId",
      meta: {
        requiresAuth: true,
        showStoryCreation: true,
      },
      children: [
        {
          path: "",
          component: () => import("./views/stories/Stories.vue"),
          meta: {
            title: "Stories",
            showProductPicker: true,
          },
        },
        {
          path: "edit",
          component: () => import("./views/product/ProductEditView.vue"),
          meta: {
            title: "Edit Product",
            showBack: true,
            requiresAuth: true,
          },
        },
        {
          path: "story/:id",
          component: () => import("./views/stories/Story.vue"),
          meta: {
            title: "Story",
            showBack: true,
            showProductPicker: true,
          },
        },
        {
          path: "story/new",
          component: () => import("./views/stories/CreateStory.vue"),
          meta: {
            showStoryCreation: false,
            title: "Create Story",
            showBack: true,
            showProductPicker: true,
          },
        },
      ],
    },
  ],
});

const protectedRoutes: string[] = [];
router.beforeEach((to, from, next) => {
  auth.authStateReady().then(() => {
    const { isLoggedIn } = useUser();
    if (
      (to.meta.requiresAuth || protectedRoutes.includes(to.path)) &&
      !isLoggedIn
    ) {
      next("/login");
    } else {
      next();
    }
  });
});
