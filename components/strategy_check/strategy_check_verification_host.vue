<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// --- Page-specific State & Logic ---
// 状态：表格行选择
const selectedRows = ref([]);
// 状态：所有设备的原始数据
const allDevices = ref<any[]>([]);

// 状态：对话框相关
const showAutoFetchDialog = ref(false); // “自动获取”对话框
const isConnected = ref(false);         // “我已接入”复选框
const showPolicyDialog = ref(false);    // “策略检查”对话框
const currentDevice = ref(null);        // 当前查看策略的设备

// --- 筛选逻辑 (采用组件1的优化方案) ---
// 1. 将筛选选项数据结构化
const filterOptions = ref([
  { id: 'zone1', label: 'Ⅰ区', checked: false, value: 'Ⅰ区' },
  { id: 'zone2', label: 'Ⅱ区', checked: false, value: 'Ⅱ区' },
]);

// 2. 使用计算属性动态过滤设备列表
const filteredDevices = computed(() => {
  const selectedZones = filterOptions.value
      .filter(opt => opt.checked)
      .map(opt => opt.value);

  // 如果没有选择任何筛选条件，则显示所有设备
  if (selectedZones.length === 0) {
    return allDevices.value;
  }
  // 否则，只返回包含所选区域的设备
  return allDevices.value.filter(device => selectedZones.includes(device.zone));
});

// 3. 计算每个区域的设备数量
const getZoneCount = (zoneValue: string) => {
  return allDevices.value.filter(d => d.zone === zoneValue).length;
};


// --- 数据 ---
const devicesData = [
  // ... (此处省略了与原组件2中相同的12条设备数据)
  { index: 1, name: '山东省调', zone: 'Ⅰ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_和平3站_Ⅱ区_SVR_1234', system: 'XXXXXX', count: '90' },
  { index: 2, name: '山东省调', zone: 'Ⅰ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_和平3站_Ⅱ区_SVR_1234', system: 'XXXXXX', count: '90' },
  { index: 3, name: '山东省调', zone: 'Ⅰ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_和平3站_Ⅱ区_SVR_1234', system: 'XXXXXX', count: '90' },
  { index: 4, name: '山东省调', zone: 'Ⅰ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_和平3站_Ⅱ区_SVR_1234', system: 'XXXXXX', count: '90' },
  { index: 5, name: '山东省调', zone: 'Ⅰ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_和平3站_Ⅱ区_SVR_1234', system: 'XXXXXX', count: '90' },
  { index: 6, name: '山东省调', zone: 'Ⅰ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_和平3站_Ⅱ区_SVR_1234', system: 'XXXXXX', count: '90' },
  { index: 7, name: '山东省调', zone: 'Ⅰ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_和平3站_Ⅱ区_SVR_1234', system: 'XXXXXX', count: '90' },
  { index: 8, name: '山东省调', zone: 'Ⅱ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_金牛站_Ⅱ区_OM', system: 'XXXXXX', count: '80' },
  { index: 9, name: '山东省调', zone: 'Ⅱ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_金牛站_Ⅱ区_OM', system: 'XXXXXX', count: '80' },
  { index: 10, name: '山东省调', zone: 'Ⅱ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_金牛站_Ⅱ区_OM', system: 'XXXXXX', count: '80' },
  { index: 11, name: '山东省调', zone: 'Ⅰ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_和平2站_Ⅱ区_OM', system: 'XXXXXX', count: '95' },
  { index: 12, name: '山东省调', zone: 'Ⅰ区', ip1: '10.200.114.23', ip2: '10.200.114.23', type: '主机', device: '济南地调_和平3站_Ⅱ区_SVR_1234', system: 'linux', count: '90' }
];

// --- 表格配置 ---
const columnLabels = {
  index: '编号',
  name: '设备名称',
  zone: '安全区',
  ip1: '设备IP1',
  ip2: '设备IP2',
  type: '设备类型',
  device: '站内设备类型',
  system: '操作系统',
  count: '策略数'
};

// --- 生命周期钩子 ---
onMounted(() => {
  // 页面加载后，用模拟数据填充设备列表
  allDevices.value = devicesData;
});

// --- 方法 ---
// 处理“自动获取”对话框中的“开始”按钮点击
function handleStart() {
  if (isConnected.value) {
    // 此处可以添加实际的获取策略逻辑
    console.log('开始获取策略...');
    showAutoFetchDialog.value = false; // 关闭对话框
  } else {
    // 可选：提示用户需要先勾选
    console.warn('请先勾选 "我已接入"');
  }
}

// 处理表格中“策略数”的点击事件
function handlePolicyClick(device: any) {
  currentDevice.value = device;
  showPolicyDialog.value = true;
}
</script>

<template>
  <div class="row no-wrap">
    <div class="q-pa-md" style="width: 240px; background: #f7f7f7;">
      <div class="text-h6 q-mb-md">筛选条件</div>
      <q-list bordered separator>
        <q-item class="bg-grey-2 text-weight-medium">
          <q-item-section>安全区</q-item-section>
          <q-item-section side>资产数量</q-item-section>
        </q-item>

        <q-item v-for="option in filterOptions" :key="option.id" v-ripple tag="label">
          <q-item-section side>
            <q-checkbox v-model="option.checked" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ option.label }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-badge color="grey-6" :label="getZoneCount(option.value)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="col q-pa-md">
      <q-card flat>
        <q-dialog v-model="showAutoFetchDialog" persistent>
          <q-card style="min-width: 400px">
            <q-card-section>
              <div class="text-h6">请将检查设备接入监测装置，用于获取主机策略</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-checkbox v-model="isConnected" label="我已接入" />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-close-popup flat label="取消" color="primary" />
              <q-btn flat label="开始" color="primary" @click="handleStart" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-card-section>
          <common-enhanced-table
              v-model:selection="selectedRows"
              title="主机策略表"
              :rows="filteredDevices"
              :column-labels="columnLabels"
              row-key="index"
              enable-selection
          >
            <template #top-right>
              <q-btn label="自动获取" color="primary" @click="showAutoFetchDialog = true" />
            </template>
            <template #cell-count="{ row }">
              <a href="javascript:void(0)" @click="handlePolicyClick(row)">{{ row.count }}</a>
            </template>
          </common-enhanced-table>
        </q-card-section>
      </q-card>
    </div>

    <strategy-check-verification-host-dialog v-model="showPolicyDialog" :device="currentDevice" />
  </div>
</template>

<style scoped>
/* 可以根据需要添加样式 */
a {
  color: #1976d2; /* Quasar primary color */
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>