<template>
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
            <!-- Upload Dropbox -->
            <div
                class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class="{'bg-green-400 border-green-400 border-solid text-white font-medium' : is_dragover }"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover = false"
                @dragover.prevent.stop="is_dragover = true"
                @dragenter.prevent.stop="is_dragover = true"
                @dragleave.prevent.stop="is_dragover = false"
                @drop.prevent.stop="upload($event)"
                >
                <h5>Drop your files here</h5>
            </div>
 
            <hr class="my-6" />

            <!-- Progess Bars -->
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
                <!-- File Name -->
                <div class="font-bold text-sm" :class="upload.text_class">
                    <i :class="upload.icon"></i> {{ upload.name }}
                </div>

                <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                    <!-- Inner Progress Bar -->
                    <div class="transition-all progress-bar bg-blue-400"
                        :class="upload.variant"
                        :style="{ width: upload.currenct_progress + '%'}"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { storage } from "@/includes/firebase";

    export default {
        name: "Upload",
        data() {
            return {
                is_dragover: false,
                uploads: []
            }
        },
        methods: {
            upload($event) {
                this.is_dragover = false;
                // Clever way of converting an object to an array
                const files = [...$event.dataTransfer.files];
                
                files.forEach((file) => {
                    if(file.type !== "audio/mpeg"){
                        console.log('NOT RIGHT FORMAT');
                        return;
                    }

                    const storageRef = storage.ref(); //'music-70ff1.appspot.com'
                   
                    const task = storageRef.child(`songs/${file.name}`).put(file); //'music-70ff1.appspot.com/songs/music.mp3'

                    // Push array will return the length of the array after the object has been push into [at the end]
                    const uploadIndex = this.uploads.push({
                        task,
                        name: file.name,
                        currenct_progress: 0,
                        error: false,
                        complete: false,
                        variant: 'bg-blue-400',
                        icon: 'fas fa-spinner fa-spin',
                        text_class: '',
                    }) - 1; // This way we get the index of the last element [length - 1]

                    task.on("state_changed", (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                        // Its importent we are using arrow funct, because otherwise we wount be able to use (this) keyword
                        this.uploads[uploadIndex].currenct_progress = progress;

                        console.log(`Upload is ${progress}% done`);
                    }, (error) => {
                        this.uploads[uploadIndex].error = true;
                        this.uploads[uploadIndex].variant = 'bg-red-400';
                        this.uploads[uploadIndex].icon = 'fas fa-times';
                        this.uploads[uploadIndex].text_class = 'text-red-400';
                        console.log(error);
                    }, () => {
                        this.uploads[uploadIndex].complete = true;
                        this.uploads[uploadIndex].variant = 'bg-green-400';
                        this.uploads[uploadIndex].icon = 'fas fa-check';
                        this.uploads[uploadIndex].text_class = 'text-green-400';
                    });
                });
            }
        }
    }
</script>