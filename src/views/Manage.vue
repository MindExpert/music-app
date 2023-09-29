<template>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
        <div class="md:grid md:grid-cols-3 md:gap-4">
            <div class="col-span-1">
                <app-upload ref="upload"/>
            </div> 
            <div class="col-span-2">
                <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                        <span class="card-title">My Songs</span>
                        <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
                    </div>
                    <div class="p-6">
                        <!-- Composition Items -->
                        <composition-item v-for="song in songs" :key="song.docId" :song="song"/>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
  
<script>
import AppUpload from '../components/Upload.vue';
import CompositionItem from '../components/CompositionItem.vue';
import { songsCollection, auth } from "@/includes/firebase";

export default {
    name: "Manage",
    components: {
        AppUpload,
        CompositionItem,
    },
    data() {
        return {
            songs: []
        }
    },
    async created() {
        const userId = auth.currentUser.uid;

        const querySnapshot = await songsCollection.where("uid", "==", userId).get();

        querySnapshot.forEach((document) => {
            console.log(document.id, " => ", document.data());
            const song = {
                docId: document.id,
                ...document.data()
            };

            this.songs.push(song);
        });
    }
    //beforeRouteEnter(to, from, next) {
    //   const store = useUserStore();
    //   if (store.userLoggedIn) {
    //        next();
    //   } else {
    //        next({ name: "home" });
    //   }
    //},
    //beforeRouteLeave (to, from, next) {
    //    this.$refs.upload.cancelUploads;
    //    next();
    //}
};
</script>
  