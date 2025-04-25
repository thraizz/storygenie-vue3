<script setup lang="ts">
import { PhArrowClockwise, PhCircleNotch, PhX } from "@phosphor-icons/vue";
import * as Sentry from "@sentry/vue";
import { httpsCallable } from "firebase/functions";
import { ref } from "vue";

import { useSelectedProductId } from "@/composables/useSelectedProduct";
import { functions } from "@/firebase";
import { StoryWithId } from "@/types/story";

const props = defineProps<{
  story: StoryWithId;
  isOpen: boolean;
  templateId: string;
}>();

const emit = defineEmits<{
  close: [];
  regenerated: [];
}>();

const feedback = ref("");
const isSubmitting = ref(false);
const error = ref("");
const selectedProductId = useSelectedProductId();

const regenerateStory = async () => {
  if (!feedback.value.trim()) {
    error.value = "Please provide feedback for regeneration";

    return;
  }

  error.value = "";
  isSubmitting.value = true;

  try {
    const regenerateStoryFn = httpsCallable(functions, "regeneratestory");
    await regenerateStoryFn({
      storyId: props.story.id,
      productId: selectedProductId.value,
      feedback: feedback.value,
      templateId: props.templateId,
    });

    emit("regenerated");
    emit("close");
  } catch (err: any) {
    console.error("Error regenerating story:", err);
    Sentry.captureException(err);
    error.value = "Failed to regenerate story";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
  >
    <form
      class="mx-4 flex max-h-[80vh] w-full max-w-lg flex-col rounded-lg bg-white shadow-xl"
      @submit.prevent="regenerateStory"
    >
      <div class="flex items-center justify-between border-b p-5">
        <h3 class="flex items-center text-lg font-medium text-gray-900">
          <PhArrowClockwise class="mr-2 h-5 w-5" />
          Regenerate Story
        </h3>

        <button
          class="text-gray-400 hover:text-gray-500"
          @click="emit('close')"
        >
          <PhX class="h-5 w-5" />
        </button>
      </div>

      <div class="flex-grow overflow-y-auto p-5">
        <p class="mb-4 text-sm text-gray-600">
          Describe the issues with the current story and what you'd like to
          change. The AI will generate a new version while preserving the
          appropriate aspects of the original.
        </p>

        <textarea
          v-model="feedback"
          class="h-40 w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          placeholder="What would you like to change about this story?"
        ></textarea>

        <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
      </div>

      <div class="flex justify-end gap-3 border-t p-5">
        <button
          class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          @click="emit('close')"
        >
          Cancel
        </button>

        <button
          :disabled="isSubmitting"
          class="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          @click="regenerateStory"
        >
          <PhCircleNotch
            v-if="isSubmitting"
            class="-ml-1 mr-2 h-4 w-4 animate-spin"
          />

          <span>{{ isSubmitting ? "Regenerating..." : "Regenerate" }}</span>
        </button>
      </div>
    </form>
  </div>
</template>
