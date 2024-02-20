<script setup lang="ts">
import { ArrowLeftIcon } from "@heroicons/vue/20/solid";
import { computed } from "vue";
import { useRoute } from "vue-router";

import TopBar from "@/components/TopBar.vue";
import { useSelectedProductId } from "@/composables/useSelectedProduct";
import { useProducts } from "@/stores/useProducts";

const selectedProduct = useSelectedProductId();
const productStore = useProducts();
const product = computed(() =>
  productStore.getItem(selectedProduct.value.toString() || ""),
);

const route = useRoute();
const cta = computed(() => {
  if (route?.path === "/templates") {
    return {
      path: "/templates/new",
      text: "Create Template",
    };
  }
  if (route?.path === "/") {
    return {
      path: `/new`,
      text: "Create Product",
    };
  }
  if (route?.meta.showStoryCreation) {
    return {
      path: `/products/${selectedProduct.value}/story/new`,
      text: "Create Story",
    };
  }

  return undefined;
});

const title = computed(() => {
  if (route.meta.title) {
    return route.meta.title;
  } else if (route.meta.showProductAsTitle) {
    return product.value?.name;
  }

  return "";
});
</script>

<template>
  <div class="min-h-full">
    <div class="bg-slate-900 pb-32">
      <TopBar />

      <header
        class="mx-auto flex w-full max-w-7xl flex-row justify-between px-4 py-10 sm:px-6 lg:px-8"
      >
        <div class="h-20 max-w-7xl">
          <h1 class="self-center text-3xl font-bold tracking-tight text-white">
            {{ title }}
          </h1>

          <router-link
            v-if="$route.meta.showBack"
            to=".."
            class="flex items-center gap-1 text-indigo-200 hover:text-indigo-100"
          >
            <ArrowLeftIcon class="size-4" /> Back
          </router-link>
        </div>

        <router-link
          v-if="cta"
          :to="cta.path"
          class="flex h-min items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 hover:bg-opacity-75"
        >
          {{ cta.text }}
        </router-link>
      </header>
    </div>

    <main class="-mt-32">
      <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div class="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>
@/stores/useProducts
