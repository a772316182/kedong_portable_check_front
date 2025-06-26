<script setup lang="ts">
import { ref } from 'vue'
import HostPolicy from '~/components/strategy_check_verification_host.vue'
import VerticalPolicy from '~/components/strategy_check_verification_vertical.vue'
import IsolationPolicy from '~/components/strategy_check_verification_isolation.vue'
import FirewallPolicy from '~/components/strategy_check_verification_firewall.vue'

const activePolicy = ref('host') // 默认显示主机策略
const emit = defineEmits(['prev', 'next'])

const zone1Checked = ref(false);
const zone2Checked = ref(false);
const customPage = ref(null)
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const rows = ref([])
const totalRows = ref(0)

const devices = ref([
  {
    index: 1, zone: 'Ⅱ区', device: '山东省调_曹州站_Ⅱ区_电...', name: '山东省调', ip: '10.200.114.24',
    type: '监测装置', status: '未开始'
  },
  {
    index: 2, zone: 'Ⅱ区', device: '济南地调_金牛站_Ⅱ区_OM', name: '山东省调',ip: '10.200.114.23',
    type: '主机', status: '进行中'
  },
  {
    index: 3, zone: 'Ⅰ区', device: '济南地调_龙亭站_济南_SVR_1234', name: '山东省调',ip: '10.200.114.24',
    type: '主机', status: '已完成'
  },
  {
    index: 4, zone: 'Ⅰ区', device: '山东省调_雷国站_DCD_1161', name: '山东省调',ip: '10.200.114.34',
    type: '主机', status: '已完成'
  },
  {
    index: 5, zone: 'Ⅰ区', device: '济南地调_和平2站_Ⅱ区_OM', name: '山东省调',ip: '10.200.114.23',
    type: '主机', status: '未开始'
  },
  {
    index: 6, zone: 'Ⅰ区', device: '济南地调_和平3站_Ⅱ区_SVR_1234', name: '山东省调',ip: '10.200.114.23',
    type: '主机', status: '未开始'
  },
  {
    index: 7, zone: 'Ⅱ区', device: '山东省调_曹州站_Ⅱ区_电...', name: '山东省调', ip: '10.200.114.24',
    type: '监测装置', status: '未开始'
  },
  {
    index: 8, zone: 'Ⅱ区', device: '济南地调_金牛站_Ⅱ区_OM', name: '山东省调',ip: '10.200.114.23',
    type: '主机', status: '进行中'
  },
  {
    index: 9, zone: 'Ⅰ区', device: '济南地调_龙亭站_济南_SVR_1234', name: '山东省调',ip: '10.200.114.24',
    type: '主机', status: '已完成'
  },
  {
    index: 10, zone: 'Ⅰ区', device: '山东省调_雷国站_DCD_1161', name: '山东省调',ip: '10.200.114.34',
    type: '主机', status: '已完成'
  },
  {
    index: 11, zone: 'Ⅰ区', device: '济南地调_和平2站_Ⅱ区_OM', name: '山东省调',ip: '10.200.114.23',
    type: '主机', status: '未开始'
  },
  {
    index: 12, zone: 'Ⅰ区', device: '济南地调_和平3站_Ⅱ区_SVR_1234', name: '山东省调',ip: '10.200.114.23',
    type: '主机', status: '未开始'
  }
])

const columns = [
  { name: 'zone', label: '安全区', field: 'zone', align: 'left' },
  { name: 'device', label: '监测装置', field: 'device', align: 'left' },
  { name: 'name', label: '设备名称', field: 'name', align: 'left' },
  { name: 'type', label: '设备类型', field: 'type', align: 'left' },
  { name: 'ip', label: '设备IP', field: 'ip', align: 'left' },
  { name: 'status', label: '核查进度', field: 'status', align: 'left' }
]

const selectedRows = ref([])

