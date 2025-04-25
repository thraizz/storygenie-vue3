<script setup lang="ts">
import { useRoute } from "vue-router";

import TemplateView from "@/components/template/TemplateView.vue";

const route = useRoute();
const id = route.params.id;
</script>

<template>
  <TemplateView :id="id" />
</template>
