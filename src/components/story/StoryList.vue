<script setup lang="ts">
import { useSelectedProduct } from "@/composables/useSelectedProduct";
import { StoryWithId, getHeadlineFromDoc } from "@/types/story";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

defineProps<{
  items: StoryWithId[];
}>();

const selectedProduct = useSelectedProduct();
</script>
<template>
  <p v-if="items.length === 0">
    No stories have been created for this product yet.
  </p>
  <ul v-else role="list" class="divide-y divide-gray-100">
    <li
      v-for="item in items"
      :key="item.id"
      class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 lg:px-8"
    >
      <p class="text-lg font-medium leading-6 text-gray-900">
        <router-link :to="`/${selectedProduct}/story/${item.id}`">
          {{ getHeadlineFromDoc(item.content) }}
        </router-link>
      </p>
      <div class="flex shrink-0 items-center gap-x-4">
        <router-link :to="`/story/${item.id}`">
          <span class="sr-only"
            >View story {{ getHeadlineFromDoc(item.content) }}</span
          >
          <ChevronRightIcon
            class="h-5 w-5 flex-none text-gray-400"
            aria-hidden="true"
          />
        </router-link>
      </div>
    </li>
  </ul>
</template>
