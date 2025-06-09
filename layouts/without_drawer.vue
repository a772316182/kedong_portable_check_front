<script setup lang="ts">

</script>

<template>
  <q-layout class="images">
    <q-page-container>
      <q-page class="q-pa-sm">
        <slot/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.images{
  background-image: url('assets/bg.jpg'); /* 替换为你的背景图像路径 */
  background-size: cover;
  background-position: center;
}
</style>