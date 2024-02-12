<script setup lang="ts">
import { watch } from "vue";

import StoryList from "@/components/story/StoryList.vue";
import { useSelectedProduct } from "@/composables/useSelectedProduct";
import { useStories } from "@/stores/stories";

const storyStore = useStories();
storyStore.fetchItems();

const selectedProduct = useSelectedProduct();
watch(
  () => selectedProduct.value,
  (id) => {
    console.log("fetching for ", id);
    console.log(selectedProduct);
    storyStore.fetchItems();
  },
);
</script>

<template>
  <StoryList :items="storyStore.items" />
</template>
