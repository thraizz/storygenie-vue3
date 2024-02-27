<script setup lang="ts">
import { useUser } from "@/stores/useUser";

const userStore = useUser();

const releaseNumber = import.meta.env.VITE_APP_VERSION || "0.0.0";
</script>

<template>
  <h3>User Settings</h3>

  <dl class="settings-grid">
    <dt>
      <h4>Email</h4>
    </dt>

    <dd>
      {{ userStore.user?.email }}
    </dd>

    <template v-if="userStore.user?.displayName">
      <dt>
        <h4>Name</h4>
      </dt>

      <dd>
        {{ userStore.user.displayName }}
      </dd>
    </template>

    <dt>
      <h4>UID</h4>
    </dt>

    <dd>
      {{ userStore.user?.uid }}
    </dd>

    <dt>
      <h4>Release:</h4>
    </dt>

    <dd>
      <p>{{ releaseNumber }}</p>
    </dd>
  </dl>
</template>

<style scoped lang="scss">
.settings-grid {
  @apply mt-5 grid max-w-md grid-cols-1 items-baseline gap-5;
  @media (min-width: 640px) {
    grid-template-columns: auto minmax(0, 1fr);
  }
  h4 {
    @apply text-lg font-medium leading-6 text-gray-900;
  }
  dd {
    @apply mt-2 text-base text-gray-500;
  }
}
</style>
