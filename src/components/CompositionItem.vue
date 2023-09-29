<template>
    <div class="border border-gray-200 p-3 mb-4 rounded">
        <div v-show="!showForm">
            <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
                <i class="fa fa-times"></i>
            </button>
            <button
                class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                @click.prevent="showForm = !showForm"
            >
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>
        <div v-show="showForm">
            <!-- Alert Mesage -->
            <div
                v-if="show_alert"
                :class="alert_variant"
                class="mb-3 py-1.5 px-3 rounded text-white text-center font-bold"
            >
                {{ alert_message }}
            </div>

            <vee-form :validation-schema="schema" @submit="edit" :initial-values="song">
                <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <vee-field
                        type="text"
                        name="modified_name"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Song Title"
                    />
                    <ErrorMessage name="modified_name" class="text-red-600" />
                </div>
                <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <vee-field
                        type="text"
                        name="genre"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Genre"
                    />
                    <ErrorMessage name="genre" class="text-red-600" />
                </div>
                <button
                    type="submit"
                    class="py-1.5 px-3 mr-2 rounded text-white bg-green-600"
                    :disabled="in_submition"
                >
                    Submit
                </button>
                <button
                    type="button"
                    class="py-1.5 px-3 rounded text-white bg-gray-600"
                    :disabled="in_submition"
                    @click.prevent="showForm = false"
                >
                    Go Back
                </button>
            </vee-form>
        </div>
    </div>
</template>

<script>
import { songsCollection } from "@/includes/firebase";
import { ErrorMessage } from "vee-validate";

export default {
    name: "CompositionItem",
    components: { ErrorMessage },
    props: {
        song: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        updateSong: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            showForm: false,
            schema: {
                modified_name: "required|min:3",
                genre: "alpha_spaces",
            },
            in_submition: false,
            show_alert: false,
            alert_variant: "bg-blue-500",
            alert_message: "Please wait... We are processing your request.",
        };
    },
    methods: {
        async edit(values) {
            console.log(values);
            console.log(this.song);
            this.in_submition = true;
            this.show_alert = true;
            this.alert_variant = "bg-blue-500";
            this.alert_message = "Please wait... We are processing your request.";

            // songsCollection
            //     .doc(this.song.docId)
            //     .update({
            //         name: values.modified_name,
            //         genre: values.genre,
            //     })
            //     .then(() => {
            //         this.alert_variant = "bg-green-500";
            //         this.alert_message = "Song updated successfully.";
            //     })
            //     .catch((error) => {
            //         this.alert_variant = "bg-red-500";
            //         this.alert_message = error.message;
            //     })
            //     .finally(() => {
            //         this.in_submition = false;
            //     });

            try {
                await songsCollection.doc(this.song.docId).update(values);

                this.alert_variant = "bg-green-500";
                this.alert_message = "Song updated successfully.";
            } catch (error) {
                this.alert_variant = "bg-red-500";
                this.alert_message = error.message;
            } finally {
                this.in_submition = false;
            }

            this.updateSong(this.index, values);

            this.showForm = false;
        },
    },
};
</script>
