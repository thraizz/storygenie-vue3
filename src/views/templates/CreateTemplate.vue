<script setup lang="ts">
import { PhCircleNotch } from "@phosphor-icons/vue";
import { ErrorMessage, Field, useForm } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { string } from "yup";

import { useTemplates } from "@/stores/useTemplates";

type FormSchema = {
  name: string;
  description: string;
};

const templateStore = useTemplates();
templateStore.fetchItems();
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
  <form :disabled="isLoading" class="flex flex-col gap-4" @submit="onSubmit">
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
      class="button primary"
      :class="[isLoading && 'is-loading']"
      type="submit"
      :disabled="isLoading"
    >
      <div v-if="isLoading" class="flex gap-1">
        <PhCircleNotch class="left-0 h-5 w-5 animate-spin self-center" />
        Creating template...
      </div>

      <div v-else>Create</div>
    </button>
  </form>
</template>
