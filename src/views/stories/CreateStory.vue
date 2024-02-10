<script setup lang="ts">
import BaseDropdown from "@/components/base/BaseDropdown.vue";
import { useSelectedProduct } from "@/composables/useSelectedProduct";
import { functions } from "@/firebase";
import { router } from "@/router";
import { useTemplates } from "@/stores/templates";
import { useUser } from "@/stores/user";
import { TemplateWithId } from "@/types/templates";
import { PhCircleNotch } from "@phosphor-icons/vue";
import { httpsCallable } from "firebase/functions";
import { ErrorMessage, Field, useForm } from "vee-validate";
import { ref } from "vue";
import { object, string } from "yup";

const formSchema = {
  template: object()
    .shape({
      id: string(),
      name: string().required(
        "Please select a template to create your story with.",
      ),
      description: string(),
    })
    .required("Please select a template."),
  description: string()
    .required("Please enter a description for the story.")
    .min(10, "Description must be at least 10 characters."),
};
type FormData = {
  description: string;
  template: TemplateWithId;
};
const { handleSubmit } = useForm<FormData>({
  validationSchema: formSchema,
});

const templateStore = useTemplates();
templateStore.fetchItems();
const { user } = useUser();
const selectedProduct = useSelectedProduct();

const isLoading = ref(false);
const onSubmit = handleSubmit(
  // Success
  async (values: FormData) => {
    isLoading.value = true;
    // handle form submission here
    const uid = await user?.getIdToken();
    const templateId = values.template.id;
    var addMessage = httpsCallable(functions, "generatestory");
    addMessage({
      uid,
      productId: selectedProduct.value,
      templateId: templateId,
      description: values.description,
    })
      .then((result: any) => {
        console.log("Story created successfully.");
        router.push(`/${selectedProduct.value}/story/${result.data?.result}`);
        isLoading.value = false;
      })
      .catch((error) => {
        console.error(error);
        isLoading.value = false;
      });
  },
  // Failure
  (errors) => {
    console.log(errors);
  },
);
</script>

<template>
  <form :disabled="isLoading" class="flex flex-col gap-4" @submit="onSubmit">
    <h3 class="text-lg leading-normal text-zinc-800">
      Create a new story based on a template
    </h3>
    <p class="text-md font-normal text-zinc-800">
      Select a template to create a story with. You can choose from a list of
      predefined templates. The template will define the structure and focus of
      the generated story. The description will be used to describe the idea of
      your story. It should be short and precise, with all details included.
    </p>
    <div>
      <Field name="template" v-slot="{ value, handleChange }">
        <BaseDropdown
          :options="templateStore.items"
          :displayValue="(item) => item.name"
          label="Select a template"
          :modelValue="value"
          @update:modelValue="(value: TemplateWithId) => handleChange(value)"
        />
        <ErrorMessage name="template" class="error" />
      </Field>
    </div>
    <label class="label" for="description">
      Description
      <Field
        placeholder="Describe the idea of your story here."
        name="description"
        as="textarea"
        class="input"
      />
      <ErrorMessage name="description" class="error" />
    </label>

    <button
      class="button primary relative"
      :class="[isLoading && 'animate-pulse cursor-not-allowed opacity-80']"
      type="submit"
      :disabled="isLoading"
    >
      <div v-if="isLoading" class="flex gap-1">
        <PhCircleNotch class="left-0 h-5 w-5 animate-spin self-center" />
        Generating story...
      </div>
      <div v-else>Create</div>
    </button>
  </form>
</template>
