<template>
  <div class="register">
    <form @submit="onSubmit" action="">
      <h3>Create your PSP account</h3>
      <p>
        <label for="email">Email</label>
        <input
          type="email"
          v-model="email"
          name="email"
          autocomplete="off"
          placeholder="Enter your email address"
          required
        />
      </p>
      <p>
        <label for="username">Username</label>
        <input
          type="text"
          v-model="username"
          name="username"
          minlength="3"
          maxlength="15"
          autocomplete="off"
          placeholder="Enter your username"
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
      <button type="submit">Create account</button>
      <p>
        Already have an account?
        <router-link to="/login">Sign in</router-link>
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
export default class Register extends Vue {
  post = "";
  email = "";
  username = "";
  password = "";

  @Action setConnected: any;

  onSubmit(e: Event): void {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3000/api/register",
        {
          email: this.email,
          username: this.username,
          password: this.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        this.post = res.data;
        this.$router.push("/login");
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

div.register {
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
input[type="email"],
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
