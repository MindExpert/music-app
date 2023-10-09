<template>
    <main>
        <!-- Music Header -->
        <section class="w-full mb-8 py-14 text-center text-white relative">
            <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg" 
                style="background-image: url(/assets/img/song-header.png)"></div>
            <div class="container mx-auto flex items-center">
                <!-- Play/Pause Button -->
                <button type="button" 
                    @click.prevent="newSong(song)"
                    class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none">
                    <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
                </button>

                <div class="z-50 text-left ml-8">
                    <!-- Song Info -->
                    <div class="text-3xl font-bold">{{ song.modified_name}}</div>
                    <div>{{ song.genre}}</div>
                </div>
            </div>
        </section>

        <!-- Form -->
        <section class="container mx-auto mt-6" id="comments">
            <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                    <!-- Comment Count -->
                    <span class="card-title">{{ 
                        $tc("song.comment_count", song.comment_count, { 
                            count: song.comment_count
                        }) 
                    }}</span>
                    <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
                </div>

                <div class="p-6">
                    <!-- Alert Mesage -->
                    <div
                        v-if="comment_show_alert"
                        :class="comment_alert_variant"
                        class="mb-3 py-1.5 px-3 rounded text-white text-center font-bold"
                    >
                        {{ comment_alert_message }}
                    </div>

                    <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
                        <vee-field 
                            as="textarea" 
                            name="comment"
                            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
                            placeholder="Your comment here..."
                        ></vee-field>
                        <ErrorMessage name="comment" class="text-red-600" />

                        <button 
                            type="submit" 
                            class="py-1.5 px-3 rounded text-white bg-green-600 block"
                            :disabled="comment_in_submission"
                        >
                            Submit
                        </button>
                    </vee-form>

                    <!-- Sort Comments -->
                    <select v-model="sort"
                        class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
                        <option value="1">Latest</option>
                        <option value="2">Oldest</option>
                    </select>
                </div>
            </div>
        </section>

        <!-- Comments -->
        <ul class="container mx-auto">
            <li class="p-6 bg-gray-50 border border-gray-200" 
                v-for="comment in sortedComments"
                :key="comment.docId"
            >
                <!-- Comment Author -->
                <div class="mb-5">
                    <div class="font-bold">{{ comment.name}}</div>
                    <time>{{ comment.created_at}}</time>
                </div>

                <p>{{ comment.content }}</p>
            </li>
        </ul>
    </main>
</template>

<script>
import { songsCollection, commentsCollection, auth } from "@/includes/firebase";
import { ErrorMessage } from "vee-validate";
import { mapState, mapActions } from "pinia";
import useUserStore from "@/stores/user";
import  usePlayerStore from "@/stores/player";

export default {
    name: "Song",
    components: { 
        ErrorMessage 
    },
    data() {
        return {
            song: {},
            comments: [],
            schema: {
                comment: 'required|min:3',
            },
            comment_in_submission: false,
            comment_show_alert: false,
            comment_alert_variant: "bg-red-500",
            comment_alert_message: "Please wait... Comment is being Submitted!",
            sort: '1', 
        };
    },
    computed: {
        ...mapState(useUserStore, ["userLoggedIn"]),
        ...mapState(usePlayerStore, ["playing"]),
        sortedComments() {
            return this.comments.slice().sort((a, b) => {
                 // Latest to Oldest (desc)
                if(this.sort === '1') {
                    return new Date(b.created_at) - new Date(a.created_at);
                }

                // Oldest to Latest (asc)
                return new Date(a.created_at) - new Date(b.created_at);
            });
        }
    },
    async created() {
        // doc() retrieves a SINGLE document by its ID, where() retrives a group of DATA
        const docSnapshot = await songsCollection.doc(this.$route.params.id).get();

        if(! docSnapshot.exists) {
            this.$route.push({ name: 'home'});
            return;
        }

        const { sort } = this.$route.query;

        this.sort = (sort === '1' || sort === '2') ? sort : '1';

        this.song = docSnapshot.data();
        this.getComments();
    },
    methods: {
        // Map actions
        ...mapActions(usePlayerStore, ["newSong"]),
        // Second argumnt hold information about the form. We are interested only on reseting the form 
        async addComment(values, { resetForm }) {
            this.comment_in_submission = true;
            this.comment_show_alert = true;
            this.comment_alert_variant = "bg-blue-500";
            this.comment_alert_message = "Please wait... Comment is being Submitted!";

            const comment = {
                content: values.comment,
                created_at: new Date().toString(),
                sid: this.$route.params.id,
                name: auth.currentUser.displayName,
                uid: auth.currentUser.uid,
            };

            try {
                await commentsCollection.add(comment);

                this.song.comment_count += 1;

                await songsCollection.doc(this.$route.params.id).update({
                    comment_count: this.song.comment_count,
                });

                this.comment_alert_variant = "bg-green-500";
                this.comment_alert_message = "Comment has been added successfully!";
            } catch (error) {
                this.comment_alert_variant = "bg-red-500";
                this.comment_alert_message = error.message;
            } finally {
                this.comment_in_submission = false;
                resetForm();
            }

            this.getComments();
        },
        async getComments() {
            const commentsSnapshots = await commentsCollection
                .where("sid", "==", this.$route.params.id)
                .get(); 

            this.comments = [];

            commentsSnapshots.forEach((doc) => {
                this.comments.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            //this.song.comment_count = this.comments.length;
        },
    },
    watch: {
        sort(newVal) {
            // prevent from updating the route if query parameter already matches the sort value
            if(newVal === this.$route.query.sort){
                return;
            }

            this.$router.push({
                name: 'song',
                params: { id: this.$route.params.id },
                query: { sort: newVal }
            });
        }
    }
};
</script>
