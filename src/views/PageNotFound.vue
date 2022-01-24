<template>
  <div class="page-not-found">
    <img alt="Bro you lost or somethin'" src="@/assets/images/404.png" />
    <button @click="getHome">GET ME HOME!!!</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class PageNotFound extends Vue {
  private getHome(): void {
    if (confirm("u good?")) {
      if (confirm("u seem a little bit panicked...")) {
        if (confirm("so u wanna get home huh?")) {
          if (confirm("why the hurry?")) {
            if (confirm("this is calm place... keep me company :)")) {
              if (confirm("please don't leave me...")) {
                if (confirm("...")) {
                  if (confirm("...")) {
                    if (confirm("...")) {
                      if (confirm("*sigh*")) {
                        if (confirm("OK fine. farwell then.")) {
                          this.$router.push("/");
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables.scss";

div.page-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    cursor: pointer;
    width: 2em;
    margin: 15em 0;
    border-radius: 0.2em;
    transition: 3s ease-in;

    &:hover {
      transform: rotate(2160deg);
      width: 90em;
      margin: 5em 0;
    }
  }

  button {
    cursor: pointer;
    font-weight: bold;
    font-size: 1em;
    padding: 0.8em;
    border-radius: 0.5em;
    background-color: $accent-color;
    color: black;
    text-decoration: none;
    border: 0.2em solid black;
    transition: 0.5s ease-in-out;

    &:hover {
      color: $accent-color;
      background-color: black;
      border: 0.2em solid $accent-color;
    }
  }
}
</style>
