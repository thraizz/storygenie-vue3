<script setup lang="ts">
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

import { useSelectedProductId } from "@/composables/useSelectedProduct";
import { useStories } from "@/stores/useStories";
import { getHeadlineFromDoc } from "@/types/story";
const { items, isLoading } = useStories();

const selectedProductId = useSelectedProductId();
</script>

<template>
  <p v-if="isLoading">Loading stories...</p>

  <ul v-else-if="items.length > 0" role="list" class="divide-y divide-gray-100">
    <li
      v-for="item in items"
      :key="item.id"
      class="relative flex justify-between gap-x-6 rounded-lg px-4 py-5 hover:bg-gray-50 sm:px-6 lg:px-8"
    >
      <p class="text-lg font-medium leading-6 text-gray-900">
        <router-link :to="`/products/${selectedProductId}/story/${item.id}`">
          {{ getHeadlineFromDoc(item.content) }}
        </router-link>
      </p>

      <div class="flex shrink-0 items-center gap-x-4">
        <router-link :to="`/products/${selectedProductId}/story/${item.id}`">
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

  <p v-else>
    No stories have been created yet.<br />
    Create a story by clicking the button above.
  </p>
</template>
