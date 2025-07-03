<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  modelValue: boolean,
  currentDevice: any
}>();

const emit = defineEmits(['update:modelValue']);

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});


const currentDeviceName = computed(() => props.currentDevice?.name || '未知设备')

// 数据源
const policyData = ref(Array.from({ length: 25 }, (_, i) => ({
  index: i + 1,
  policyId: `POLICY-${i + 1000}`,
  enabled: Math.random() > 0.5,
  srcStartIP: `192.168.0.${i + 1}`,
  srcEndIP: `192.168.0.${i + 10}`,
  srcPortRange: '1000-2000',
  dstStartIP: `10.0.0.${i + 1}`,
  dstEndIP: `10.0.0.${i + 10}`,
  dstPortRange: '80-8080',
  solution: '阻断',
  direction: i % 2 === 0 ? '入站' : '出站',
  protocol: i % 2 === 0 ? 'TCP' : 'UDP'
})))

const labels = {
  index: '编号',
  policyId: '策略号',
  enabled: '策略开关',
  srcStartIP: '源起始IP',
  srcEndIP: '源终止IP',
  srcPortRange: '源端口范围',
  dstStartIP: '目标起始IP',
  dstEndIP: '目标终止IP',
  dstPortRange: '目标端口范围',
  solution: '解决方式',
  direction: '方向',
  protocol: '协议'
};

function closeDialog() {
  showDialog.value = false
}

</script>
<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 1200px; max-width: 90vw; max-height: 90vh; overflow-y: auto;">
      
      <q-card-section class="q-py-sm row items-center" style="background-color: #3BB5A3; position: relative;">
        <q-icon name="description" size="30px" class="q-mr-sm text-white" />
        <div class="text-h6 text-white" style="flex: 1; text-align: center;">策略详情 - {{ currentDeviceName }}</div>
        <q-btn icon="close" flat round dense @click="closeDialog" style="position: absolute; top: 4px; right: 4px; color: white;" />
      </q-card-section>

       <common-enhanced-table
            v-model:selection="selectedRows"
            :rows="policyData"
            :column-labels="labels"
            row-key="index"
            >
        </common-enhanced-table>

 
    </q-card>
  </q-dialog>
</template>
<style scoped>

</style>
