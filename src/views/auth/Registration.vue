<script setup lang="ts">
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useField, useForm } from "vee-validate";
import { watch } from "vue";
import { useRouter } from "vue-router";
import { string } from "yup";

import { auth } from "@/firebase";
import { logInWithFirebase, useUser } from "@/stores/useUser";

import Auth from "./Auth.vue";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};
const { handleSubmit, resetForm, setErrors } = useForm<FormData>({
  validationSchema: {
    email: string().required().email(),
    password: string().required().min(6),
    confirmPassword: string(),
  },
  initialValues: {
    email: "",
    password: "",
    confirmPassword: "",
  },
});

const router = useRouter();
const onSubmit = handleSubmit(
  // Success
  (values: FormData) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        logInWithFirebase(values.email, values.password);
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

const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");
const { value: confirmPassword, errorMessage: confirmPasswordError } =
  useField("confirmPassword");

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

          <div>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="input"
            />
          </div>

          <p v-if="emailError" class="error">{{ emailError }}</p>
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Password</label
          >

          <div>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="input"
            />
          </div>

          <p v-if="passwordError" class="error">{{ passwordError }}</p>
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Confirm Password</label
          >

          <div>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="input"
            />
          </div>

          <p v-if="confirmPasswordError" class="error">
            {{ confirmPasswordError }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <button type="submit" class="button primary w-full">Register</button>

          <router-link to="/login" class="button outlined w-full">
            Sign In
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
