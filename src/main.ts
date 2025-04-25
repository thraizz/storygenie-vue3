import "./style.css";

import * as Sentry from "@sentry/vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { VueFire, VueFireAuth, VueFireFirestoreOptionsAPI } from "vuefire";

import { app as firebaseApp } from "./firebase";
import LayoutVue from "./layout/Layout.vue";
import { router } from "./router";

const app = createApp(LayoutVue);

console.log("Hash: ", import.meta.env.VITE_TIMESTAMP_HASH || "no hash");

const pinia = createPinia();
app.use(pinia);

Sentry.init({
  app,
  dsn: "https://dc1ef97395a18c3984f5cc0922262ce4@o4504645960138752.ingest.us.sentry.io/4509213127802880",
  sendDefaultPii: false,
});

// Use VueFire with the firebase app
app.use(VueFire, {
  firebaseApp,
  modules: [
    // Enable authentication features
    VueFireAuth(),
    // Enable Firestore
    VueFireFirestoreOptionsAPI(),
  ],
});

app.use(router);

app.mount("#app");
