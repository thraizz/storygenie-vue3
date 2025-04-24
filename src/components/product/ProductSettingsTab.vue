<script setup lang="ts">
import BaseTab from "@/components/base/BaseTab.vue";
import ProductSettingsDetails from "@/components/product/ProductSettingsDetails.vue";

// Tabs Configuration
const tabs = [
  { label: "Product", value: "tab1" },
  { label: "Integrations", value: "tab2" },
];

const tabContent = [
  { value: "tab1", slotName: "account" },
  { value: "tab2", slotName: "integrations" },
];
</script>

<template>
  <BaseTab :tabs="tabs" :tab-content="tabContent" default-tab="tab1">
    <!-- Account Tab Content -->
    <template #account>
      <ProductSettingsDetails />
    </template>

    <template #integrations>
      <h3>Integrations</h3>

      <p>
        This is the integrations tab content. You can add your integrations
        here.
      </p>
    </template>
  </BaseTab>
</template>
