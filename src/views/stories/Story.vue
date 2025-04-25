<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import StoryDisplay from "@/components/story/StoryDisplay.vue";
import { useStories } from "@/stores/useStories";

const { items, isLoading } = useStories();
const notFound = ref(false);

const route = useRoute();
const storyId = computed(() => route.params.id as string);

const story = computed(() =>
  items.value.find((story) => story.id === storyId.value),
);
</script>

<template>
  <div v-if="story" class="px-4">
    <StoryDisplay :story="story" />
  </div>

  <div v-else-if="isLoading" class="flex justify-center">
    <p>Loading story...</p>
  </div>

  <div v-else-if="notFound" class="flex justify-center">
    <p>Story not found.</p>
  </div>
</template>
