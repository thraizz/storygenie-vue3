<script setup lang="ts">
import { MenuItem } from "@headlessui/vue";
import {
  ArrowPathIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/vue/20/solid";
import { Editor } from "@tiptap/vue-3";
import { ref } from "vue";
import { useRouter } from "vue-router";

import BaseMenu from "@//components/base/BaseMenu.vue";
import BaseModal from "@//components/base/BaseModal.vue";
import { useStories } from "@/stores/useStories";
import { useTemplates } from "@/stores/useTemplates";
import { StoryWithId } from "@/types/story";
import { copyStory } from "@/utils/story/copyStory";

import StoryRegenerateModal from "./StoryRegenerateModal.vue";
import StoryVersionHistory from "./StoryVersionHistory.vue";

const props = defineProps<{
  editor: Editor | undefined;
  story: StoryWithId;
  templateId?: string;
}>();
const isEditable = defineModel<boolean>("isEditable", { required: true });

const router = useRouter();
const showDeletionModal = ref(false);
const showRegenerateModal = ref(false);
const showVersionHistoryModal = ref(false);
const { deleteStory, putItem } = useStories();
const templateStore = useTemplates();

// Fetch templates if not already loaded
if (templateStore.items.length === 0) {
  templateStore.fetchItems();
}

const deleteStoryAndNavigate = () => {
  deleteStory(props.story).then(() => {
    router.push("..");
  });
};
</script>

<template>
  <BaseModal
    v-model="showDeletionModal"
    type="error"
    title="Delete Story"
    description="Are you sure you want to delete this story?"
    action="Delete"
    @confirm="deleteStoryAndNavigate"
  />

  <StoryRegenerateModal
    :story="story"
    :is-open="showRegenerateModal"
    :template-id="
      templateId ||
      (templateStore.items.length > 0 ? templateStore.items[0].id : '')
    "
    @close="showRegenerateModal = false"
  />

  <StoryVersionHistory
    :story="story"
    :is-open="showVersionHistoryModal"
    @close="showVersionHistoryModal = false"
  />

  <div class="relative mb-4 flex items-center justify-end">
    <div class="flex items-center justify-end gap-4">
      <button
        class="button primary flex items-center"
        @click="copyStory(story.id)"
      >
        <ClipboardDocumentIcon
          class="mr-3 h-5 w-5 text-white"
          aria-hidden="true"
        />

        <span>Copy</span>
      </button>

      <div v-if="editor">
        <button
          v-if="!editor.isEditable"
          class="button primary flex items-center"
          @click="
            isEditable = true;
            editor.setEditable(true);
          "
        >
          <PencilIcon class="mr-3 h-5 w-5 text-white" aria-hidden="true" />
          Edit
        </button>

        <button
          v-else
          class="button primary"
          @click="
            putItem({ ...story, content: editor.getJSON() as any });
            isEditable = false;
            editor.setEditable(false);
          "
        >
          Save
        </button>
      </div>

      <button
        class="button secondary flex items-center"
        @click="showRegenerateModal = true"
      >
        <ArrowPathIcon class="mr-1 h-4 w-4" aria-hidden="true" />
        Regenerate
      </button>

      <button
        class="button secondary flex items-center"
        @click="showVersionHistoryModal = true"
      >
        <ClockIcon class="mr-1 h-4 w-4" aria-hidden="true" />
        Versions
      </button>

      <BaseMenu>
        <MenuItem v-slot="{ active }">
          <a
            href="#"
            :class="[
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'flex px-4 py-2 text-sm',
            ]"
          >
            <ShareIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />

            <span>Share</span>
          </a>
        </MenuItem>

        <MenuItem v-slot="{ active }">
          <button
            :class="[
              active ? 'bg-gray-100 text-red-600' : 'text-red-500',
              'flex w-full px-4 py-2 text-sm',
            ]"
            @click="showDeletionModal = true"
          >
            <TrashIcon class="mr-3 h-5 w-5" aria-hidden="true" />

            <span>Delete Story</span>
          </button>
        </MenuItem>
      </BaseMenu>
    </div>
  </div>
</template>
