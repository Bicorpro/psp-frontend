<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link v-if="isConnected" to="/devices">Devices</router-link>

      <span v-if="isConnected"> | </span>
      <router-link v-if="!isConnected" to="/login">Sign in</router-link>
      <button v-if="isConnected" @click="logOut()">Log out</button>
    </div>
    <router-view />
    <footer>&copy; Bicorpro 2022</footer>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

@Component({
  components: {},
})
export default class App extends Vue {
  @Getter isConnected!: boolean;

  @Action setConnected: any;
  @Action setDevices: any;

  logOut(): void {
    axios
      .post("http://localhost:3000/api/logout", null, {
        withCredentials: true,
      })
      .then((_) => {
        this.setConnected(false);
        this.setDevices(new Array<string>());
        this.$router.push("/");
      })
      .catch((err) => {
        const data = err.response.data;
        alert(data.status + ": " + data.error);
      });
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/_variables.scss";

* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $secondary-color;
  background-color: $primary-color;
}

#nav {
  padding: 3em;

  a {
    font-weight: bold;
    color: $secondary-color;

    &.router-link-exact-active {
      color: $accent-color;
    }
  }
}

footer {
  padding: 3em 0;
}
</style>
