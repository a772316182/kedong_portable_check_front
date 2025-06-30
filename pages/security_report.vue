<script setup lang="ts">
// 2. 保留与业务逻辑和数据获取相关的状态
const dialog = ref(false);
const rows = ref<any[]>([]);

// 3. 保留数据生成逻辑
const generateTestData = () => {
  const data = [];
  for (let i = 1; i <= 250; i++) {
    data.push({
      index: i,
      reportName: `富国站验收任务 ${i}`,
      stationName: '富国站',
      createTime: '2024-09-09 00:00:00',
      operator: i % 2 === 0 ? '张三' : '李四',
    });
  }
  return data;
};

onMounted(() => {
  rows.value = generateTestData();
});

// 4. 为 GenericTable 定义 props，替换旧的 `columns` 数组
const labels = {
  index: '编号',
  reportName: '报告名称',
  stationName: '厂站名称',
  createTime: '创建时间',
  operator: '操作人',
  actions: '操作',
};

// 5. 定义业务操作方法
function viewReport(item: any) {
  console.log('View item:', item);
  alert(`正在查看: ${item.reportName}`);
}

function downloadReport(item: any) {
  console.log('Download item:', item);
  alert(`正在下载: ${item.reportName}`);
}

function deleteReport(item: any) {
  console.log('Delete item:', item);
  alert(`正在删除: ${item.reportName}`);
}
</script>

<template>
  <q-page class="q-pa-md  q-gutter-y-md">
    <q-card flat>
      <q-card-section>
        <common-enhanced-table
            title="报告列表"
            :rows="rows"
            :column-labels="labels"
            row-key="index"
            :non-sortable-columns="['index', 'institution', 'actions']"
            :non-searchable-columns="['index', 'actions']"
        >
          <template #top-right>
            <q-btn label="生成报告" color="primary" @click="dialog = true"/>

          </template>
          <template #cell-actions="{ row }">
            <q-btn v-close-popup flat dense label="查看" color="indigo-10" @click="viewReport(row)"/>
            <q-btn v-close-popup flat dense label="下载" color="primary" @click="downloadReport(row)"/>
            <q-btn v-close-popup flat dense label="删除" color="red-10" @click="deleteReport(row)"/>
          </template>
        </common-enhanced-table>
      </q-card-section>
    </q-card>

  </q-page>
</template>