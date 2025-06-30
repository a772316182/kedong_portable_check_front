<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 统一跳转方法，存储 title 到 sessionStorage
const navigate = (path: string, title: string) => {
  sessionStorage.setItem('page_title', title)
  router.push({
    path,
    query: {title}
  })
}
</script>

<template>
  <div class="text-primary text-weight-bold text-body1">
    <q-list class="full-width">
      <q-item v-ripple clickable @click="navigate('/dashboard', '首页')">
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>首页</q-item-section>
      </q-item>
    </q-list>

    <q-list class="full-width">
      <q-expansion-item default-opened icon="travel_explore" label="空间资产测绘">
        <q-item v-ripple clickable :inset-level="1" @click="navigate('/basic_info', '基本信息维护')">
          <q-item-section>基本信息维护</q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>

    <q-list class="full-width">
      <q-expansion-item default-opened icon="inventory" label="厂站安全检查">
        <q-item v-ripple clickable :inset-level="1" @click="navigate('/security_basic', '安全基础检查')">
          <q-item-section>安全基础检查</q-item-section>
        </q-item>
        <q-item v-ripple clickable :inset-level="1" @click="navigate('/device_check', '网络设备检查')">
          <q-item-section>网络设备检查</q-item-section>
        </q-item>
        <q-item v-ripple clickable :inset-level="1" @click="navigate('/strategy_check', '安全策略检查')">
          <q-item-section>安全策略检查</q-item-section>
        </q-item>
        <q-item v-ripple clickable :inset-level="1" @click="navigate('/alarm_verification', '安全告警验证')">
          <q-item-section>安全告警验证</q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>

    <q-list class="full-width">
      <q-item v-ripple clickable @click="navigate('/topology', '拓扑绘制')">
        <q-item-section avatar>
          <Icon name="majesticons:file-report" size="24" mode="svg"/>
        </q-item-section>
        <q-item-section>拓扑绘制</q-item-section>
      </q-item>
    </q-list>

    <q-list class="full-width">
      <q-item v-ripple clickable @click="navigate('/security_report', '安全检查报告')">
        <q-item-section avatar>
          <Icon name="majesticons:file-report" size="24" mode="svg"/>
        </q-item-section>
        <q-item-section>安全检查报告</q-item-section>
      </q-item>
    </q-list>

    <q-list class="full-width">
      <q-item v-ripple clickable @click="navigate('/rectification_notice', '整改通知单')">
        <q-item-section avatar>
          <Icon name="material-symbols-light:chat-info-rounded" size="24" mode="svg"/>
        </q-item-section>
        <q-item-section>整改通知单</q-item-section>
      </q-item>
    </q-list>

    <q-list class="full-width">
      <q-item v-ripple clickable @click="navigate('/user_manage', '用户管理')">
        <q-item-section avatar>
          <Icon name="heroicons:users-solid" size="24" mode="svg"/>
        </q-item-section>
        <q-item-section>用户管理</q-item-section>
      </q-item>
    </q-list>

    <q-list class="full-width">
      <q-item v-ripple clickable @click="navigate('/sys_manage', '系统管理')">
        <q-item-section avatar>
          <Icon name="material-symbols-light:settings" size="24" mode="svg"/>
        </q-item-section>
        <q-item-section>系统管理</q-item-section>
      </q-item>
    </q-list>

    <q-list class="full-width">
      <q-item v-ripple clickable @click="navigate('/api_test', '测试页面')">
        <q-item-section avatar>
          <Icon name="material-symbols-light:settings" size="24" mode="svg"/>
        </q-item-section>
        <q-item-section>测试页面</q-item-section>
      </q-item>
    </q-list>
<!--    <q-list class="full-width">-->
<!--      <q-item-->
<!--          v-ripple-->
<!--          clickable-->
<!--          @click="router.push('/monitor_test')"-->
<!--      >-->
<!--        <q-item-section avatar>-->
<!--          <Icon name="material-symbols-light:settings" size="24" mode="svg"/>-->
<!--        </q-item-section>-->
<!--        <q-item-section>monitor页面</q-item-section>-->
<!--      </q-item>-->
<!--    </q-list>-->
  </div>
</template>

<style scoped></style>