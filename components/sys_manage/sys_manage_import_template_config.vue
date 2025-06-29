<script setup lang="ts">

const labels = {
  index: "序号",
  name: "模板名称",
  filePath: "文件路径",
  note: "备注",
  actions: "操作",
}

const rows = ref([
  {
    index: 1,
    name: "主机策略1",
    filePath: "D:/host_policy.xml",
    note: "备注1：测试1：测试2：测试3：测试4：测试5",
  },
  {
    index: 2,
    name: "主机策略2",
    filePath: "D:/host_policy.xml",
    note: "备注1：测试1：测试2：测试3：测试4：测试5",
  },
  {
    index: 3,
    name: "主机策略3",
    filePath: "D:/host_policy.xml",
    note: "备注1：测试1：测试2：测试3：测试4：测试5",
  },
  {
    index: 4,
    name: "主机策略4",
    filePath: "D:/host_policy.xml",
    note: "备注1：测试1：测试2：测试3：测试4：测试5",
  },
])

function downloadItem(item) {
  alert(`下载: ${item.itemNameForTesting}`);
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
    <common-enhanced-table
        title="导入模版配置"
        :rows="rows"
        row-key="index"
        :column-labels="labels"
        :non-sortable-columns="['actions']"
        :non-searchable-columns="['index', 'actions', 'isEnabled']"
    >
      <template #top-right>
        <q-btn color="primary" class="col-md-2 col-lg-1 col-sm-2">添加模板</q-btn>
      </template>

      <template #cell-actions="{ row }">
        <q-btn flat dense color="primary" @click="downloadItem(row)">下载</q-btn>
        <q-btn flat dense color="red-10" @click="deleteItem(row)">删除</q-btn>
      </template>
    </common-enhanced-table>
  </div>
</template>

<style scoped></style>
