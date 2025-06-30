<script setup lang="ts">
// 3. 原始数据保持不变
const rows = ref([
  {index: 1, itemNameForTesting: "检测项1", itemTypeForTesting: "类型1", ruleDesc: "规则说明1", isEnabled: true},
  {index: 2, itemNameForTesting: "检测项2", itemTypeForTesting: "类型2", ruleDesc: "规则说明2", isEnabled: false},
  {index: 3, itemNameForTesting: "检测项3", itemTypeForTesting: "类型3", ruleDesc: "规则说明3", isEnabled: true},
  {index: 4, itemNameForTesting: "检测项4", itemTypeForTesting: "类型4", ruleDesc: "规则说明4", isEnabled: false},
]);

// 4. 不再需要 `columns` 数组，用 `labels` 对象代替
const labels = {
  index: "序号",
  isEnabled: "是否启用",
  itemNameForTesting: "检测项名称",
  itemTypeForTesting: "检测类型",
  ruleDesc: "规则说明",
  actions: "操作",
};

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
  <div>
    <common-enhanced-table
        title="基线核查配置"
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

<style scoped></style>