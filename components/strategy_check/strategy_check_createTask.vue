<script setup lang="ts">

// --- Page-specific State & Logic ---
const dialog = ref(false);
const selectedRows = ref([]);
const rows = ref<any[]>([]);
const emit = defineEmits(['next']);

// --- Data Generation & Business Logic ---
const generateTestData = () => {
  const data = [];
  for (let i = 1; i <= 250; i++) {
    data.push({
      index: i,
      reportName: `富国站验收任务 ${i}`,
      createTime: '2025-06-29 03:45:35', // Updated to current time for relevance
      area: `主机策略核查  纵向策略核查  隔离策略核查  防火墙策略核查`,
      operator: i % 2 === 0 ? '已完成' : '进行中',
    });
  }
  return data;
};

onMounted(() => {
  rows.value = generateTestData();
});

// Method for the "启动/暂停" button
const showVerification = () => {
  emit('next', 'AlarmVerification');
};

// --- Configuration for GenericTable ---
const labels = {
  index: '编号',
  reportName: '任务名称',
  createTime: '创建时间',
  area: '检查范围',
  operator: '任务状态',
  actions: '操作',
};

</script>

<template>
  <q-page class="q-pa-md">
    <q-card flat>
      <q-card-section>
        <common-enhanced-table
            v-model:selection="selectedRows"
            :rows="rows"
            :column-labels="labels"
            title="核查任务表"
            row-key="index"
            enable-selection
            :non-sortable-columns="['index', 'institution', 'actions']"
            :non-searchable-columns="['index', 'actions']"
        >
          <template #top-right>
            <q-btn label="创建核查任务" color="primary" @click="dialog = true"/>
          </template>
          <template #cell-area="{ row }">
            <div class="row q-gutter-xs items-center no-wrap">
              <common-status-chip
                  v-for="policy in row.area.split('  ').filter(p => p)"
                  :key="policy"
                  :label="policy"
              />
            </div>
          </template>
          <template #cell-operator="{ row }">
            <div class="row q-gutter-xs items-center no-wrap">
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
            <q-btn color="primary" flat dense>查看</q-btn>
            <q-btn color="red-10" flat dense>删除</q-btn>
          </template>

        </common-enhanced-table>
      </q-card-section>
    </q-card>
    <strategy-check-createdialog v-model="dialog"/>
  </q-page>
</template>