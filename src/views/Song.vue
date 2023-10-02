<template>
    <div>
        {{ $route.params.id }}
    </div>
</template>

<script>
export default {
    name: "Song",
    data() {
        return {
            song: {},
        };
    },
    // created() {
    //     this.fetchData();
    // },
    // methods: {
    //     fetchData() {
    //         const id = this.$route.params.id;
    //         this.$http.get(`/api/songs/${id}`).then((response) => {
    //             this.song = response.data;
    //         });
    //     },
    // },
};
</script>
