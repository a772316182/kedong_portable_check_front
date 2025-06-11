<script setup lang="ts">
const leftDrawerOpen = ref(false)
</script>


<template>
  <q-layout view="hHh lpR fFf">
    <q-header
        bordered class="bg-primary text-white"
        style="height: 70px; align-content: center; display: flex; align-items: center;">
      <q-toolbar>
        <q-toolbar-title class="text-h4">
          <q-avatar>
            <Icon name="mdi:shield-search" size="35" mode="svg"/>
          </q-avatar>
          便携式检查工具
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above side="left" behavior="desktop" bordered>
      <!-- drawer content -->
      <drawer/>
    </q-drawer>

    <q-page-container>
      <q-page class="q-pa-md full-height full-width">
        <slot/>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<style scoped>

</style>