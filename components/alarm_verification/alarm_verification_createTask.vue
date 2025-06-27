<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const dialog = ref(false)
const customPage = ref(null)
const selectedRows = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const generateTestData = () => {
  const data = []
  for (let i = 1; i <= 250; i++) {
    data.push({
      index: i,
      reportName: `富国站验收任务 ${i}`,
      createTime: '2024-09-09 00:00:00',
      area: `安全${Math.ceil(Math.random() * 2)}区`, // Random security area between 1-2
      operator: i % 2 === 0 ? '已完成' : '进行中',
      actions: ''
    })
  }
  return data
}

const columns = [
  { name: 'index', label: '编号', field: 'index', align: 'left' },
  { name: 'reportName', label: '任务名称', field: 'reportName', align: 'left' },
  { name: 'createTime', label: '创建时间', field: 'createTime', align: 'left' },
  { name: 'area', label: '核查范围', field: 'area', align: 'left' },
  { name: 'operator', label: '任务状态', field: 'operator', align: 'left' },
  { name: 'actions', label: '操作', field: 'actions', align: 'left' }
]

// Track play/pause state for each row
const playStates = ref(Array(250).fill(false))

// Progress steps
const activeStep = ref(0)
const steps = [
  { label: '创建任务', completed: true },
  { label: '告警验证', completed: false },
  { label: '验证结果', completed: false }
]

const rows = ref([])
const totalRows = ref(0)

const isPlaying = ref(false)

// 添加 emits
const emit = defineEmits(['next'])

// 修改 visibility 图标的点击事件
const showVerification = () => {
  emit('next', 'AlarmVerification')
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

const currentPageRange = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage + 1
  const end = Math.min(pagination.value.page * pagination.value.rowsPerPage, totalRows.value)
  return { start, end }
})

onMounted(() => {
  const data = generateTestData()
  rows.value = data
  totalRows.value = data.length
  pagination.value.rowsNumber = data.length
})

// function rowClassFn(row) {
//   return row.index % 2 === 0 ? 'even-row' : 'odd-row'
// }

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
<!-- :row-class="rowClassFn" -->
<template>
  <q-page class="q-pa-md">

    <!-- Progress Steps -->
    <!-- <div class="q-mb-md">
      <q-stepper
        v-model="activeStep"
        header-nav
        flat
        bordered
        active-color="primary"
        done-color="positive"
        inactive-color="grey-6"
      >
        <q-step
          v-for="(step, index) in steps"
          :key="index"
          :name="index"
          :title="step.label"
          :done="step.completed"
        />
      </q-stepper>
    </div> -->

    <q-card flat>
      <q-card-section>
        <q-btn label="创建核查任务" color="primary" @click="dialog = true" />
      </q-card-section>

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
          <template #body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-checkbox v-model="props.selected" @click.stop />
              </q-td>
              <q-td key="index">{{ props.row.index }}</q-td>
              <q-td key="reportName">{{ props.row.reportName }}</q-td>
              <q-td key="createTime">{{ props.row.createTime }}</q-td>
              <!-- <q-td key="area">{{ props.row.area }}</q-td> -->
              <q-td key="area">
                <div class="q-pa-xs row q-gutter-sm">
                    <div class="bg-green-1 text-green-10 q-pa-xs q-mr-xs rounded-borders text-caption">
                    安全1区
                    </div>
                    <div class="bg-green-1 text-green-10 q-pa-xs rounded-borders text-caption">
                    安全2区
                    </div>
                </div>
              </q-td>
              <q-td key="operator">{{ props.row.operator }}</q-td>
              <q-td key="actions">
                <q-td key="actions">
                  <q-btn :color="props.row.operator === '进行中' ? 'indigo-10' : 'red-10'" flat @click="showVerification">
                    {{ props.row.operator === '进行中' ? '启动' : '暂停' }}
                  </q-btn>
                  <q-btn color="primary" flat>
                    查看
                  </q-btn>
                  <q-btn color="red-10" flat>
                    删除
                  </q-btn>
                </q-td>
              </q-td>
            </q-tr>
          </template>
          <template #header="props">
            <q-tr :props="props" class="custom-header">
              <q-th auto-width>
                <!-- <q-checkbox
                  v-model="props.selected"
                  :indeterminate="props.selected !== true && props.partialSelected === true"
                  @update:model-value="props.toggleSelectAll"
                /> -->
              </q-th>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
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

    <!-- 生成报告对话框 -->
    <Verificationtask v-model="dialog" />
  </q-page>
</template>

<style scoped>
/* Progress Steps Style
::v-deep(.q-stepper__header) {
  box-shadow: none;
  border-bottom: 1px solid #e0e0e0;
}

::v-deep(.q-stepper__step-inner) {
  padding: 12px 24px;
} */

/* 主表格样式 */
.custom-header {
  /* background-color: #2e7d32 !important; */
  background-color: #006A6A !important;
  color: white !important;
}

.custom-header th {
  font-weight: bold;
  color: white !important;
}

/* .even-row {
  background-color: #e8f5e9 !important;
}

.odd-row {
  background-color: #f5f5f5 !important;
} */

/* 分页样式 */

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
/* 
::v-deep(.my-pagination-custom .q-btn.active) {
  background-color: #2e7d32 !important;
  color: white !important;
} */
</style>