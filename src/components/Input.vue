<template>
  <div class="input">
    <input
      :id="fieldName"
      :name="fieldName"
      :type="fieldType"
      :placeholder="placeholder"
      v-model="value"
    />
    <label :for="fieldName">{{ fieldName }}</label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Input extends Vue {
  @Prop() private fieldName!: string;
  @Prop() private fieldType!: string;
  @Prop() private placeholder!: string;
  value = "";

  updateText(): void {
    var input: any;
    setTimeout(function () {
      var val = input.val();
      if (val != "") input.parent().addClass("floating-placeholder-float");
      else input.parent().removeClass("floating-placeholder-float");
    }, 1);
  }
}
</script>

<style scoped lang="scss">
$padding-horizontal: 20px;
$highlight-color: #16abf0;

input,
.floating-placeholder {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 20pt;
  line-height: 2.6em;
  height: 2.6em;
  margin: 0;
  padding: 0;
  width: 100%;
}
.floating-placeholder input:focus + label {
  color: $highlight-color;
}
.floating-placeholder input[value] + label {
  color: red;
}
.floating-placeholder {
  position: relative;
}

.floating-placeholder input {
  font-size: 20pt;
  border: none;
  outline: none;
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  background: transparent;
  z-index: 2;
  border-bottom: 1px solid #ccc;
  text-indent: $padding-horizontal;
}

.floating-placeholder:last-child input {
  border-bottom: none;
}
.floating-placeholder label {
  display: block;
  position: absolute;
  top: 0;
  left: $padding-horizontal;
  font-size: 20pt;
  z-index: 1;
  color: #999;
}
.floating-placeholder-float label {
}
.floating-placeholder-float input {
  line-height: 3.4em;
}
</style>
