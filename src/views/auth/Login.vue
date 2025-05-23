<script setup lang="ts">
import { configure, useField, useForm } from "vee-validate";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { string } from "yup";

import GoogleSSO from "@/components/GoogleSSO.vue";
import { logInWithFirebase, useUser } from "@/stores/useUser";

import Auth from "./Auth.vue";

const router = useRouter();

type FormData = {
  email: string;
  password: string;
};
const { handleSubmit, resetForm, setErrors } = useForm<FormData>({
  validationSchema: {
    email: string().required().email(),
    password: string().required().min(6),
  },
});
configure({
  validateOnBlur: false, // controls if blur events should trigger validation with handleChange handler
  validateOnChange: false, // controls if change events should trigger validation with handleChange handler
  validateOnInput: false, // controls if input events should trigger validation with handleChange handler
  validateOnModelUpdate: false, // controls if update:modelValue events should trigger validation with handleChange handler
});

const onSubmit = handleSubmit(
  // Success
  (values: FormData) => {
    // handle form submission here
    logInWithFirebase(values.email, values.password)
      .then(() => {
        resetForm();
        router.push("/");
      })
      .catch(() => {
        setErrors({
          email: "Invalid email or password.",
          password: "Invalid email or password.",
        });
      });
  },
  // Failure
  (errors) => {
    console.log(errors);
  },
);

const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");

const { isLoggedIn } = useUser();

watch(
  () => isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      router.push("/");
    }
  },
);
</script>

<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <Auth />

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit="onSubmit">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Email address</label
          >

          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="input"
          />

          <p v-if="emailError" class="error">{{ emailError }}</p>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Password</label
            >

            <div class="text-sm">
              <router-link
                to="#"
                class="font-semibold text-indigo-600 hover:text-indigo-500"
                >Forgot password?
              </router-link>
            </div>
          </div>

          <input
            id="password"
            v-model="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="input"
          />

          <p v-if="passwordError" class="error">{{ passwordError }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <button type="submit" class="button primary w-full">Sign in</button>

          <router-link to="/register" class="button outlined w-full">
            Register
          </router-link>
        </div>
      </form>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-zinc-300" />
          </div>

          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-2 text-neutral-800">Or</span>
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <GoogleSSO />
        </div>
      </div>
    </div>
  </div>
</template>
