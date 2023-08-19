<script setup lang="ts"></script>

<template>
  <div :class="$style['about-block']">
    <MyCounter></MyCounter>
  </div>
</template>

<style module scoped lang="scss">
.about-block {
  color: red;

  button: {
    margin: 10px;
  }
}
</style>
