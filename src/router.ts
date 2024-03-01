import { createRouter, createWebHistory } from "vue-router";

import { auth } from "./firebase";
import { useUser } from "./stores/useUser";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/products",
      meta: {
        title: "Home",
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      component: () => import("./views/auth/Login.vue"),
      meta: {
        title: "Sign in to your account",
      },
    },
    {
      path: "/register",
      component: () => import("./views/auth/Registration.vue"),
      meta: {
        title: "Create an account",
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
      path: "/products/",
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          component: () => import("./views/product/ProductList.vue"),
          meta: {
            title: "Choose a product",
            requiresAuth: true,
          },
        },
        {
          path: "new",
          component: () => import("./views/product/ProductCreation.vue"),
          meta: {
            title: "Create Product",
            requiresAuth: true,
          },
        },
        {
          path: ":productId",
          component: () => import("./layout/Product.vue"),
          meta: {
            showProductPicker: true,
            showProductAsTitle: true,
            showStoryCreation: true,
          },
          children: [
            {
              path: "",
              component: () => import("./views/stories/StoryList.vue"),
              meta: {
                showProductPicker: true,
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
            {
              path: "settings",
              component: () => import("./views/product/ProductSettings.vue"),
              meta: {
                title: "Product Settings",
                showBack: true,
                requiresAuth: true,
              },
            },
            {
              path: "collaborators",
              children: [
                {
                  path: "",
                  component: () => import("./views/product/Collaborators.vue"),
                  meta: {
                    title: "Collaborators",
                    showBack: true,
                    requiresAuth: true,
                  },
                },
                {
                  path: "invite",
                  component: () =>
                    import("./views/product/InviteCollaborator.vue"),
                  meta: {
                    title: "Invite Collaborator",
                    showBack: true,
                    requiresAuth: true,
                  },
                },
              ],
            },
          ],
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
