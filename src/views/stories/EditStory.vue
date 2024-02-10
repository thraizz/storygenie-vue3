<script setup lang="ts">
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
import { EditorContent, useEditor } from "@tiptap/vue-3";

const editor = useEditor({
  content: "<p>I’m running Tiptap with Vue.js. 🎉</p>",
  extensions: [Highlight, StarterKit, TaskList, TaskItem],
  editorProps: {
    attributes: {
      class: "prose prose-stone prose-base focus:outline-none p-2 pt-6",
    },
  },
});
</script>

<template>
  <h1>Edit Story</h1>
  <div class="editor">
    <div v-if="editor" class="editor-menu">
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
    <editor-content :editor="editor" />
  </div>
</template>

<style lang="scss">
.editor {
  @apply relative rounded-md border-2 border-gray-100;
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
