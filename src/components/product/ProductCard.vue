<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { EllipsisHorizontalIcon } from "@heroicons/vue/20/solid";

import { useProducts } from "@/stores/useProducts";
import { ProductWithId } from "@/types/product";

const productStore = useProducts();
productStore.fetchItems();

defineProps({
  item: {
    type: Object as () => ProductWithId,
    required: true,
  },
});
</script>

<template>
  <router-link
    :key="item.id"
    :to="`/products/${item.id}`"
    class="overflow-hidden rounded-xl border border-gray-200 transition hover:shadow-lg"
  >
    <div
      class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6"
    >
      <div class="text-md font-semibold leading-6 text-gray-900">
        {{ item.name }}
        <span
          v-if="item.role === 'collaborator'"
          class="text-sm font-normal leading-5 text-gray-500"
          >(Collaborator)</span
        >
      </div>

      <Menu as="div" class="relative ml-auto">
        <MenuButton
          class="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">Open options</span>

          <EllipsisHorizontalIcon class="h-5 w-5" aria-hidden="true" />
        </MenuButton>

        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
          >
            <MenuItem v-slot="{ active }">
              <router-link
                :to="`/products/${item.id}/settings`"
                :class="[
                  active ? 'bg-gray-50' : '',
                  'block px-3 py-1 text-sm leading-6 text-gray-900',
                ]"
                >Edit<span class="sr-only">, {{ item.name }}</span></router-link
              >
            </MenuItem>

            <MenuItem v-slot="{ active }">
              <a
                href="#"
                :class="[
                  active ? 'bg-gray-50' : '',
                  'block px-3 py-1 text-sm leading-6 text-red-600',
                ]"
                >Delete</a
              >
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>

    <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
      <!-- Description -->
      <div class="py-3">
        <dt class="text-gray-500">Description</dt>

        <dd class="text-gray-700">{{ item.description }}</dd>
      </div>
      <!-- Creation data -->
      <div class="flex justify-between gap-x-4 py-3">
        <dt class="text-gray-500">Creation date</dt>

        <dd class="text-gray-700">
          <time :datetime="item.createdAt.toString()">{{
            item.createdAt.toDate().toLocaleString()
          }}</time>
        </dd>
      </div>
      <!-- Connected to -->
      <div class="flex justify-between gap-x-4 py-3">
        <dt class="text-gray-500">Connected to</dt>

        <dd class="flex items-start gap-x-2">
          <div class="font-medium text-gray-900">Jira</div>
        </dd>
      </div>
      <!-- Role -->
      <div class="flex justify-between gap-x-4 py-3">
        <dt class="text-gray-500">Role</dt>

        <dd class="text-gray-700">
          {{ item.role === "collaborator" ? "Collaborator" : "Owner" }}
        </dd>
      </div>
    </dl>
  </router-link>
</template>
