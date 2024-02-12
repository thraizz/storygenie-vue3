<script setup lang="ts">
import { computed } from "vue";

import ProductEdit from "@/components/product/ProductEdit.vue";
import { useSelectedProduct } from "@/composables/useSelectedProduct";
import { useProducts } from "@/stores/products";
import { ProductWithId } from "@/types/product";

const productId = useSelectedProduct();
const productStore = useProducts();
const product = computed<ProductWithId | undefined>(() =>
  productStore.items.find((p) => productId.value === p.id),
);
</script>

<template>
  <ProductEdit v-if="product" :product="product" />
</template>
