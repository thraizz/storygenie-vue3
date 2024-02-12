<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

import BaseDropdown from "@/components/base/BaseDropdown.vue";
import { useSelectedProduct } from "@/composables/useSelectedProduct";
import { useProducts } from "@/stores/products";
import { ProductWithId } from "@/types/product";

const productStore = useProducts();
productStore.fetchItems();
const selectedProduct = useSelectedProduct();
const selectedOption = computed(() =>
  productStore.items.find(
    (item: ProductWithId) => item.id === selectedProduct.value,
  ),
);
const router = useRouter();
</script>

<template>
  <BaseDropdown
    class="min-w-60"
    :model-value="selectedOption"
    :options="productStore.items"
    :display-value="(item: any) => (item ? item.name : '')"
    placeholder="Select a product"
    @update:model-value="(value: ProductWithId) => router.push(`/${value.id}`)"
  />
</template>
