<script setup lang="ts">
import { Cog8ToothIcon } from "@heroicons/vue/24/outline";
import { PhListChecks, PhUsers } from "@phosphor-icons/vue";
import { computed } from "vue";

import { useSelectedProductId } from "@/composables/useSelectedProduct";

const selectedProductId = useSelectedProductId();
const navigation = computed(() => {
  const baseUrl = `/${selectedProductId.value}`;

  return [
    { name: "Stories", href: `${baseUrl}`, icon: PhListChecks, current: true },
    {
      name: "Collaborators",
      href: `${baseUrl}/collaborators`,
      icon: PhUsers,
      current: false,
    },
    // { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
    // { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
    // { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
    {
      name: "Settings",
      href: `${baseUrl}/settings`,
      icon: Cog8ToothIcon,
      current: false,
    },
  ];
});
</script>

<template>
  <div class="flex">
    <nav class="flex flex-col border-r-2 pr-4" aria-label="Sidebar">
      <ul role="list" class="-mx-2 space-y-1">
        <li v-for="item in navigation" :key="item.name">
          <router-link
            :to="item.href"
            exact-active-class="bg-gray-50 text-indigo-600"
            class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
          >
            <component
              :is="item.icon"
              class="h-6 w-6 shrink-0 group-hover:text-indigo-600"
              aria-hidden="true"
            />
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="w-full px-2">
      <RouterView />
    </div>
  </div>
</template>
