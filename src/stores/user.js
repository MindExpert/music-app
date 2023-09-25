import { defineStore } from 'pinia' // Helps Us Define a new stores
import { auth, usersCollection } from '@/includes/firebase'

export default defineStore('user', {
    state: () => ({
        userLoggedIn: false,
    }),
    actions: {
        async register(values) {
            /* Authenticate user using firebase.auth() */
            const userCred = await auth.createUserWithEmailAndPassword(values.email, values.password);

            /* 
             * Register user using firebase collection, in a given document
             * If document doesnt exists, the firebase will create one 
             * Instead of add(), now we use doc('doc_identifier').set(values).
             */
            await usersCollection.doc(userCred.user.uid).set({
                name: values.name,
                email: values.email,
                age: values.age,
                country: values.country,
                user_id: userCred.user.uid
            });

            /* Update user profile display name */
            await userCred.user.updateProfile({
                displayName: values.name,
            })

            /* Update userLoggedIn state */
            this.userLoggedIn = true;
        },
        async authenticate(values) {
            await auth.signInWithEmailAndPassword(values.email, values.password);

            /* Update userLoggedIn state */
            this.userLoggedIn = true;
        },
        async signOut() {
            await auth.signOut();
      
            this.userLoggedIn = false;
        },
    }
})
