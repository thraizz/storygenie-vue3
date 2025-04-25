<script setup lang="ts">
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "radix-vue";
import { defineProps } from "vue";

// Define component props
defineProps({
  tabs: {
    type: Array as () => Array<{ label: string; value: string }>,
    required: true,
  },
  tabContent: {
    type: Array as () => Array<{ value: string; slotName: string }>,
    required: true,
  },
  defaultTab: {
    type: String,
    default: "tab1",
  },
  ariaLabel: {
    type: String,
    default: "Manage your account",
  },
});
</script>

<template>
  <TabsRoot :default-value="defaultTab">
    <TabsList class="relative flex shrink-0 border-b" :aria-label="ariaLabel">
      <TabsIndicator
        class="absolute bottom-0 left-0 h-[2px] w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full px-8 transition-[width,transform] duration-300"
      >
        <div class="bg-grass8 h-full w-full" />
      </TabsIndicator>

      <TabsTrigger
        v-for="(tab, index) in tabs"
        :key="index"
        class="text-mauve11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 font-semibold leading-none hover:cursor-pointer hover:bg-gray-50 hover:text-indigo-600 focus-visible:relative data-[state=active]:text-indigo-600"
        :value="tab.value"
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>

    <TabsContent
      v-for="(content, index) in tabContent"
      :key="index"
      class="grow rounded-b-md bg-white p-5"
      :value="content.value"
    >
      <slot :name="content.slotName"></slot>
    </TabsContent>
  </TabsRoot>
</template>
