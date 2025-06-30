<script setup lang="ts">

const model = ref('主机策略')

const labels = {
  index: '序号',
  isEnabled: '是否启用',
  itemNameForVerify: '核查项目',
  systemVersion: '系统版本',
  ruleDesc: '规则说明',
  actions: '操作',
};
const rows = ref([
  {
    index: 1,
    itemNameForVerify: '检测项1',
    systemVersion: 'Windows Server 2025',
    ruleDesc: '主机配置的关键文件/目录不得缺失',
    isEnabled: true
  },
  {
    index: 2,
    itemNameForVerify: '检测项2',
    systemVersion: 'Windows Server 2025',
    ruleDesc: '规则说明2',
    isEnabled: false
  },
  {
    index: 3,
    itemNameForVerify: '检测项3',
    systemVersion: 'RHEL 9',
    ruleDesc: '主机网络连接白名单内不得包含高危端口；目的端口和目的IP固定一个；主机源IP为一个IP地址或者少于20个IP地址段，服务端主机端口为1024-65535.',
    isEnabled: true
  },
  {index: 4, itemNameForVerify: '检测项4', systemVersion: 'Ubuntu 24 LTS', ruleDesc: '规则说明4', isEnabled: false},
])
const options = ref([
  {label: '主机策略', value: '主机策略'},
  {label: '纵向策略', value: '纵向策略'},
  {label: '隔离策略', value: '隔离策略'},
  {label: '防火墙策略', value: '防火墙策略'},
])

// 5. 定义操作方法 (可选，用于演示)
function editItem(item) {
  alert(`编辑: ${item.itemNameForTesting}`);
}

function deleteItem(item) {
  if (confirm(`确认删除 "${item.itemNameForTesting}"?`)) {
    rows.value = rows.value.filter(r => r.index !== item.index);
    alert('删除成功');
  }
}
</script>

<template>
  <div class="q-gutter-y-md">
    <div class="row">
      <q-select v-model="model" filled :options="options" label="策略类型" class="col-4"/>
    </div>
    <common-enhanced-table
        title="告警验证配置"
        :rows="rows"
        row-key="index"
        :column-labels="labels"
        :non-sortable-columns="['actions']"
        :non-searchable-columns="['index', 'actions', 'isEnabled']"
    >
      <template #cell-isEnabled="{ row }">
        <q-toggle v-model="row.isEnabled"/>
      </template>
      <template #cell-actions="{ row }">
        <q-btn flat dense color="primary" @click="editItem(row)">编辑</q-btn>
        <q-btn flat dense color="red-10" @click="deleteItem(row)">删除</q-btn>
      </template>
    </common-enhanced-table>
  </div>
</template>

<style scoped>

</style>