function selectAllRows(props) {
  if (props.selected === true) {
    props.rows.forEach(row => {
      if (!selectedRows.value.includes(row)) {
        selectedRows.value.push(row)
      }
    })
  } else {
    props.rows.forEach(row => {
      const index = selectedRows.value.indexOf(row)
      if (index > -1) {
        selectedRows.value.splice(index, 1)
      }
    })
  }
}

const currentPageRange = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage + 1
  const end = Math.min(pagination.value.page * pagination.value.rowsPerPage, totalRows.value)
  return { start, end }
})

onMounted(() => {
  rows.value = devices.value
  totalRows.value = devices.value.length
  pagination.value.rowsNumber = devices.value.length
})

function goToPage() {
  if (!customPage.value) return
  const pageNum = parseInt(customPage.value)
  const maxPage = Math.ceil(totalRows.value / pagination.value.rowsPerPage)
  if (pageNum >= 1 && pageNum <= maxPage) {
    pagination.value.page = pageNum
    customPage.value = null
  }
}


</script>

<template>
  <!-- 中间内容 -->
<div class="col q-pa-md">
  <!-- 策略切换按钮 -->
  <div class="row q-gutter-sm q-mb-md">
    <q-btn label="主机策略维护" :color="activePolicy === 'host' ? 'primary' : 'grey'" @click="activePolicy = 'host'" />
    <q-btn label="纵向策略维护" :color="activePolicy === 'vertical' ? 'primary' : 'grey'" @click="activePolicy = 'vertical'" />
    <q-btn label="隔离策略维护" :color="activePolicy === 'isolation' ? 'primary' : 'grey'" @click="activePolicy = 'isolation'" />
    <q-btn label="防火墙策略维护" :color="activePolicy === 'firewall' ? 'primary' : 'grey'" @click="activePolicy = 'firewall'" />
  </div>

  <!-- 动态切换子组件 -->
  <div>
    <component :is="{
      host: HostPolicy,
      vertical: VerticalPolicy,
      isolation: IsolationPolicy,
      firewall: FirewallPolicy
    }[activePolicy]" />
  </div>

  <!-- 底部按钮保留 -->
  <div class="row justify-center q-gutter-sm q-mt-md">
    <q-btn label="上一步" color="primary" flat @click="emit('prev')" />
    <q-btn label="下一步" color="primary" @click="emit('next')" />
  </div>
</div>

</template>

<style scoped>
.custom-header {
  /* background-color: #2e7d32 !important; */
  background-color: #006A6A !important;
  color: white !important;
}

.custom-header th {
  font-weight: bold;
  color: white !important;
}

::v-deep(.my-pagination-custom .q-pagination__content .q-btn[aria-label*="页"]),
.custom-page-size,
::v-deep(.custom-jump-input .q-field__control) {
  /* border: 1px solid #2e7d32 !important; */
  border: 1px solid #3BB5A3 !important;
  border-radius: 4px !important;
}

::v-deep(.my-pagination-custom .q-pagination__content .q-btn[aria-label*="页"]) {
  /* background: #e8f5e9 !important;
  color: #2e7d32 !important; */
  background: #E0F2F1 !important;
  color: #3BB5A3 !important;
  min-width: 28px !important;
  min-height: 28px !important;
}

.custom-page-size {
  padding: 4px 8px;
  /* background-color: #e8f5e9 !important; */
  background-color: #E0F2F1 !important;
  color: black !important;
  min-height: 28px;
  display: flex;
  align-items: center;
}

::v-deep(.custom-jump-input .q-field__control) {
  /* background-color: #e8f5e9 !important; */
  background-color: #E0F2F1 !important;
  height: 28px !important;
  min-height: unset !important;
}

::v-deep(.custom-jump-input .q-field__native) {
  color: black !important;
  padding: 0 8px;
  height: 26px !important;
}

::v-deep(.custom-jump-input) {
  height: 28px !important;
}
</style>
