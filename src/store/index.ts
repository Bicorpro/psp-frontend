import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connected: false,
    devices: Array<string>(),
  },
  getters: {
    isConnected: (state) => state.connected,
    getDevices: (state) => state.devices,
  },
  mutations: {
    setConnected(state, connected: boolean): void {
      state.connected = connected;
    },
    setDevices(state, devices: Array<string>): void {
      Vue.set(state, "devices", [...devices]);
    },
    addDevice(state, device: string): void {
      state.devices.push(device);
    },
  },
  actions: {
    setConnected(ctx, connected): void {
      ctx.commit("setConnected", connected);
    },
    setDevices(ctx, devices: Array<string>): void {
      ctx.commit("setDevices", devices);
    },
  },
  modules: {},
});
