<script setup lang="ts">
import ProductCard from "@/components/product/ProductCard.vue";
import { useProducts } from "@/stores/useProducts";

const productStore = useProducts();
productStore.fetchIfEmpty();
</script>

<template>
  <p
    v-if="productStore.isLoading && productStore.items.length === 0"
    class="flex justify-center"
  >
    Loading products...
  </p>

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

  <p v-else-if="!productStore.isLoading">
    No products have been created yet.<br />
    Create a product by clicking the button above.
  </p>
</template>
