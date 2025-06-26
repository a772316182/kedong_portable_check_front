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

const rows = ref([])
const totalRows = ref(0)

const devices = ref([
  {
    index: 1,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  },
  {
    index: 2,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  },
  {
    index: 3,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  },
  {
    index: 4,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  },
  {
    index: 5,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  },
  {
    index: 6,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  },
  {
    index: 7,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  },
  {
    index: 8,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  },
  {
    index: 9,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  },
  {
    index: 10,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  },
  {
    index: 11,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  },
  {
    index: 12,name: '山东省调', ip: '10.200.114.23',type: '纵向',zone: 'Ⅰ区', count:'1'
  }
])

const columns = [
  { name: 'index', label: '编号', field: 'index', align: 'left' },
  { name: 'name', label: '设备名称', field: 'name', align: 'left' },
  { name: 'ip', label: '设备IP', field: 'ip', align: 'left' },
  { name: 'type', label: '设备类型', field: 'type', align: 'left' },
  { name: 'zone', label: '安全区', field: 'zone', align: 'left' },
  { name: 'count', label: '策略数量', field: 'count', align: 'left' }
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
      <q-card flat>
      <q-card-section>
        <q-btn label="策略导入" color="primary"  />
      </q-card-section>

      <q-card-section>
        <q-table
        square
        no-data-label="暂无数据"
        flat
        bordered
        :rows="rows.slice(
            (pagination.page - 1) * pagination.rowsPerPage,
            pagination.page * pagination.rowsPerPage
        )"
        :columns="columns"
        row-key="index"
        :table-row-class-fn="rowClassFn"
        :pagination.sync="pagination"
        hide-pagination
        style="height: 500px;"
        virtual-scroll
        class="custom-table"
        selection="multiple"
        v-model:selected="selectedRows"
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
            <q-td key="ip">{{ props.row.ip }}</q-td>
            <q-td key="type">{{ props.row.type }}</q-td>
            <q-td key="zone">{{ props.row.zone }}</q-td>
            <q-td key="count">{{ props.row.count }}</q-td>
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
