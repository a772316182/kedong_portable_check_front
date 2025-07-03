<script setup lang="ts">
const selectedRows = ref([])

const showPolicyDialog = ref(false);
const currentDevice = ref(null);

const devices = ref([
  {
    index: 1, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  },
  {
    index: 2, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  },
  {
    index: 3, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  },
  {
    index: 4, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  },
  {
    index: 5, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  },
  {
    index: 6, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  },
  {
    index: 7, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  },
  {
    index: 8, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  },
  {
    index: 9, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  },
  {
    index: 10, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  },
  {
    index: 11, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  },
  {
    index: 12, name: '山东省调', ip: '10.200.114.23', type: '隔离', zone: 'Ⅰ区', count: '1'
  }
])

const columns = {
  index: '序号',
  name: '设备名称',
  ip: '设备IP',
  type: '设备类型',
  zone: '安全区',
  count: '策略数量'
}

function handlePolicyClick(name: any) {
  currentDevice.value = name;
  showPolicyDialog.value = true;
}


</script>

<template>
  <q-card flat>
    <q-card-section>
      <common-enhanced-table
          v-model:selection="selectedRows"
          title="隔离策略表"
          :rows="devices"
          :column-labels="columns"
          row-key="index"
          enable-selection
          :non-sortable-columns="['index', 'institution', 'actions']"
          :non-searchable-columns="['index', 'actions']"
      >
        <template #top-right>
          <q-btn label="策略导入" color="primary"/>
        </template>

        <template #cell-count="{ row }">
          <q-btn outline color="primary" @click="handlePolicyClick(row)">{{ row.count }}</q-btn>
        </template>
      </common-enhanced-table>
    </q-card-section>
  </q-card>
  <strategy-check-verification-isolation-dialog v-model="showPolicyDialog" :name="currentDevice"/>
</template>

