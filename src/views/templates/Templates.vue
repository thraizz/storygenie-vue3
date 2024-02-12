<script setup lang="ts">
import { useTemplates } from "@/stores/templates";
const templateStore = useTemplates();
templateStore.fetchItems();
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Templates</h1>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <template v-for="template in templateStore.items" :key="template.id">
        <div class="flex flex-col gap-2 rounded-lg bg-gray-50 p-4">
          <h2 class="text-xl font-semibold tracking-tight text-slate-900">
            {{ template.name }}
          </h2>

          <p class="text-base text-slate-800">{{ template.description }}</p>
        </div>
      </template>
    </div>
  </div>
</template>
