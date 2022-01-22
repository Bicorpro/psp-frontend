<template>
  <div class="login">
    <form @submit="onSubmit" action="">
      <h3>Sign in</h3>
      <p>to access your devices</p>
      <p>
        <label for="username">Email or username</label>
        <input
          type="text"
          v-model="username"
          name="username"
          minlength="3"
          maxlength="15"
          autocomplete="off"
          placeholder="Enter your username or email address"
          required
        />
      </p>
      <p>
        <label for="password">Password</label>
        <input
          type="password"
          v-model="password"
          name="password"
          minlength="8"
          maxlength="50"
          autocomplete="off"
          placeholder="Enter your password"
          required
        />
      </p>
      <p>Not your computer? Use a Private Browsing window to sign in.</p>
      <button type="submit">Sign in</button>
      <p>
        New to PSP?
        <router-link to="/register">Create an account</router-link>
      </p>
    </form>

    <p class="error" v-if="post !== ''">
      {{ post }}
    </p>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";

@Component({
  components: {},
})
export default class Login extends Vue {
  post = "";
  username = "";
  password = "";

  @Action setConnected: any;

  onSubmit(e: Event): void {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3000/api/authenticate",
        {
          username: this.username,
          password: this.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.post = res.data;
        this.setConnected(true);
        this.$router.push("/devices");
      })
      .catch((err) => {
        const data = err.response.data;
        this.post = data.status + ": " + data.error;
      });
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

div.login {
  color: $primary-color;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1em;
  padding: 1em;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 0.3em;
    padding: 2em 1em;
    max-width: 30em;
  }

  p {
    display: flex;
    flex-direction: column;
    margin: 1.2em;
    max-width: 25em;

    label {
      font-weight: bold;
      display: flex;
      align-self: left;
      padding: 0.2em 0;
    }
  }

  p.error {
    background-color: red;
    padding: 1.2em;
  }
}

input[type="text"],
input[type="password"] {
  outline: none;
  width: 25em;
  padding: 0.7em 0.5em;
  padding-left: 0.7em;
  color: lighten($primary-color, 30%);
  border: 1px solid lighten($primary-color, 30%);
  border-radius: 0.2em;

  &:focus,
  &:hover {
    border: solid 1px darken($accent-color, 10%);
  }
}
</style>
