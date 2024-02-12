import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import "./style.css";

const app = createApp(App);

console.log("Hash: ", import.meta.env.VITE_TIMESTAMP_HASH || "no hash");

const pinia = createPinia();
app.use(pinia);

app.use(router);

app.mount("#app");
