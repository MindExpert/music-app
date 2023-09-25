import { defineStore } from "pinia" // Helps Us Define a new stores

export default defineStore("modal", {
  state: () => ({
    isOpen: false
  }),
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? 'hidden' : '';
    }
  }
})
