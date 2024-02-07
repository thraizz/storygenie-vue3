<script setup lang="ts">
import StoryList from "@/components/StoryList.vue";
import { useStories } from "@/stores/stories";

const storyStore = useStories();
storyStore.fetchItems();
</script>

<template>
  Your Stories
  <StoryList :items="storyStore.items" />
</template>
