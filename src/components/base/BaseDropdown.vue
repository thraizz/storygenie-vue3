<script setup lang="ts" generic="T extends string | object">
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { PhCaretDown, PhCheck } from "@phosphor-icons/vue";

withDefaults(
  defineProps<{
    id: string;
    options: T[];
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    displayValue: (item: T) => string;
  }>(),
  {
    disabled: false,
    placeholder: "Select an option",
    displayFunction: (item: any) => item.toString(),
    label: undefined,
  },
);

const selectedOption = defineModel<T>();

const calculateLinkItemStyle = (active: boolean, selected: boolean) => {
  if (active) {
    return "bg-gray-700 text-white";
  } else if (selected) {
    return "bg-slate-50";
  }

  return "text-gray-900";
};
</script>

<template>
  <Listbox
    v-slot="{ open }"
    v-model="selectedOption"
    as="div"
    :disabled="disabled"
  >
    <ListboxLabel
      v-if="label"
      class="label"
      :for="id"
      :class="disabled ? 'text-text-200' : 'text-zinc-800'"
    >
      {{ label }}
    </ListboxLabel>

    <div class="relative">
      <ListboxButton
        :id="id"
        class="flex w-full items-center justify-start gap-2 self-stretch border border-gray-400 bg-white px-3 py-2 text-sm"
        :class="disabled && 'bg-text-50 text-text-300'"
      >
        <span v-if="selectedOption"> {{ displayValue(selectedOption) }} </span>

        <span v-else class="font-normal text-zinc-500">{{ placeholder }}</span>

        <div
          class="absolute inset-y-0 right-0 flex items-center px-2 transition-transform"
          :class="open && 'rotate-180'"
        >
          <PhCaretDown class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </ListboxButton>

      <Transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white p-4 pr-3 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="option in options"
            v-slot="{ active: optionIsActive, selected: optionIsSelected }"
            :key="displayValue(option)"
            as="template"
            :value="option"
          >
            <li
              class="flex cursor-default select-none flex-row items-center rounded-md py-2 pl-3 pr-9"
              :class="calculateLinkItemStyle(optionIsActive, optionIsSelected)"
            >
              <span
                class="relative mr-2 flex h-4 w-4 items-center rounded border"
                :class="
                  optionIsSelected
                    ? 'border-transparent bg-indigo-500'
                    : 'border-gray-400 bg-white'
                "
              >
                <PhCheck
                  v-if="optionIsSelected"
                  class="text-white"
                  aria-hidden="true"
                />
              </span>

              <span
                :class="['block truncate', optionIsSelected && 'font-semibold']"
              >
                {{ displayValue(option) }}
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </Transition>
    </div>
  </Listbox>
</template>
