<script setup lang="ts">
import {
  PhArrowClockwise,
  PhArrowCounterClockwise,
  PhClock,
} from "@phosphor-icons/vue";
import { format } from "date-fns";
import { computed, ref, watch } from "vue";

import { useStories } from "@/stores/useStories";
import { StoryVersionWithId, StoryWithId } from "@/types/story";

const props = defineProps<{
  story: StoryWithId;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  versionRestored: [];
}>();

const {
  storyVersions,
  isLoadingVersions,
  fetchVersions,
  restoreVersion: _restoreVersion,
} = useStories();
const isRestoring = ref(false);
const error = ref("");

// Computed property to safely access versions for the current story
const storyVersionsList = computed<StoryVersionWithId[]>(() => {
  if (!storyVersions.value || !props.story.id) {
    return [];
  }

  // Use a double type assertion to safely handle the ref value
  const versionsRecord = storyVersions.value as unknown as Record<
    string,
    StoryVersionWithId[]
  >;

  return versionsRecord[props.story.id] || [];
});

// Computed property to check if versions exist
const hasVersions = computed(() => {
  return storyVersionsList.value.length > 0;
});

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadVersions();
    }
  },
);

const loadVersions = async () => {
  try {
    await fetchVersions(props.story.id);
  } catch (err: any) {
    console.error("Error loading versions:", err);
    error.value = "Failed to load versions";
  }
};

const restoreVersion = async (versionId: string) => {
  error.value = "";
  isRestoring.value = true;

  try {
    await _restoreVersion(props.story.id, versionId);
    emit("versionRestored");
    emit("close");
  } catch (err: any) {
    console.error("Error restoring version:", err);
    error.value = err?.message || "Failed to restore version";
  } finally {
    isRestoring.value = false;
  }
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return "Unknown date";

  return format(timestamp.toDate(), "MMM d, yyyy h:mm a");
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
  >
    <div
      class="mx-4 flex max-h-[80vh] w-full max-w-lg flex-col rounded-lg bg-white shadow-xl"
    >
      <div class="flex items-center justify-between border-b p-5">
        <h3 class="flex items-center text-lg font-medium text-gray-900">
          <PhClock class="mr-2 h-5 w-5" />
          Version History
        </h3>

        <button
          class="text-gray-400 hover:text-gray-500"
          @click="emit('close')"
        >
          <span class="sr-only">Close</span>

          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="flex-grow overflow-y-auto p-5">
        <p v-if="isLoadingVersions" class="text-center text-gray-500">
          Loading versions...
        </p>

        <p v-else-if="!hasVersions" class="text-center text-gray-500">
          No previous versions found
        </p>

        <div v-else class="space-y-3">
          <div
            v-if="story.latestFeedback"
            class="mb-4 rounded-md bg-blue-50 p-3"
          >
            <p class="text-sm font-medium text-blue-800">Latest Feedback</p>

            <p class="mt-1 text-sm text-blue-700">{{ story.latestFeedback }}</p>
          </div>

          <div
            v-for="version in storyVersionsList"
            :key="version.id"
            class="rounded-md border p-3 hover:bg-gray-50"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">
                  Version from {{ formatDate(version.versionCreatedAt) }}
                </p>

                <p
                  v-if="version.latestFeedback"
                  class="mt-1 text-xs text-gray-500"
                >
                  Feedback: {{ version.latestFeedback }}
                </p>
              </div>

              <button
                :disabled="isRestoring"
                class="flex items-center text-xs text-blue-600 hover:text-blue-800"
                @click="restoreVersion(version.id)"
              >
                <PhArrowCounterClockwise
                  v-if="!isRestoring"
                  class="mr-1 h-4 w-4"
                />

                <PhArrowClockwise v-else class="mr-1 h-4 w-4 animate-spin" />
                {{ isRestoring ? "Restoring..." : "Restore this version" }}
              </button>
            </div>
          </div>
        </div>

        <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>
      </div>

      <div class="flex justify-end border-t p-5">
        <button
          class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
