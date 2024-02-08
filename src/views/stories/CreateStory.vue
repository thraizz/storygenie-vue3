<script setup lang="ts">
import BaseDropdown from "@/components/base/BaseDropdown.vue";
import { useSelectedProduct } from "@/composables/useSelectedProduct";
import { functions } from "@/firebase";
import { router } from "@/router";
import { useTemplates } from "@/stores/templates";
import { useUser } from "@/stores/user";
import { Template, TemplateWithId } from "@/types/templates";
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
const { handleSubmit } = useForm<FormData>({ validationSchema: formSchema });

const templateStore = useTemplates();
templateStore.fetchItems();
const { user } = useUser();
const selectedProduct = useSelectedProduct();

const onSubmit = handleSubmit(
  // Success
  async (values: FormData) => {
    // handle form submission here
    const uid = await user?.getIdToken();
    const templateId = values.template.id;
    var addMessage = httpsCallable(functions, "generateStory");
    addMessage({
      uid,
      productId: selectedProduct.value,
      templateId: templateId,
      description: values.description,
    })
      .then((result: any) => {
        console.log("Story created successfully.");
        router.push(`/${selectedProduct.value}/story/${result.data?.result}`);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  // Failure
  (errors) => {
    console.log(errors);
  },
);
</script>

<template>
  <form class="flex flex-col gap-4" @submit="onSubmit">
    <div>
      <Field name="template" v-slot="{ value, handleChange }">
        <BaseDropdown
          :options="templateStore.items"
          :displayValue="(item) => item.name"
          label="Select a template"
          :modelValue="value"
          @update:modelValue="(value: TemplateWithId) => handleChange(value)"
        />
        <ErrorMessage name="template" class="error text-sm" />
      </Field>
    </div>
    <label
      class="text-base font-semibold leading-normal text-zinc-800"
      for="description"
    >
      Description
      <Field name="description" as="textarea" class="input" />
      <ErrorMessage name="description" class="error text-sm" />
    </label>

    <button type="submit" class="button primary">Create</button>
  </form>
</template>
