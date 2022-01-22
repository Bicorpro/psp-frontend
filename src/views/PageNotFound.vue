<template>
  <img alt="Bro you lost or somethin'" src="@/assets/images/404.png" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class PageNotFound extends Vue {}
</script>

<style scoped lang="scss">
img {
  margin: 5em 0;
}
</style>
