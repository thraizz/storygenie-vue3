<script setup lang="ts">
import { UserCircleIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";

import { useCollaborators } from "@/stores/useCollaborators";
import { useProducts } from "@/stores/useProducts";

import CollaboratorMenu from "./CollaboratorMenu.vue";
import CollaboratorModal from "./CollaboratorModal.vue";

const collaboratorStore = useCollaborators();
const productStore = useProducts();
collaboratorStore.fetchItems();
const open = ref(false);

const addCollaborator = () => {
  collaboratorStore.postItem({
    name: "Grass Olive",
    email: "grass.olive.342@example.com",
  });
};

const computedItems = computed(() => collaboratorStore.items);
const isDev = import.meta.env.DEV;
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

      <div
        v-if="productStore.selectedProduct?.role === 'owner'"
        class="ml-4 mt-4 flex flex-shrink-0 gap-2"
      >
        <button v-if="isDev" class="button outline" @click="addCollaborator">
          Instant add
        </button>

        <button class="button primary" @click="open = true">
          Add collaborator
        </button>
      </div>
    </div>
  </div>

  <p v-if="collaboratorStore.isLoading" class="pl-5 pt-2 text-sm text-gray-500">
    Loading...
  </p>

  <p
    v-else-if="computedItems.length === 0"
    class="pl-5 pt-2 text-sm text-gray-500"
  >
    No collaborators yet.
  </p>

  <ul v-else role="list" class="divide-y divide-gray-100 px-4">
    <li
      v-for="collaborator in computedItems"
      :key="collaborator.id"
      class="flex justify-between gap-x-6 py-5"
    >
      <div class="flex min-w-0 gap-x-4">
        <UserCircleIcon
          class="h-12 w-12 flex-none rounded-full bg-gray-50 stroke-1"
        />

        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">
            {{ collaborator.name }}
            <span
              v-if="collaborator.type === 'collaborator_invite'"
              class="text-xs text-indigo-400"
            >
              (Invited)
            </span>
          </p>

          <p class="mt-1 flex text-xs leading-5 text-gray-500">
            {{ collaborator.email }}
          </p>
        </div>
      </div>

      <CollaboratorMenu :collaborator="collaborator" />
    </li>
  </ul>
</template>
