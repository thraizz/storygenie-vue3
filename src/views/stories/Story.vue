<script lang="ts" setup>
import BaseMenu from "@/components/base/BaseMenu.vue";
import { useStories } from "@/stores/stories";
import { PaperClipIcon } from "@heroicons/vue/20/solid";
import { computed } from "vue";
import { useRoute } from "vue-router";

const storyStore = useStories();
storyStore.fetchItems();

const route = useRoute();
const story = computed(() =>
  storyStore.items.find((story) => story.id === route.params.id),
);
</script>

<template>
  <div v-if="story">
    <div class="mb-4 flex items-center justify-between">
      <h2>{{ story.headline }}</h2>
      <div class="flex items-center gap-4">
        <button class="button primary" @click="">Edit</button>
        <BaseMenu />
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
  </div>
</template>
