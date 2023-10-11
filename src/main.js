import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VeeValidatePlugin from "./includes/validation";
import { auth } from "./includes/firebase";
import Icon from "./directives/icon";
import i18n from "./includes/i18n";
// import { registerSW } from 'virtual:pwa-register';

import "./assets/base.css";
import "./assets/main.css";

let app;

// const { install } = registerSW({immediate: true});
// install({ onNeedRefresh: () => location.reload() });

auth.onAuthStateChanged(() => {
    // Because the event might be thrown multiple times
    if (!app) {
        app = createApp(App);

        app.use(createPinia());
        app.use(router);
        app.use(VeeValidatePlugin);
        app.use(i18n);
        app.directive("icon", Icon);

        // Registering Plugins Must be performed before mounting the instance
        app.mount('#app')
    }
});