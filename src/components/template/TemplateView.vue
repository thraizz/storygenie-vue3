<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { useTemplates } from "@/stores/useTemplates";

const route = useRoute();
const templateId = route.params.templateId;

const { items: templates } = useTemplates();

const template = computed(() =>
  templates.value.find((template) => template.id === templateId),
);
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <!-- Template Header -->
      <div class="border-b pb-4">
        <h1 class="mb-2 text-3xl font-bold text-gray-900">
          {{ template?.name || "Loading..." }}
        </h1>
      </div>

      <!-- Template Description -->
      <div class="space-y-2">
        <h2 class="text-sm font-medium uppercase tracking-wide text-gray-500">
          Description
        </h2>

        <p class="text-lg leading-relaxed text-gray-800">
          {{ template?.description || "No description available" }}
        </p>
      </div>

      <!-- Additional template details can be added here -->
    </div>
  </div>
</template>
