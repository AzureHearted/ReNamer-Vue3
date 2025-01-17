import "./styles/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { lazyVxeUI, lazyVxeTable } from "@/plugin/vxetable";

const app = createApp(App).use(lazyVxeUI).use(lazyVxeTable);

app.use(createPinia());
app.use(router);

app.mount("#app");
