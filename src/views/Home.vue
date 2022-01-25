<template>
  <div class="home">
    <img class="logo" alt="PSP logo" src="@/assets/images/logo2_trans.png" />
    <h1>Welcome to the PSP app!</h1>
    <p>PSP stands for <b>Pet Surveillance Program</b>.</p>
    <p>Let us guess:</p>
    <ul>
      <li>
        You own a pet with an adventurous personnality who wanders everywhere
      </li>
      <li>
        You spend a lot of time searching around the neighborhood to find your
        pet
      </li>
      <li>
        Your mind is never at peace, you are always worried about your pet
      </li>
    </ul>
    <p>
      If all the above conditions apply to you then you have come to the right
      place!
    </p>
    <p>
      At <b>Bicorpro</b>, we want the best for our customers and that is<br />
      why we have created the ultimate Big Brother program.
    </p>
    <p>
      The era of freedom is over! This app will allow you to track your pets
      <b>24/7</b>.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

div.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 525px) {
    img.logo {
      width: 20em;
      padding-bottom: 3em;
    }
  }

  @media (min-width: 526px) {
    img.logo {
      width: 30em;
      padding-bottom: 3em;
      transition: opacity 30s;

      &:hover {
        opacity: 0;
      }
    }
  }

  h1 {
    color: $accent-color;
    padding: 0 1em;
  }

  p {
    padding: 0.4em 1em;
    text-align: justify;
  }
}

ul {
  text-align: left;
  padding: 0 1em;
  li {
    margin: 1em;
  }
}

a {
  color: $accent-color;
}
</style>
