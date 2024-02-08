<script setup lang="ts">
import BaseDropdown from "@/components/base/BaseDropdown.vue";
import { Field, useForm } from "vee-validate";
import { ref } from "vue";
import { string } from "yup";

const formSchema = {
  description: string().required().min(60),
};

const {} = useForm({ validationSchema: formSchema });
const templates = [
  { id: 1, name: "Template 1" },
  { id: 2, name: "Template 2" },
  { id: 3, name: "Template 3" },
];

const selectedTemplate = ref<{ id: number; name: string }>();
</script>

<template>
  Here goes the story creation.

  <div class="flex flex-col gap-4">
    <BaseDropdown
      :options="templates"
      :displayValue="(item) => item.name"
      label="Select a template"
      v-model="selectedTemplate"
    />
    <label
      class="text-base font-semibold leading-normal text-zinc-800"
      for="description"
    >
      Description
      <Field name="description" as="textarea" class="input" />
    </label>
  </div>
</template>
