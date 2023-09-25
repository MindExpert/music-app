<template>
    <!-- Alert Msg -->
    <div v-show="login_show_alert" :class="login_alert_variant"
        class="text-white text-center px-4 py-2 border-0 rounded relative mb-4">
        <span class="inline-block align-middle mr-8">{{ login_alert_msg }}</span>
        <button @click="login_show_alert = false"
            class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-2 mr-4 outline-none focus:outline-none">
            <span>×</span>
        </button>
    </div>

    <!-- Login Form -->
    <vee-form :validation-schema="loginSchema" @submit="login">
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <vee-field type="email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
            <ErrorMessage class="text-red-600" name="email" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Password</label>
            <vee-field name="password" :bails="false" v-slot="{ field, errors }">
                <input type="password"
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    placeholder="Password" v-bind="field" />
                <div class="text-red-600" v-for="error in errors" :key="error">
                    {{ error }}
                </div>
            </vee-field>
        </div>
        <button type="submit"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            :disabled="login_in_submission">
            Submit
        </button>
    </vee-form>
</template>

<script>
import { ErrorMessage } from 'vee-validate';
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'


export default {
    name: 'LoginForm',
    components: { ErrorMessage },
    data() {
        return {
            login_in_submission: false,
            login_show_alert: false,
            login_alert_variant: 'bg-blue-500',
            login_alert_msg: 'Please wait! We are logging you in.',
            loginSchema: {
                email: 'required|min:3|max:100|email',
                password: 'required|min:3|max:100|excluded:password'
            }
        }
    },
    methods: {
        ...mapActions(useUserStore, ["authenticate"]),
        async login(values) {
            this.login_show_alert = true
            this.login_in_submission = true
            this.login_alert_variant = 'bg-blue-500'
            this.login_alert_msg = 'Please wait! We are logging you in'

            try {
                await this.authenticate(values);
            } catch (error) {
                this.login_in_submission = false
                this.login_alert_variant = 'bg-red-500'
                this.login_alert_msg = "Invalid Credentials"
                return
            }

            /* Success */
            this.login_in_submission = false
            this.login_alert_variant = 'bg-green-500'
            this.login_alert_msg = 'Logged in successfully.'

            /** Reload Page */
            window.location.reload();
        }
    }
}
</script>
