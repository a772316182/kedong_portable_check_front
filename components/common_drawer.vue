<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter()
</script>

<template>
  <div class="text-primary text-weight-bold text-body1">
    <q-list class="full-width">
      <q-item
          v-ripple
          clickable
          @click="router.push('/dashboard')"
      >
        <q-item-section avatar>
          <q-icon name="home"/>
        </q-item-section>
        <q-item-section>首页</q-item-section>
      </q-item>
    </q-list>

    <q-list class="full-width">
      <q-expansion-item
          default-opened
          icon="travel_explore" label="空间资产测绘"
      >
        <q-item
            v-ripple
            clickable
            :inset-level="1"
        >
          <q-item-section>基本信息维护</q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>

    <q-list class="full-width">
      <q-expansion-item
          default-opened
          icon="inventory" label="厂站安全检查"
      >
        <q-item
            v-ripple
            clickable
            :inset-level="1"
        >
          <q-item-section>安全基础检查</q-item-section>
        </q-item>
        <q-item
            v-ripple
            clickable
            :inset-level="1"
        >
          <q-item-section>网络设备检查</q-item-section>
        </q-item>
        <q-item
            v-ripple
            clickable
            :inset-level="1"
        >
          <q-item-section>安全策略检查</q-item-section>
        </q-item>
        <q-item
            v-ripple
            clickable
            :inset-level="1"
            @click="router.push('/alarm_verification')"
        >
          <q-item-section>安全告警验证</q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>


    <q-list class="full-width">
      <q-item
          v-ripple
          clickable
          @click="router.push('/security_report')"
      >
        <q-item-section avatar>
          <Icon name="majesticons:file-report" size="24" mode="svg"/>
        </q-item-section>
        <q-item-section>安全检查报告</q-item-section>
      </q-item>
    </q-list>

    <q-list class="full-width">
      <q-item
          v-ripple
          clickable
          @click="router.push('/rectification_notice')"
      >
        <q-item-section avatar>
          <Icon name="material-symbols-light:chat-info-rounded" size="24" mode="svg"/>
        </q-item-section>
        <q-item-section>整改通知单</q-item-section>
      </q-item>
    </q-list>
    <q-list class="full-width">
      <q-item
          v-ripple
          clickable
          @click="router.push('/user_manage')"
      >
        <q-item-section avatar>
          <Icon name="heroicons:users-solid" size="24" mode="svg"/>
        </q-item-section>
        <q-item-section>用户管理</q-item-section>
      </q-item>
    </q-list>
    <q-list class="full-width">
      <q-item
          v-ripple
          clickable
          @click="router.push('/sys_manage')"
      >
        <q-item-section avatar>
          <Icon name="material-symbols-light:settings" size="24" mode="svg"/>
        </q-item-section>
        <q-item-section>系统管理</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style scoped>

</style>