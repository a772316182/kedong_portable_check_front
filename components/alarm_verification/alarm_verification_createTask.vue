<script setup lang="ts">

// 2. Keep state related to the page's business logic
const dialog = ref(false);
const selectedRows = ref([]); // For v-model:selection
const rows = ref<any[]>([]);

// Define emits
const emit = defineEmits(['next']);

// 3. Keep data generation logic
const generateTestData = () => {
  const data = [];
  for (let i = 1; i <= 250; i++) {
    data.push({
      index: i,
      reportName: `富国站验收任务 ${i}`,
      createTime: '2024-09-09 00:00:00',
      area: `安全${Math.ceil(Math.random() * 2)}区`,
      operator: i % 2 === 0 ? '已完成' : '进行中',
    });
  }
  return data;
};

onMounted(() => {
  rows.value = generateTestData();
});

// 4. Define configuration for GenericTable
const labels = {
  index: '编号',
  reportName: '任务名称',
  createTime: '创建时间',
  area: '核查范围',
  operator: '任务状态',
  actions: '操作',
};

// 5. Keep page-specific methods
const showVerification = () => {
  emit('next', 'AlarmVerification');
};

function viewDetails(item: any) {
  alert(`查看: ${item.reportName}`);
}

function deleteTask(item: any) {
  if (confirm(`确定要删除任务 "${item.reportName}" 吗?`)) {
    rows.value = rows.value.filter(r => r.index !== item.index);
    alert('删除成功');
  }
}

/*
  NOTE: The following state and methods have been removed because GenericTable handles them:
  - `columns` array
  - `pagination`, `customPage`, `totalRows` refs
  - `currentPageRange` computed property
  - `goToPage` function
  - The custom q-table body/header templates and the manual pagination HTML
*/
</script>

<template>
  <common-enhanced-table
      v-model:selection="selectedRows"
      :rows="rows"
      :column-labels="labels"
      title="核查任务列表"
      row-key="index"
      enable-selection
      :non-sortable-columns="['index', 'institution', 'actions']"
      :non-searchable-columns="['index', 'actions']"
  >
    <template #top-right>
      <q-btn label="创建核查任务" color="primary" @click="dialog = true"/>

    </template>
    <template #cell-area="{ row }">
      <div class="row q-gutter-x-sm items-center no-wrap">
        <common-status-chip :is-auto-color="false" label="安全1区" color="indigo-10"/>
        <common-status-chip :is-auto-color="false" label="安全2区" color="green-10"/>
      </div>
    </template>
    <template #cell-operator="{ row }">
      <div class="row q-gutter-x-sm items-center no-wrap">
        <common-status-chip :label="row.operator"/>
      </div>
    </template>

    <template #cell-actions="{ row }">
      <q-btn
          :color="row.operator === '进行中' ? 'indigo-10' : 'red-10'"
          flat
          dense
          @click="showVerification"
      >
        {{ row.operator === '进行中' ? '启动' : '暂停' }}
      </q-btn>
      <q-btn color="primary" flat dense @click="viewDetails(row)">
        查看
      </q-btn>
      <q-btn color="red-10" flat dense @click="deleteTask(row)">
        删除
      </q-btn>
    </template>
  </common-enhanced-table>
</template>

<style scoped>
/*
  The extensive custom styles for header and pagination can be removed,
  as the table will now use the unified style of GenericTable.
*/
</style>