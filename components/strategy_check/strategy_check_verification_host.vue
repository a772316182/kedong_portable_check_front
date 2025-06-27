<script setup lang="ts">
import { ref } from 'vue'




const emit = defineEmits(['prev', 'next'])

const zone1Checked = ref(false);
const zone2Checked = ref(false);
const customPage = ref(null)
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const showDialog = ref(false) // 新增：控制对话框显示的状态
const isConnected = ref(false) // 新增：复选框状态

const rows = ref([])
const totalRows = ref(0)

const devices = ref([
  {
    index: 1,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'XXXXXX',count:'90'
  },
  {
    index: 2,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'XXXXXX',count:'90'
  },
  {
    index: 3,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'XXXXXX',count:'90'
  },
  {
    index: 4,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'XXXXXX',count:'90'
  },
  {
    index: 5,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'XXXXXX',count:'90'
  },
  {
    index: 6,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'XXXXXX',count:'90'
  },
  {
    index: 7,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'XXXXXX',count:'90'
  },
  {
    index: 8,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'XXXXXX',count:'90'
  },
  {
    index: 9,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'XXXXXX',count:'90'
  },
  {
    index: 10,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'XXXXXX',count:'90'
  },
  {
    index: 11,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'XXXXXX',count:'90'
  },
  {
    index: 12,name: '山东省调', zone: 'Ⅰ区',ip1: '10.200.114.23', ip2: '10.200.114.23',type: '主机',device: '济南地调_和平3站_Ⅱ区_SVR_1234', 
     system: 'linux',count:'90'
  }
])

const columns = [
  { name: 'index', label: '编号', field: 'index', align: 'left' },
  { name: 'name', label: '设备名称', field: 'name', align: 'left' },
  { name: 'zone', label: '安全区', field: 'zone', align: 'left' },
  { name: 'ip1', label: '设备IP1', field: 'ip1', align: 'left' },
  { name: 'ip2', label: '设备IP2', field: 'ip2', align: 'left' },
  { name: 'type', label: '设备类型', field: 'type', align: 'left' },
  { name: 'device', label: '站内设备类型', field: 'device', align: 'left' }, 
  { name: 'system', label: '操作系统', field: 'system', align: 'left' },
  { name: 'count', label: '策略数', field: 'count', align: 'left' }
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

// 新增：处理开始按钮点击事件
function handleStart() {
  if (isConnected.value) {
    // 执行获取策略的逻辑
    showDialog.value = false
  } else {
    // 可以添加提示用户需要先勾选复选框的逻辑
  }
}

// 新增状态
const showPolicyDialog = ref(false)
const currentDevice = ref(null)

// 新增方法：处理点击策略数
function handlePolicyClick(device) {
  currentDevice.value = device
  showPolicyDialog.value = true
}

</script>

<template>
  <div class="row no-wrap">
    <!-- 左侧过滤 -->
    <div style="width: 300px; background: #f8f8f8; padding: 16px;">
        <table style="width: 100%; border-collapse: collapse;">
            <!-- Table Header -->
            <thead>
            <tr style="font-weight: bold; text-align: left;">
                <th style="padding: 8px 0;">监测装置</th>
                <th style="padding: 8px 0;">资产数量</th>
            </tr>
            </thead>
            
            <!-- Table Body -->
            <tbody>
            <tr>
                <td style="padding: 8px 0;">
                <q-checkbox v-model="zone1Checked" label="Ⅰ区装置1.1.1.1" />
                </td>
                <td style="padding: 8px 0;">1</td>
            </tr>
            <tr>
                <td style="padding: 8px 0;">
                <q-checkbox v-model="zone2Checked" label="Ⅱ区装置1.1.1.1" />
                </td>
                <td style="padding: 8px 0;">1</td>
            </tr>
            </tbody>
        </table>
        </div>


    <!-- 中间内容 -->
    <div class="col q-pa-md">
      <q-card flat>
      <q-card-section>
        <q-btn label="自动获取" color="primary"  @click="showDialog = true"/>
      </q-card-section>

      <!-- 对话框 -->
        <q-dialog v-model="showDialog" persistent>
          <q-card style="min-width: 400px">
            <q-card-section>
              <div class="text-h6">请将检查设备接入监测装置，用于获取主机策略</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-checkbox v-model="isConnected" label="我已接入" />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn v-close-popup flat label="取消" color="primary" />
              <q-btn flat label="开始" color="primary" @click="handleStart" />
            </q-card-actions>
          </q-card>
        </q-dialog>

      <q-card-section>
        <q-table
        v-model:pagination="pagination"
        square
        no-data-label="暂无数据"
        flat
        v-model:selected="selectedRows"
        bordered
        :rows="rows.slice(
            (pagination.page - 1) * pagination.rowsPerPage,
            pagination.page * pagination.rowsPerPage
        )"
        :columns="columns"
        row-key="index"
        :table-row-class-fn="rowClassFn"
        hide-pagination
        style="height: 500px;"
        virtual-scroll
        class="custom-table"
        selection="multiple"
        >
        <template #header="props">
            <q-tr :props="props" class="custom-header">
            <q-th auto-width>
                <q-checkbox
                v-model="props.selected"
                indeterminate-value="some"
                @update:model-value="selectAllRows(props)"
                />
            </q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
            </q-th>
            </q-tr>
        </template>

        <template #body="props">
            <q-tr :props="props">
            <q-td auto-width>
                <q-checkbox v-model="props.selected" />
            </q-td>
            <q-td key="index">{{ props.row.index }}</q-td>
            <q-td key="name">{{ props.row.name }}</q-td>
            <q-td key="zone">{{ props.row.zone }}</q-td>
            <q-td key="ip1">{{ props.row.ip1 }}</q-td>
            <q-td key="ip2">{{ props.row.ip2 }}</q-td>
            <q-td key="type">{{ props.row.type }}</q-td>
            <q-td key="device">{{ props.row.device }}</q-td>
            <q-td key="system">{{ props.row.system }}</q-td>
            <!-- <q-td key="count">{{ props.row.count }}</q-td> -->
            <q-td key="count">
              <a href="javascript:void(0)" @click="handlePolicyClick(props.row)">{{ props.row.count }}</a>
            </q-td>
            </q-tr>
        </template>
    </q-table>

        <div class="row items-center justify-start q-mt-md">
          <div class="text-caption q-mr-md">
            第 {{ currentPageRange.start }}-{{ currentPageRange.end }} 条，共 {{ totalRows }} 条
          </div>

          <q-pagination
            v-model="pagination.page"
            :max="Math.ceil(totalRows / pagination.rowsPerPage)"
            :max-pages="6"
            direction-links
            boundary-links
            boundary-numbers
            size="sm"
            flat
            color="black"
            active-color="primary"
            class="my-pagination-custom q-mr-md"
          />

          <div class="text-caption custom-page-size q-mr-md">
            {{ pagination.rowsPerPage }} 条/页
          </div>

          <div class="row items-center">
            <span class="q-mr-sm">跳至</span>
            <q-input
              v-model.number="customPage"
              type="number"
              dense
              style="width: 60px;"
              class="custom-jump-input"
              @keyup.enter="goToPage"
            />
            <span class="q-ml-sm">页</span>
          </div>
        </div>
      </q-card-section>
    </q-card>
      
    </div>
    <PolicyDialog v-model="showPolicyDialog" />
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
