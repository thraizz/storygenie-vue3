<script setup lang="ts">
import { object, string } from "yup";

const productCreationForm = object({
  name: string().required(),
  description: string().required(),
  jiraProjectId: string().required(),
});
</script>

<template>content goes here</template>
