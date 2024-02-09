<script setup lang="ts">
import StoryList from "@/components/story/StoryList.vue";
import { useSelectedProduct } from "@/composables/useSelectedProduct";
import { useStories } from "@/stores/stories";
import { watch } from "vue";

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
