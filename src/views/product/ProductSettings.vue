<script setup lang="ts">
import ProductEdit from "@/components/product/ProductEdit.vue";
import { useProducts } from "@/stores/useProducts";

import ProductDisplay from "./ProductDisplay.vue";

const productStore = useProducts();
</script>

<template>
  <div v-if="productStore.selectedProduct">
    <ProductEdit
      v-if="productStore.selectedProduct.role === 'owner'"
      :product="productStore.selectedProduct"
    />

    <ProductDisplay v-else :product="productStore.selectedProduct" />
  </div>
</template>
