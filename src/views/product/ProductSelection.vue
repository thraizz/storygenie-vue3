<script setup lang="ts">
import ProductCard from "@/components/product/ProductCard.vue";
import { useProducts } from "@/stores/useProducts";
import { useStories } from "@/stores/useStories";

const productStore = useProducts();

const storyStore = useStories();
storyStore.items = [];
</script>

<template>
  <h3 class="mb-4 text-lg font-semibold leading-3">Select a product</h3>

  <ul
    v-if="productStore.items.length > 0"
    role="list"
    class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
  >
    <ProductCard
      v-for="item in productStore.items"
      :key="item.id"
      :item="item"
    />
  </ul>

  <p v-else>
    No products have been created yet.<br />
    Create a product by clicking the button above.
  </p>
</template>
