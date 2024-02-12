<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
import { ErrorMessage, Field, useForm } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { object, string } from "yup";

import { useProducts } from "@/stores/products";

export type ProductForm = {
  name: string;
  description: string;
};

const productCreationForm = object({
  name: string().required("The name is required."),
  description: string().required("The description is required."),
});

const { handleSubmit } = useForm<ProductForm>({
  validationSchema: productCreationForm,
});

const productStore = useProducts();

const isLoading = ref(false);
const router = useRouter();
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  const id = await productStore.postItem({
    ...values,
    createdAt: Timestamp.now(),
  });
  router.push(`/${id}`);
  isLoading.value = false;
});
</script>

<template>
  <form class="flex flex-col gap-4" @submit="onSubmit">
    <h3 class="text-lg leading-normal text-zinc-800">Create a new product</h3>

    <p class="text-md font-normal text-zinc-800">
      Fill in the form below to create a new product. The name will be used to
      identify the product. <br />
      The description will be used to provide context for generating stories, so
      be as descriptive but concise as possible.
    </p>

    <div>
      <label class="label" for="name"
        >Name
        <Field
          id="name"
          name="name"
          class="input"
          placeholder="Name of your product."
        />

        <ErrorMessage name="name" class="error" />
      </label>
    </div>

    <div>
      <label class="label" for="description"
        >Description
        <Field
          id="description"
          name="description"
          as="textarea"
          class="input"
          placeholder="Enter a long description of your Product here. The more descriptive, the better!"
        />

        <ErrorMessage name="description" class="error" />
      </label>
    </div>

    <button
      class="button primary"
      :class="[isLoading && 'animate-pulse cursor-not-allowed opacity-50']"
      type="submit"
    >
      Create
    </button>
  </form>
</template>
