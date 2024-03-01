<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import StoryDisplay from "@/components/story/StoryDisplay.vue";
import { useStories } from "@/stores/useStories";

const storyStore = useStories();
storyStore.fetchIfEmpty();

const route = useRoute();
const story = computed(() =>
  storyStore.items.find((story) => story.id === route.params.id),
);
</script>

<template>
  <div v-if="story" class="px-4">
    <StoryDisplay :story="story" />
  </div>

  <div v-else-if="storyStore.isLoading" class="flex justify-center">
    <p>Loading stories...</p>
  </div>

  <div v-else class="flex justify-center">
    <p>Story not found.</p>
  </div>
</template>
