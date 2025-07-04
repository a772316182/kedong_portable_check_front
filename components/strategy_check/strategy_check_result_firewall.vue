<script setup lang="ts">


const selectedRows = ref([])

const showPolicyDialog = ref(false);
const currentDevice = ref(null);


const devices = ref([
  {
    index: 1, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '合格'
  },
  {
    index: 2, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '不合格'
  },
  {
    index: 3, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '不合格'
  },
  {
    index: 4, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '不合格'
  },
  {
    index: 5, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '不合格'
  },
  {
    index: 6, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '不合格'
  },
  {
    index: 7, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '不合格'
  },
  {
    index: 8, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '不合格'
  },
  {
    index: 9, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '不合格'
  },
  {
    index: 10, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '不合格'
  },
  {
    index: 11, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '不合格'
  },
  {
    index: 12, name: '山东省调', ip: '10.200.114.23', type: '防火墙', zone: 'Ⅰ区', count: '1', result: '不合格'
  }
])

const columns = {
  index: '序号',
  name: '设备名称',
  type: '设备类型',
  ip: '设备IP1',
  zone: '安全区',
  count: '策略数量',
  result: '核查结果'
}

function handlePolicyClick(row: any) {
    if (row.result === '不合格') {
        currentDevice.value = row;
        showPolicyDialog.value = true;
    }
}

</script>

<template>
  <q-card flat>
    <q-card-section>
      <common-enhanced-table

          title="防火墙策略核查结果"
          :rows="devices"
          :column-labels="columns"
          row-key="index"

      >


        <template #cell-result="{ row }">
          <q-btn outline :color="row.result === '合格' ? 'indigo-10' : 'red-10'" 
          @click="handlePolicyClick(row)">{{ row.result }}</q-btn>
        </template>
      </common-enhanced-table>
    </q-card-section>
  </q-card>
  <strategy-check-result-firewall-dialog v-model="showPolicyDialog" :currentDevice="currentDevice"/>
</template>

