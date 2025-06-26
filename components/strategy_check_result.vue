<template>
  <div class="policy-status-container q-pa-md">
    <div class="text-h5 q-mb-md">策略检查状态</div>
    
    <div class="policy-cards row q-gutter-md">
      <!-- 主机策略卡片 -->
      <q-card class="policy-card col" flat bordered>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">主机策略</div>
        </q-card-section>
        
        <q-card-section class="text-center">
          <q-circular-progress
            show-value
            font-size="16px"
            :value="99"
            size="120px"
            :thickness="0.2"
            color="primary"
            track-color="grey-3"
            class="q-ma-md"
          >
            99%
          </q-circular-progress>
          <div class="text-subtitle1">检查中</div>
        </q-card-section>
      </q-card>

      <!-- 纵向策略卡片 -->
      <q-card class="policy-card col" flat bordered>
        <q-card-section class="bg-teal text-white">
          <div class="text-h6">纵向策略</div>
        </q-card-section>
        
        <q-card-section class="text-center">
          <q-circular-progress
            show-value
            font-size="16px"
            :value="99"
            size="120px"
            :thickness="0.2"
            color="teal"
            track-color="grey-3"
            class="q-ma-md"
          >
            99%
          </q-circular-progress>
          <div class="text-subtitle1">检查中</div>
        </q-card-section>
      </q-card>

      <!-- 隔离策略卡片 -->
      <q-card class="policy-card col" flat bordered>
        <q-card-section class="bg-orange text-white">
          <div class="text-h6">隔离策略</div>
        </q-card-section>
        
        <q-card-section class="text-center">
          <q-circular-progress
            show-value
            font-size="16px"
            :value="99"
            size="120px"
            :thickness="0.2"
            color="orange"
            track-color="grey-3"
            class="q-ma-md"
          >
            99%
          </q-circular-progress>
          <div class="text-subtitle1">检查中</div>
        </q-card-section>
      </q-card>

      <!-- 防火墙策略卡片 -->
      <q-card class="policy-card col" flat bordered>
        <q-card-section class="bg-red text-white">
          <div class="text-h6">防火墙策略</div>
        </q-card-section>
        
        <q-card-section class="text-center">
          <q-circular-progress
            show-value
            font-size="16px"
            :value="99"
            size="120px"
            :thickness="0.2"
            color="red"
            track-color="grey-3"
            class="q-ma-md"
          >
            99%
          </q-circular-progress>
          <div class="text-subtitle1">检查中</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row justify-center q-gutter-sm q-mt-md">
      <q-btn color="primary" flat label="上一步" @click="emit('prev')" />
      <q-btn color="primary" label="完成" @click="emit('reset')" />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['prev', 'reset'])
</script>

<style scoped>
.policy-status-container {
  max-width: 1200px;
  margin: 0 auto;
}

.policy-cards {
  display: flex;
  flex-wrap: wrap;
}

.policy-card {
  flex: 1 1 200px; /* 每个卡片最小宽度200px */
  min-width: 200px;
  max-width: 280px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.policy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 900px) {
  .policy-card {
    flex: 1 1 45%;
  }
}

@media (max-width: 600px) {
  .policy-card {
    flex: 1 1 100%;
  }
}
</style>