<script setup lang="ts">
import { ErrorMessage, Field, useForm } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { string } from "yup";

import { useTemplates } from "@/stores/templates";

type FormSchema = {
  name: string;
  description: string;
};

const templateStore = useTemplates();
const formSchema = {
  name: string().required("Name is required."),
  description: string().required("Instruction is required."),
};

const { handleSubmit } = useForm<FormSchema>({
  validationSchema: formSchema,
});
const isLoading = ref(false);
const router = useRouter();
const onSubmit = handleSubmit(async (values: FormSchema) => {
  isLoading.value = true;
  await templateStore.postItem(values);
  isLoading.value = false;
  router.push("/templates");
});
</script>

<template>
  <form class="flex flex-col gap-4">
    <h3>Create Template</h3>

    <div>
      <label
        for="name"
        class="text-base font-semibold leading-normal text-zinc-800"
        >Name
        <Field id="name" name="name" class="input" />
      </label>

      <ErrorMessage name="name" class="error" />
    </div>

    <div>
      <label
        for="description"
        class="text-base font-semibold leading-normal text-zinc-800"
        >Instruction
        <Field
          id="description"
          name="description"
          as="textarea"
          class="input"
        />
      </label>
    </div>

    <button
      :disabled="isLoading"
      type="submit"
      class="button primary"
      :class="[isLoading && 'animate-pulse cursor-not-allowed opacity-50']"
      @click="onSubmit"
    >
      Create
    </button>
  </form>
</template>
