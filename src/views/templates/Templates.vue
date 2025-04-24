<script setup lang="ts">
import BaseCard from "@/components/base/BaseCard.vue";
import { useTemplates } from "@/stores/useTemplates";

const templateStore = useTemplates();
templateStore.fetchItems();
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Templates</h1>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <template v-for="template in templateStore.items" :key="template.id">
        <BaseCard class="px-6 py-4" :to="`/templates/${template.id}`">
          <h2 class="text-xl font-semibold tracking-tight text-slate-900">
            {{ template.name }}
          </h2>

          <p class="text-slate-800">{{ template.description }}</p>
        </BaseCard>
      </template>
    </div>
  </div>
</template>
