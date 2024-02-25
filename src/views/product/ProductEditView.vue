<script setup lang="ts">
import { computed } from "vue";

import ProductEdit from "@/components/product/ProductEdit.vue";
import { useSelectedProductId } from "@/composables/useSelectedProduct";
import { useProducts } from "@/stores/useProducts";
import { ProductWithId } from "@/types/product";

import ProductDisplay from "./ProductDisplay.vue";

const productId = useSelectedProductId();
const productStore = useProducts();
const product = computed<ProductWithId | undefined>(() =>
  productStore.items.find((p) => productId.value === p.id),
);
</script>

<template>
  <div v-if="product">
    <ProductEdit v-if="product.role === 'owner'" :product="product" />

    <ProductDisplay v-else :product="product" />
  </div>
</template>
