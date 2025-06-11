<script setup lang="ts">
const leftDrawerOpen = ref(false)
const username = ref('张三')
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
        <q-space/>
        <q-avatar>
          <Icon name="material-symbols:person-check" size="35" mode="svg"/>
        </q-avatar>
        <q-btn-dropdown stretch flat :label="`欢迎：${username}`">
          <q-list>
            <q-item-label header>操作面板</q-item-label>
            <q-item>
              <q-btn flat class="full-width">个人资料</q-btn>
            </q-item>
            <q-item>
              <q-btn flat class="full-width">修改密码</q-btn>
            </q-item>
            <q-item>
              <q-btn flat class="full-width">注销账户</q-btn>
            </q-item>
            <q-item>
              <q-btn flat class="full-width">退出登录</q-btn>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above side="left" behavior="desktop" bordered>
      <common-drawer/>
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