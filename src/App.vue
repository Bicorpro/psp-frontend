<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link v-if="isConnected" to="/devices">Devices</router-link>
      <router-link v-if="!isConnected" to="/login">Sign in</router-link>
      <router-link v-if="!isConnected" to="/register">Sign up</router-link>
      <button v-if="isConnected" @click="logOut()">Log out</button>
    </div>
    <router-view />
    <footer>
      <h3>&copy; Bicorpro 2022</h3>
      <p>
        Sami ELHADJI TCHIAMBOU - Corentin HUMBERT - Paul LAMBERT - Hugo PRAT
        CAPILLA
      </p>
    </footer>
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
    if (confirm("Are you sure you want to log out?")) {
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

  a,
  button {
    font-size: 1em;
    cursor: pointer;
    background: none;
    border: none;
    margin: 0 0.5em;
    padding: 0.4em 0.6em;
    text-decoration: none;
    font-weight: bold;
    color: $secondary-color;

    &:hover {
      color: $accent-color;
    }

    &.router-link-exact-active {
      color: $accent-color;
      border-bottom: 0.2em solid $accent-color;
    }
  }
}

footer {
  padding: 3em 0;

  * {
    padding: 0.5em 1em;
  }

  h3 {
    color: $accent-color;
  }
}
</style>
