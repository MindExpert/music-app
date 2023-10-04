<template>
    <!-- Header -->
    <app-header />

    <router-view></router-view>

    <!-- <router-view v-slot="{ Component }"> -->
        <!-- <transition name="fade" mode="out-in"> -->
            <!-- <component :is="Component"></component> -->
        <!-- </transition> -->
    <!-- </router-view> -->

    <!-- Player -->
    <app-player />

    <!-- Auth Modal -->
    <auth />
</template>

<script>
import Auth from "@/components/Auth.vue";
import AppHeader from '@/components/AppHeader.vue';
import AppPlayer from "@/components/Player.vue";
import { mapWritableState } from "pinia";
import useUserStore from "@/stores/user";
import { auth } from "./includes/firebase";

export default {
    name: 'App',
    components: {
        Auth,
        AppHeader,
        AppPlayer,
    },
    computed: {
        ...mapWritableState(useUserStore, ["userLoggedIn"]),
    },
    data() {
        return {
            // ...
        }
    },
    methods: {
        // ...
    },
    created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  },
}
</script>

<style>
.fade-enter-from {
    opacity: 0;
}

.fade-enter-active {
    transition: all 0.5s linear;
}

.fade-leave-to {
    transition: all 0s lienar;
    opacity: 0;
}
</style>
