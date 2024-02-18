<script setup lang="ts">
import { useUser } from "@/stores/useUser";

const userStore = useUser();
</script>

<template>
  <h3>User Settings</h3>

  <h4>Email</h4>

  <p>{{ userStore.user?.email }}</p>

  <h4>Name</h4>

  <p>{{ userStore.user?.displayName }}</p>

  <h4>UID</h4>

  <p>{{ userStore.user?.uid }}</p>
</template>
