<script setup lang="ts">
import { MenuItem } from "@headlessui/vue";
import {
  ClipboardDocumentIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/vue/20/solid";
import { Editor } from "@tiptap/vue-3";
import { ref } from "vue";
import { useRouter } from "vue-router";

import BaseMenu from "@//components/base/BaseMenu.vue";
import BaseModal from "@//components/base/BaseModal.vue";
import { useStories } from "@/stores/useStories";
import { StoryWithId } from "@/types/story";
import { copyStory } from "@/utils/story/copyStory";

const props = defineProps<{
  editor: Editor | undefined;
  story: StoryWithId;
}>();
const isEditable = defineModel<boolean>("isEditable", { required: true });

const router = useRouter();
const showDeletionModal = ref(false);
const storyStore = useStories();
const deleteStory = () => {
  storyStore.deleteStory(props.story).then(() => {
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
    @confirm="deleteStory"
  />

  <div class="relative mb-4 flex items-center justify-end">
    <div class="flex items-center justify-end gap-4">
      <div v-if="editor">
        <button
          v-if="!editor.isEditable"
          class="button primary"
          @click="
            isEditable = true;
            editor.setEditable(true);
          "
        >
          Edit
        </button>

        <button
          v-else
          class="button primary"
          @click="
            storyStore.putItem({ ...story, content: editor.getJSON() as any });
            isEditable = false;
            editor.setEditable(false);
          "
        >
          Save
        </button>
      </div>

      <BaseMenu>
        <MenuItem v-slot="{ active }">
          <button
            :class="[
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'flex w-full px-4 py-2 text-sm',
            ]"
            @click="copyStory(story.id)"
          >
            <ClipboardDocumentIcon
              class="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />

            <span>Copy</span>
          </button>
        </MenuItem>

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
