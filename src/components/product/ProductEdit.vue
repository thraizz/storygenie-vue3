<script setup lang="ts">
import { PhCircleNotch } from "@phosphor-icons/vue";
import { ErrorMessage, Field, useForm } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useProducts } from "@/stores/useProducts";
import { ProductWithId } from "@/types/product";

import { ProductForm } from "./ProductCreationForm.vue";

const props = defineProps<{
  product: ProductWithId;
}>();

const { handleSubmit } = useForm<ProductForm>({
  initialValues: {
    description: props.product.description,
    name: props.product.name,
  },
});

const isLoading = ref(false);
const productStore = useProducts();
const router = useRouter();
const onSubmit = handleSubmit(
  // On Success
  async (values) => {
    isLoading.value = true;
    await productStore.putItem({
      ...props.product,
      ...values,
    });
    isLoading.value = false;
    router.push(`/${props.product.id}/`);
  },

  // Error
  () => {
    console.log("error");
  },
);
</script>

<template>
  <form class="flex flex-col gap-4" @submit="onSubmit">
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
      :class="[isLoading && 'is-loading']"
      type="submit"
    >
      <div v-if="isLoading" class="flex gap-1">
        <PhCircleNotch class="left-0 h-5 w-5 animate-spin self-center" />
        Saving product...
      </div>

      <div v-else>Save</div>
    </button>
  </form>
</template>
