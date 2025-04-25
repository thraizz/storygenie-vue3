<script setup lang="ts">
import { useRouter } from "vue-router";

import BaseDropdown from "@/components/base/BaseDropdown.vue";
import { useProducts } from "@/stores/useProducts";
import { ProductWithId } from "@/types/product";

const productStore = useProducts();

const router = useRouter();
</script>

<template>
  <BaseDropdown
    id="product-dropdown"
    class="min-w-60"
    :model-value="productStore.selectedProduct"
    :options="productStore.items"
    :display-value="(item: any) => (item ? item.name : '')"
    placeholder="Select a product"
    @update:model-value="
      (value) => {
        if (value) {
          router.push(`/products/${(value as ProductWithId).id}`);
        }
      }
    "
  />
</template>
