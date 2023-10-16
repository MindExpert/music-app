<template>
    <button class="button" @click="handleClick">
        {{ label ?? 'Press Me!' }}
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        label: {
            type: String,
            required: true
        }
    },
    methods: {
        handleClick() {
            this.$emit('click');
        }
    }
};
</script>

<style scoped>
.button {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
}
</style>
