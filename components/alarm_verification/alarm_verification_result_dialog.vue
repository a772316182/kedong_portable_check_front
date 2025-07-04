<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: boolean,
  currentDevice: any
}>();

const emit = defineEmits(['update:modelValue']);

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const selectedRows = ref([])
const currentDeviceName = computed(() => props.currentDevice?.name || '未知设备')

// 更新为图片中的核查结果数据
const checkData = ref([
  {
    id: 1,
    item: 'XXXXXXXXXXXXXX',
    result: '不合格',
    description: 'XXXXXXXXXXXXXXX'
  },
  {
    id: 2,
    item: 'XXXXXXXXXXXXXX',
    result: '不合格',
    description: 'XXXXXXXXXXXXXXX'
  },
  {
    id: 3,
    item: 'XXXXXXXXXXXXXX',
    result: '不合格',
    description: 'XXXXXXXXXXXXXXX'
  },
  {
    id: 4,
    item: 'XXXXXXXXXXXXXX',
    result: '合格',
    description: 'XXXXXXXXXXXXXXX'
  }
])

// 更新表头标签
const labels = {
  id: '编号',
  item: '告警项',
  result: '验证结果',
  description: '结果说明'
};

function closeDialog() {
  showDialog.value = false
}
</script>

<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 1200px; max-width: 90vw; height: 750px; overflow-y: auto;">
      
      <q-card-section class="q-py-sm row items-center" style="background-color: #3BB5A3; position: relative;">
        <q-icon name="description" size="30px" class="q-mr-sm text-white" />
        <div class="text-h6 text-white" style="flex: 1; text-align: center;">核查结果 - {{ currentDeviceName }}</div>
        <q-btn icon="close" flat round dense @click="closeDialog" style="position: absolute; top: 4px; right: 4px; color: white;" />
      </q-card-section>

      <common-enhanced-table
          title="告警验证结果"
          :rows="checkData"
          :column-labels="labels"
          row-key="id"

      >
      </common-enhanced-table>

    </q-card>
  </q-dialog>
</template>

<style scoped>
/* 可以根据需要添加样式 */
</style>