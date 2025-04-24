<script setup lang="ts">
import { defineProps } from "vue";
import { RouteLocationRaw } from "vue-router";

type Props = {
  to: RouteLocationRaw;
};
defineProps<Props>();
</script>

<template>
  <router-link v-if="$props?.to" :to="$props.to" class="base-card">
    <slot />
  </router-link>

  <div v-else class="base-card">
    <slot />
  </div>
</template>

<style>
.base-card {
  @apply overflow-hidden rounded-xl border border-gray-200 transition hover:shadow-lg;
}
</style>
