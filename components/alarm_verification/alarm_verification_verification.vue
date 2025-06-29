<script setup lang="ts">

// --- Page-specific State & Logic ---
const emit = defineEmits(['prev', 'next']);

// --- 表格相关 ---
const selectedRows = ref([]);
const allDevices = ref<any[]>([]);

// --- 筛选逻辑 (优化) ---
// 1. 将筛选选项数据结构化
const filterOptions = ref([
  {id: 'zone1', label: 'Ⅰ区', checked: false, value: 'Ⅰ区'},
  {id: 'zone2', label: 'Ⅱ区', checked: false, value: 'Ⅱ区'},
]);

// 2. 过滤后的设备列表 (逻辑更清晰)
const filteredDevices = computed(() => {
  const selectedZones = filterOptions.value
      .filter(opt => opt.checked)
      .map(opt => opt.value);

  if (selectedZones.length === 0) {
    return allDevices.value;
  }
  return allDevices.value.filter(device => selectedZones.includes(device.zone));
});

// 计算每个区域的设备数量
const getZoneCount = (zoneValue: string) => {
  return allDevices.value.filter(d => d.zone === zoneValue).length;
};

const devicesData = [

  {

    index: 1, zone: 'Ⅱ区', device: '山东省调_曹州站_Ⅱ区_电...', name: '山东省调', ip: '10.200.114.24',

    type: '监测装置', status: '未开始'

  },

  {

    index: 2, zone: 'Ⅱ区', device: '济南地调_金牛站_Ⅱ区_OM', name: '山东省调', ip: '10.200.114.23',

    type: '主机', status: '进行中'

  },

  {

    index: 3, zone: 'Ⅰ区', device: '济南地调_龙亭站_济南_SVR_1234', name: '山东省调', ip: '10.200.114.24',

    type: '主机', status: '已完成'

  },

  {

    index: 4, zone: 'Ⅰ区', device: '山东省调_雷国站_DCD_1161', name: '山东省调', ip: '10.200.114.34',

    type: '主机', status: '已完成'

  },

  {

    index: 5, zone: 'Ⅰ区', device: '济南地调_和平2站_Ⅱ区_OM', name: '山东省调', ip: '10.200.114.23',

    type: '主机', status: '未开始'

  },

  {

    index: 6, zone: 'Ⅰ区', device: '济南地调_和平3站_Ⅱ区_SVR_1234', name: '山东省调', ip: '10.200.114.23',

    type: '主机', status: '未开始'

  },

  {

    index: 7, zone: 'Ⅱ区', device: '山东省调_曹州站_Ⅱ区_电...', name: '山东省调', ip: '10.200.114.24',

    type: '监测装置', status: '未开始'

  },

  {

    index: 8, zone: 'Ⅱ区', device: '济南地调_金牛站_Ⅱ区_OM', name: '山东省调', ip: '10.200.114.23',

    type: '主机', status: '进行中'

  },

  {

    index: 9, zone: 'Ⅰ区', device: '济南地调_龙亭站_济南_SVR_1234', name: '山东省调', ip: '10.200.114.24',

    type: '主机', status: '已完成'

  },

  {

    index: 10, zone: 'Ⅰ区', device: '山东省调_雷国站_DCD_1161', name: '山东省调', ip: '10.200.114.34',

    type: '主机', status: '已完成'

  },

  {

    index: 11, zone: 'Ⅰ区', device: '济南地调_和平2站_Ⅱ区_OM', name: '山东省调', ip: '10.200.114.23',

    type: '主机', status: '未开始'

  },

  {

    index: 12, zone: 'Ⅰ区', device: '济南地调_和平3站_Ⅱ区_SVR_1234', name: '山东省调', ip: '10.200.114.23',

    type: '主机', status: '未开始'

  }

];

onMounted(() => {
  allDevices.value = devicesData;
});

// --- 表格配置 (保持不变) ---
const labels = {
  zone: '安全区',
  device: '监测装置',
  name: '设备名称',
  type: '设备类型',
  ip: '设备IP',
  status: '核查进度'
};
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
            <q-checkbox v-model="option.checked"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ option.label }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-badge color="grey-6" :label="getZoneCount(option.value)"/>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="col q-pa-md">
      <q-card flat>
        <q-card-section>
          <common-enhanced-table
              v-model:selection="selectedRows"
              :rows="filteredDevices"
              :column-labels="labels"
              title="告警验证规则表"
              row-key="index"
              enable-selection
              :non-sortable-columns="['index', 'institution', 'actions']"
              :non-searchable-columns="['index', 'actions']"
          >
            <template #top-right>
              <q-btn label="批量验收选择的告警" color="primary"/>
            </template>
          </common-enhanced-table>
        </q-card-section>
      </q-card>

      <div class="row justify-center q-gutter-sm q-mt-md">
        <q-btn label="上一步" color="primary" flat @click="emit('prev')"/>
        <q-btn label="下一步" color="primary" @click="emit('next')"/>
      </div>
    </div>
  </div>
</template>