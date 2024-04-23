import { defineStore } from 'pinia';

export const useAppStore = defineStore("app",{
  state: () => ({
    name: "terminal",
  }),

  getters: {
    getTerminalCode: state => state.name = "terminal101"
  },

  actions: {
    changeName() {
      this.name = "control";
    }
  }
});
