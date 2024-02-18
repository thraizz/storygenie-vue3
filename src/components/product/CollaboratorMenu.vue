<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { EllipsisVerticalIcon } from "@heroicons/vue/20/solid";
import { ref } from "vue";

import BaseModal from "@//components/base/BaseModal.vue";
import {
  CollaboratorWithId,
  useCollaborators,
} from "@/stores/useCollaborators";

const props = defineProps<{
  collaborator: CollaboratorWithId;
}>();

const collaboratorStore = useCollaborators();
const removeCollaborator = () => {
  collaboratorStore.deleteItem(props.collaborator);
};
const showDeletionModal = ref(false);
</script>

<template>
  <BaseModal
    v-model="showDeletionModal"
    type="error"
    title="Remove collaborator"
    description="Are you sure you want to remove this collaborator? This action cannot be undone."
    action="Remove"
    class="mt-3 flex flex-col gap-3"
    @confirm="removeCollaborator()"
    @cancel="showDeletionModal = false"
  />

  <div class="flex shrink-0 items-center gap-x-6">
    <Menu as="div" class="relative flex-none">
      <MenuButton class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
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
                >, {{ collaborator.name }}</span
              ></a
            >
          </MenuItem>

          <MenuItem v-slot="{ active }">
            <button
              class="w-full text-left"
              :class="[
                active ? 'bg-red-100 text-red-700' : 'text-red-600',
                'block px-3 py-1 text-sm leading-6',
              ]"
              @click="showDeletionModal = true"
            >
              <span v-if="collaborator.type === 'collaborator_invite'">
                Cancel invitation
              </span>

              <span v-else>Remove</span>

              <span class="sr-only">, {{ collaborator.name }}</span>
            </button>
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
