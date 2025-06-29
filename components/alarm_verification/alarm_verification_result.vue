<script setup lang="ts">
import {onMounted, ref} from 'vue';
// 1. Import our powerful and reusable GenericTable component

// --- Page-specific State & Logic ---
const emit = defineEmits(['prev', 'reset']);

// The raw data for the table
const rows = ref<any[]>([]);

const devicesData = [
  {
    index: 1, zone: 'Ⅱ区', device: '山东省调_曹州站_Ⅱ区_电...', name: '山东省调', ip: '10.200.114.24',
    type: '监测装置', result: '合格'
  },
  {
    index: 2, zone: 'Ⅱ区', device: '济南地调_金牛站_Ⅱ区_OM', name: '山东省调', ip: '10.200.114.23',
    type: '主机', result: '合格'
  },
  {
    index: 3, zone: 'Ⅰ区', device: '济南地调_龙亭站_济南_SVR_1234', name: '山东省调', ip: '10.200.114.24',
    type: '主机', result: '合格'
  },
  {
    index: 4, zone: 'Ⅰ区', device: '山东省调_雷国站_DCD_1161', name: '山东省调', ip: '10.200.114.34',
    type: '主机', result: '合格'
  },
  {
    index: 5, zone: 'Ⅰ区', device: '济南地调_和平2站_Ⅱ区_OM', name: '山东省调', ip: '10.200.114.23',
    type: '主机', result: '合格'
  },
  {
    index: 6, zone: 'Ⅰ区', device: '济南地调_和平3站_Ⅱ区_SVR_1234', name: '山东省调', ip: '10.200.114.23',
    type: '主机', result: '合格'
  },
  {
    index: 7, zone: 'Ⅱ区', device: '山东省调_曹州站_Ⅱ区_电...', name: '山东省调', ip: '10.200.114.24',
    type: '监测装置', result: '合格'
  },
  {
    index: 8, zone: 'Ⅱ区', device: '济南地调_金牛站_Ⅱ区_OM', name: '山东省调', ip: '10.200.114.23',
    type: '主机', result: '合格'
  },
  {
    index: 9, zone: 'Ⅰ区', device: '济南地调_龙亭站_济南_SVR_1234', name: '山东省调', ip: '10.200.114.24',
    type: '主机', result: '合格'
  },
  {
    index: 10, zone: 'Ⅰ区', device: '山东省调_雷国站_DCD_1161', name: '山东省调', ip: '10.200.114.34',
    type: '主机', result: '合格'
  },
  {
    index: 11, zone: 'Ⅰ区', device: '济南地调_和平2站_Ⅱ区_OM', name: '山东省调', ip: '10.200.114.23',
    type: '主机', result: '合格'
  },
  {
    index: 12, zone: 'Ⅰ区', device: '济南地调_和平3站_Ⅱ区_SVR_1234', name: '山东省调', ip: '10.200.114.23',
    type: '主机', result: '合格'
  }
];

onMounted(() => {
  rows.value = devicesData;
});

// 2. Define the column headers for our GenericTable
const labels = {
  zone: '安全区',
  device: '检测装置',
  name: '设备名称',
  type: '设备类型',
  ip: '设备IP',
  result: '告警验证结果'
};

</script>

<template>
  <div class="col q-pa-md">
    <q-card flat>
      <q-card-section>
        <common-enhanced-table
            title="验证结果表"
            :rows="rows"
            :column-labels="labels"
            row-key="index"
            :non-sortable-columns="['index', 'institution', 'actions']"
            :non-searchable-columns="['index', 'actions']"
        />
      </q-card-section>
    </q-card>

    <div class="row justify-center q-gutter-sm q-mt-md">
      <q-btn color="primary" flat label="上一步" @click="emit('prev')"/>
      <q-btn color="primary" label="完成" @click="emit('reset')"/>
    </div>
  </div>
</template>

<style scoped>
/*
  All custom CSS can now be removed to embrace the unified style
  provided by the GenericTable component.
*/
</style>