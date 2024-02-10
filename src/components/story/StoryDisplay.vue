<script setup lang="ts">
import { useStories } from "@/stores/stories";
import { StoryWithId } from "@/types/story";
import { MenuItem } from "@headlessui/vue";
import { ShareIcon, TrashIcon } from "@heroicons/vue/20/solid";
import {
  PhCheckSquare,
  PhHighlighterCircle,
  PhListBullets,
  PhListNumbers,
  PhTextB,
  PhTextHOne,
  PhTextHThree,
  PhTextHTwo,
  PhTextItalic,
  PhTextStrikethrough,
} from "@phosphor-icons/vue";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, generateHTML, useEditor } from "@tiptap/vue-3";
import { ref } from "vue";
import BaseMenu from "../base/BaseMenu.vue";

const props = defineProps<{
  story: StoryWithId;
}>();

const editor = useEditor({
  content: generateHTML(props.story.content, [
    Highlight,
    StarterKit,
    TaskList,
    TaskItem,
  ]),
  extensions: [Highlight, StarterKit, TaskList, TaskItem],
  editorProps: {
    editable: () => isEditable.value,
    attributes: {
      class: "prose prose-stone prose-base focus:outline-none p-6",
    },
  },
});
const isEditable = ref(false);
const storyStore = useStories();
</script>

<template>
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
            console.log(story.id);
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
          <a
            href="#"
            :class="[
              active ? 'bg-gray-100 text-red-600' : 'text-red-500',
              'flex px-4 py-2 text-sm',
            ]"
          >
            <TrashIcon class="mr-3 h-5 w-5" aria-hidden="true" />
            <span>Delete Story</span>
          </a>
        </MenuItem>
      </BaseMenu>
    </div>
  </div>
  <div v-if="editor" class="flex flex-col gap-4">
    <div class="editor">
      <div v-if="isEditable" class="editor-menu">
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        >
          <span class="sr-only">h1</span>
          <PhTextHOne class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          <span class="sr-only">h2</span>
          <PhTextHTwo class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        >
          <span class="sr-only">h3</span>
          <PhTextHThree class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
        >
          <span class="sr-only">bold</span>
          <PhTextB class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          <span class="sr-only">italic</span>
          <PhTextItalic class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          <span class="sr-only">strike</span>
          <PhTextStrikethrough class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          @click="editor.chain().focus().toggleHighlight().run()"
          :class="{ 'is-active': editor.isActive('highlight') }"
        >
          <span class="sr-only">highlight</span>
          <PhHighlighterCircle class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          @click="editor.commands.toggleBulletList()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          <span class="sr-only">bullet list</span>
          <PhListBullets class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          @click="editor.commands.toggleOrderedList()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          <span class="sr-only">ordered list</span>
          <PhListNumbers class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          @click="editor.chain().focus().toggleTaskList().run()"
          :class="{ 'is-active': editor.isActive('taskList') }"
        >
          <span class="sr-only">task list</span>
          <PhCheckSquare class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<style lang="scss">
.editor {
  @apply gap-4 rounded-md border-2 border-gray-100;
  ul {
    display: flex;
    flex-direction: column;
    @apply space-y-2;
    p {
      margin: 0;
    }

    li {
      display: flex;
      align-items: center;
      margin: 0 !important;

      > label {
        align-self: flex-start;
        margin-right: 0.5rem;
        margin: 0;
        user-select: none;
        margin-right: 8px;
      }

      > div {
        flex: 1 1 auto;
        display: flex;
      }

      ul li,
      ol li {
        display: list-item;
      }

      ul[data-type="taskList"] > li {
        display: flex;
      }
      div {
        margin-bottom: 0 !important;
      }
    }
  }
}
.editor-menu {
  width: 100%;
  display: flex;
  gap: 4px;
  padding: 4px;
  @apply bg-gray-100;
  button {
    @apply cursor-pointer rounded-md  bg-gray-300 px-2 py-1 font-semibold text-black;
    &.is-active {
      @apply bg-gray-900 text-white;
    }
  }
}
</style>
