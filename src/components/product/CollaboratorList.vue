<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { EllipsisVerticalIcon } from "@heroicons/vue/20/solid";
import { UserCircleIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

import { useCollaborators } from "@/stores/useCollaborators";

import CollaboratorModal from "./CollaboratorModal.vue";

const collaboratorStore = useCollaborators();
collaboratorStore.fetchItems();
const open = ref(false);
</script>

<template>
  <CollaboratorModal v-model="open" />

  <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
    <div
      class="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap"
    >
      <div class="ml-4 mt-4">
        <h3 class="text-base font-semibold leading-6 text-gray-900">
          Collaborators
        </h3>

        <p class="mt-1 text-sm text-gray-500">
          Manage the people that have access to your project.
        </p>
      </div>

      <div class="ml-4 mt-4 flex-shrink-0">
        <button class="button primary" @click="open = true">
          Add collaborator
        </button>
      </div>
    </div>
  </div>

  <ul role="list" class="divide-y divide-gray-100 px-4">
    <li
      v-for="person in collaboratorStore.items"
      :key="person.id"
      class="flex justify-between gap-x-6 py-5"
    >
      <div class="flex min-w-0 gap-x-4">
        <UserCircleIcon
          class="h-12 w-12 flex-none rounded-full bg-gray-50 stroke-1"
        />

        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">
            {{ person.name }}
          </p>

          <p class="mt-1 flex text-xs leading-5 text-gray-500">
            {{ person.email }}
          </p>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-x-6">
        <Menu as="div" class="relative flex-none">
          <MenuButton
            class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900"
          >
            <span class="sr-only">Open options</span>

            <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
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
              class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
            >
              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  :class="[
                    active ? 'bg-gray-50' : '',
                    'block px-3 py-1 text-sm leading-6 text-gray-900',
                  ]"
                  >View profile<span class="sr-only"
                    >, {{ person.name }}</span
                  ></a
                >
              </MenuItem>

              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  :class="[
                    active ? 'bg-gray-50' : '',
                    'block px-3 py-1 text-sm leading-6 text-gray-900',
                  ]"
                  >Message<span class="sr-only">, {{ person.name }}</span></a
                >
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </li>
  </ul>
</template>
