<script setup lang="ts">
import ProductCard from "@/components/ProductCard.vue";
import { useProducts } from "@/stores/products";
import { useStories } from "@/stores/stories";

const productStore = useProducts();
productStore.fetchItems();

const storyStore = useStories();
storyStore.items = [];
</script>

<template>
  <div>
    <h4 class="mb-4">Select a product</h4>
  </div>
  <ul
    role="list"
    class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
  >
    <ProductCard v-for="item in productStore.items" :item="item" />
  </ul>
</template>
