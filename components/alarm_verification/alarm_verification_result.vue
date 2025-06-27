<script setup lang="ts">
const emit = defineEmits(['prev', 'reset'])

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
    type: '监测装置', result: '合格'
  },
  {
    index: 2, zone: 'Ⅱ区', device: '济南地调_金牛站_Ⅱ区_OM', name: '山东省调',ip: '10.200.114.23',
    type: '主机', result: '合格'
  },
  {
    index: 3, zone: 'Ⅰ区', device: '济南地调_龙亭站_济南_SVR_1234', name: '山东省调',ip: '10.200.114.24',
    type: '主机', result: '合格'
  },
  {
    index: 4, zone: 'Ⅰ区', device: '山东省调_雷国站_DCD_1161', name: '山东省调',ip: '10.200.114.34',
    type: '主机', result: '合格'
  },
  {
    index: 5, zone: 'Ⅰ区', device: '济南地调_和平2站_Ⅱ区_OM', name: '山东省调',ip: '10.200.114.23',
    type: '主机', result: '合格'
  },
  {
    index: 6, zone: 'Ⅰ区', device: '济南地调_和平3站_Ⅱ区_SVR_1234', name: '山东省调',ip: '10.200.114.23',
    type: '主机', result: '合格'
  },
  {
    index: 7, zone: 'Ⅱ区', device: '山东省调_曹州站_Ⅱ区_电...', name: '山东省调', ip: '10.200.114.24',
    type: '监测装置', result: '合格'
  },
  {
    index: 8, zone: 'Ⅱ区', device: '济南地调_金牛站_Ⅱ区_OM', name: '山东省调',ip: '10.200.114.23',
    type: '主机', result: '合格'
  },
  {
    index: 9, zone: 'Ⅰ区', device: '济南地调_龙亭站_济南_SVR_1234', name: '山东省调',ip: '10.200.114.24',
    type: '主机', result: '合格'
  },
  {
    index: 10, zone: 'Ⅰ区', device: '山东省调_雷国站_DCD_1161', name: '山东省调',ip: '10.200.114.34',
    type: '主机', result: '合格'
  },
  {
    index: 11, zone: 'Ⅰ区', device: '济南地调_和平2站_Ⅱ区_OM', name: '山东省调',ip: '10.200.114.23',
    type: '主机', result: '合格'
  },
  {
    index: 12, zone: 'Ⅰ区', device: '济南地调_和平3站_Ⅱ区_SVR_1234', name: '山东省调',ip: '10.200.114.23',
    type: '主机', result: '合格'
  }
])

const columns = [
  { name: 'zone', label: '安全区', field: 'zone', align: 'left' },
  { name: 'device', label: '检测装置', field: 'device', align: 'left' },
  { name: 'name', label: '设备名称', field: 'name', align: 'left' },
  { name: 'type', label: '设备类型', field: 'type', align: 'left' },
  { name: 'ip', label: '设备IP', field: 'ip', align: 'left' },
  { name: 'result', label: '告警验证结果', field: 'result', align: 'left' }
]

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
  <div class="col q-pa-md">
      <q-card flat>
      

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
            
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
            </q-th>
            </q-tr>
        </template>

        <template #body="props">
            <q-tr :props="props">
            
            <q-td key="zone">{{ props.row.zone }}</q-td>
            <q-td key="device">{{ props.row.device }}</q-td>
            <q-td key="name">{{ props.row.name }}</q-td>
            <q-td key="type">{{ props.row.type }}</q-td>
            <q-td key="ip">{{ props.row.ip }}</q-td>
            <q-td key="result">{{ props.row.result }}</q-td>
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

    <div class="row justify-center q-gutter-sm q-mt-md">
      <q-btn color="primary" flat label="上一步" @click="emit('prev')" />
      <q-btn color="primary" label="完成" @click="emit('reset')" />
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