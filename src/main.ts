import "./style.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import LayoutVue from "./layout/Layout.vue";
import { router } from "./router";

const app = createApp(LayoutVue);

console.log("Hash: ", import.meta.env.VITE_TIMESTAMP_HASH || "no hash");

const pinia = createPinia();
app.use(pinia);

app.use(router);

app.mount("#app");
