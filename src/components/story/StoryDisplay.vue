<script setup lang="ts">
import { useSelectedProduct } from "@/composables/useSelectedProduct";
import { StoryWithId } from "@/types/story";
import { MenuItem } from "@headlessui/vue";
import { TrashIcon } from "@heroicons/vue/20/solid";
import BaseMenu from "../base/BaseMenu.vue";

defineProps<{
  story: StoryWithId;
}>();
const selectedProduct = useSelectedProduct();
</script>

<template>
  <div class="mb-4 flex items-center justify-between">
    <h2>{{ story.headline }}</h2>
    <div class="flex items-center gap-4">
      <router-link
        class="button primary"
        :to="`/${selectedProduct}/story/${story.id}/edit/`"
        >Edit</router-link
      >
      <BaseMenu>
        <MenuItem v-slot="{ active }">
          <a
            href="#"
            :class="[
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'flex px-4 py-2 text-sm',
            ]"
          >
            <ShareIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            <span>Share</span>
          </a>
        </MenuItem>
        <MenuItem v-slot="{ active }">
          <a
            href="#"
            :class="[
              active ? 'bg-gray-100 text-red-600' : 'text-red-500',
              'flex px-4 py-2 text-sm',
            ]"
          >
            <TrashIcon class="mr-3 h-5 w-5" aria-hidden="true" />
            <span>Delete Story</span>
          </a>
        </MenuItem>
      </BaseMenu>
    </div>
  </div>
  <div class="prose">
    <p class="text-lg font-medium leading-6 text-gray-900">User Story</p>
    <p>{{ story.userStory }}</p>
    <p class="text-lg font-medium leading-6 text-gray-900">
      Acceptance Criteria
    </p>
    <ul class="list-inside list-decimal">
      <li v-for="task in story.acceptanceCriteria" :key="task">
        {{ task }}
      </li>
    </ul>
  </div>
</template>
