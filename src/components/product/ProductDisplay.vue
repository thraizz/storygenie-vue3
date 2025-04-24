<script setup lang="ts">
import { ProductWithId } from "@/types/product";

defineProps<{
  product: ProductWithId;
}>();
</script>

<template>
  <div>
    <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <dt class="text-sm font-medium text-gray-500">Name</dt>

        <dd class="mt-1 text-sm text-gray-900">{{ product.name }}</dd>
      </div>

      <div class="sm:col-span-2">
        <dt class="text-sm font-medium text-gray-500">Description</dt>

        <dd class="mt-1 text-sm text-gray-900">{{ product.description }}</dd>
      </div>
    </dl>

    <p class="mt-4 text-sm text-gray-500">
      Since you are not the owner of this product, you cannot edit it.
    </p>
  </div>
</template>
