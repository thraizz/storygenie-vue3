<script setup lang="ts">
import { ErrorMessage, Field, useForm } from "vee-validate";
import { ref } from "vue";
import { string } from "yup";

import BaseModal from "@//components/base/BaseModal.vue";
import { useCollaborators } from "@/stores/useCollaborators";

const { handleSubmit } = useForm({
  initialValues: {
    name: "",
    email: "",
  },
  validationSchema: {
    name: string().required(),
    email: string().email().required(),
  },
});

const isLoading = ref(false);

const collaboratorStore = useCollaborators();

const onSubmit = handleSubmit(
  async (values) => {
    isLoading.value = true;
    await collaboratorStore.postItem(values);
    isLoading.value = false;
    open.value = false;
  },
  (errors) => {
    console.log("Validation failed!", errors);
  },
);

const formRef = ref<HTMLFormElement | null>(null);

const open = defineModel<boolean>();
</script>

<template>
  <BaseModal
    v-model="open"
    type="dialog"
    title="Add collaborator"
    description="Enter the name and email of the person you want to add as a collaborator."
    action="Add"
    class="mt-3 flex flex-col gap-3"
    hide-buttons
    @confirm="console.log(formRef)"
    @cancel="open = false"
  >
    <form ref="formRef" class="flex flex-col gap-2" @submit="onSubmit">
      <label class="label">
        <span>Name</span>

        <Field name="name" as="input" type="text" class="input" />

        <ErrorMessage name="name" class="error" />
      </label>

      <label class="label">
        <span>Email</span>

        <Field name="email" as="input" type="email" class="input" />

        <ErrorMessage name="email" class="error" />
      </label>

      <button
        type="submit"
        class="button primary mb-6 mt-4"
        :class="isLoading && 'is-loading'"
        :disabled="isLoading"
      >
        Add collaborator
      </button>
    </form>
  </BaseModal>
</template>
