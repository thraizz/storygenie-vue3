<script setup lang="ts">
import { useStories } from "@/stores/stories";
import { Story, StoryWithId } from "@/types/story";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
import { faker } from "@faker-js/faker";
import { Timestamp } from "firebase/firestore";
import { useSelectedProduct } from "@/composables/useSelectedProduct";
import { computed } from "vue";
import { useRoute } from "vue-router";

defineProps<{
  items: StoryWithId[];
}>();

const storyStore = useStories();

const addRandomStory = () => {
  const story: Story = {
    headline:
      faker.commerce.productName() +
      " should be " +
      faker.commerce.productAdjective(),
    userStory: faker.lorem.paragraph(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  storyStore.createItem(story);
};
const selectedProduct = useSelectedProduct();
</script>
<template>
  <ul role="list" class="divide-y divide-gray-100">
    <li
      v-for="item in items"
      :key="item.id"
      class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 lg:px-8"
    >
      <h4 class="font-semibold text-gray-900">
        <router-link :to="`/${selectedProduct}/story/${item.id}`">
          {{ item.headline }}
        </router-link>
      </h4>
      <div class="flex shrink-0 items-center gap-x-4">
        <router-link :to="`/story/${item.id}`">
          <span class="sr-only">View story {{ item.headline }}</span>
          <ChevronRightIcon
            class="h-5 w-5 flex-none text-gray-400"
            aria-hidden="true"
          />
        </router-link>
      </div>
    </li>
  </ul>
  <div class="flex justify-end p-4">
    <button class="button primary" @click="() => addRandomStory()">
      Add random story
    </button>
  </div>
</template>
