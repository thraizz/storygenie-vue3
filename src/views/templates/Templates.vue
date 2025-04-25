<script setup lang="ts">
import BaseCard from "@/components/base/BaseCard.vue";
import { useTemplates } from "@/stores/useTemplates";

const { items: templates, isLoading } = useTemplates();
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Templates</h1>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <BaseCard v-if="isLoading" class="px-6 py-4">
        <h2 class="text-xl font-semibold tracking-tight text-slate-900">
          Loading...
        </h2>
      </BaseCard>

      <template
        v-for="template in templates"
        v-else-if="templates.length > 0"
        :key="template.id"
      >
        <BaseCard class="px-6 py-4" :to="`/templates/${template.id}`">
          <h2 class="text-xl font-semibold tracking-tight text-slate-900">
            {{ template.name }}
          </h2>

          <p class="text-slate-800">{{ template.description }}</p>
        </BaseCard>
      </template>

      <template v-else>
        <BaseCard disabled class="px-6 py-4">
          <h2 class="text-sm font-semibold tracking-tight text-slate-900">
            No templates found
          </h2>
        </BaseCard>
      </template>
    </div>
  </div>
</template>
