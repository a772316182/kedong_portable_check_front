<script setup lang="ts">

const activePolicy = ref('host') // 默认显示主机策略
const emit = defineEmits(['prev', 'reset'])



</script>

<template>
  <!-- 中间内容 -->
  <div class="col q-pa-md">
    <!-- 策略切换按钮 -->
    <div class="row q-gutter-sm q-mb-md">
      <q-btn label="主机策略检查结果" :color="activePolicy === 'host' ? 'primary' : 'grey'" @click="activePolicy = 'host'"/>
      <q-btn
label="纵向策略检查结果" :color="activePolicy === 'vertical' ? 'primary' : 'grey'"
             @click="activePolicy = 'vertical'"/>
      <q-btn
label="隔离策略检查结果" :color="activePolicy === 'isolation' ? 'primary' : 'grey'"
             @click="activePolicy = 'isolation'"/>
      <q-btn
label="防火墙策略检查结果" :color="activePolicy === 'firewall' ? 'primary' : 'grey'"
             @click="activePolicy = 'firewall'"/>
    </div>

    <!-- 动态切换子组件 -->
    <div>
      <strategy-check-result-host v-if="activePolicy === 'host'"/>
      <strategy-check-result-vertical v-else-if="activePolicy === 'vertical'"/>
      <strategy-check-result-isolation v-else-if="activePolicy === 'isolation'"/>
      <strategy-check-result-firewall v-else-if="activePolicy === 'firewall'"/>
    </div>
    <!-- 底部按钮保留 -->
    <div class="row justify-center q-gutter-sm q-mt-md">
      <q-btn label="上一步" color="primary" flat @click="emit('prev')"/>
      <q-btn label="完成" color="primary" @click="emit('reset')"/>
    </div>
  </div>

</template>
