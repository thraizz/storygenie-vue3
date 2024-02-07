<script setup lang="ts">
import { useProducts } from "@/stores/products";
import { ProductWithId } from "@/types/product";
import BaseDropdown from "./base/BaseDropdown.vue";
import { useSelectedProduct } from "@/composables/useSelectedProduct";
import { useRouter } from "vue-router";
import { computed } from "vue";

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
    :modelValue="selectedOption"
    @update:modelValue="(value: ProductWithId) => router.push(`/${value.id}`)"
    :options="productStore.items"
    :displayValue="(item: any) => (item ? item.name : '')"
    placeholder="Select a product"
  />
</template>
