<script setup lang="ts">
import {ref, watch} from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const taskName = ref('富国站及核查任务')
const stationName = ref('富国站')

const checkboxes = ref([])

// 定义通用列
const commonColumns = [
  {name: 'id', label: '编号', field: 'id', align: 'left'},
  {name: 'name', label: '设备名称', field: 'name', align: 'left'},
  {name: 'ip', label: '设备IP', field: 'ip', align: 'left'}
]

// 定义四个表格的数据
const table1Rows = ref([
  {id: 1, name: '主机1', ip: '192.168.1.1', selected: false},
  {id: 2, name: '主机2', ip: '192.168.1.2', selected: false},
  {id: 3, name: '主机3', ip: '192.168.1.3', selected: false},
  {id: 4, name: '主机4', ip: '192.168.1.4', selected: false},
  {id: 5, name: '主机5', ip: '192.168.1.5', selected: false}
])

const table2Rows = ref([
  {id: 1, name: '交换机1', ip: '192.168.2.1', selected: false},
  {id: 2, name: '交换机2', ip: '192.168.2.2', selected: false},
  {id: 3, name: '交换机3', ip: '192.168.2.3', selected: false},
  {id: 4, name: '交换机4', ip: '192.168.2.4', selected: false}
])

const table3Rows = ref([
  {id: 1, name: '防火墙1', ip: '192.168.3.1', selected: false},
  {id: 2, name: '防火墙2', ip: '192.168.3.2', selected: false},
  {id: 3, name: '防火墙3', ip: '192.168.3.3', selected: false}
])

const table4Rows = ref([
  {id: 1, name: '监测装置1', ip: '192.168.4.1', selected: false},
  {id: 2, name: '监测装置2', ip: '192.168.4.2', selected: false},
  {id: 3, name: '监测装置3', ip: '192.168.4.3', selected: false},
  {id: 4, name: '监测装置4', ip: '192.168.4.4', selected: false}
])

// 控制全选状态
const allSelected1 = ref(false)
const allSelected2 = ref(false)
const allSelected3 = ref(false)
const allSelected4 = ref(false)

// 监听全选状态变化
watch(allSelected1, (val) => {
  table1Rows.value.forEach(row => {
    row.selected = val
  })
})
watch(allSelected2, (val) => {
  table2Rows.value.forEach(row => {
    row.selected = val
  })
})
watch(allSelected3, (val) => {
  table3Rows.value.forEach(row => {
    row.selected = val
  })
})
watch(allSelected4, (val) => {
  table4Rows.value.forEach(row => {
    row.selected = val
  })
})

// 监听行选择状态变化
watch(
    () => table1Rows.value.map(row => row.selected),
    (selectedList) => {
      allSelected1.value = selectedList.length > 0 && selectedList.every(Boolean)
    },
    {deep: true}
)
watch(
    () => table2Rows.value.map(row => row.selected),
    (selectedList) => {
      allSelected2.value = selectedList.length > 0 && selectedList.every(Boolean)
    },
    {deep: true}
)
watch(
    () => table3Rows.value.map(row => row.selected),
    (selectedList) => {
      allSelected3.value = selectedList.length > 0 && selectedList.every(Boolean)
    },
    {deep: true}
)
watch(
    () => table4Rows.value.map(row => row.selected),
    (selectedList) => {
      allSelected4.value = selectedList.length > 0 && selectedList.every(Boolean)
    },
    {deep: true}
)

function taskRowClassFn(row) {
  return row.id % 2 === 0 ? 'dialog-even-row' : 'dialog-odd-row'
}

function closeDialog() {
  emit('update:modelValue', false)
}

function confirmDialog() {
  emit('update:modelValue', false)
}
</script>

<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="val => emit('update:modelValue', val)">
    <q-card style="min-width: 1200px; height: 80vh; display: flex; flex-direction: column;">
      <!-- 顶部标题行 -->
      <q-card-section class="q-py-sm row items-center" style="background-color: #3BB5A3; position: relative;">
        <q-icon
            name="description"
            size="30px"
            class="q-mr-sm text-white"
        />
        <div class="text-h6 text-white" style="flex: 1; text-align: center;">
          新建任务
        </div>
        <q-btn icon="close" flat round dense style="position: absolute; top: 4px; right: 4px; color: white;"
               @click="closeDialog"/>
      </q-card-section>

      <q-card-section style="flex: 1; overflow-y: auto; padding: 16px;">
        <!-- 任务名称 + 厂站名称 同行 -->
        <div class="row q-mb-md">
          <div class="row items-center col-6">
            <div class="text-weight-bold">任务名称：</div>
            <q-input v-model="taskName" dense :style="{ backgroundColor: '#f0f0f0' , width: '490px'}" class="q-ml-sm"/>
          </div>
          <div class="row items-center col-6">
            <div class="text-weight-bold">厂站名称：</div>
            <q-input v-model="stationName" dense :style="{ backgroundColor: '#f0f0f0' , width: '490px'}"
                     class="q-ml-sm"/>
          </div>
        </div>

        <!-- 检查项目 -->
        <div class="row q-mb-md" style="margin-top: 1em;">
          <div class="text-weight-bold" style="margin-left: 1em;">检查范围：</div>
          <div class="q-ml-sm">
            <q-checkbox v-model="checkboxes" val="主机策略核查" label="主机策略核查"/>
            <q-checkbox v-model="checkboxes" val="纵向策略核查" label="纵向策略核查"/>
            <q-checkbox v-model="checkboxes" val="隔离策略核查" label="隔离策略核查"/>
            <q-checkbox v-model="checkboxes" val="防火墙策略核查" label="防火墙策略核查"/>
          </div>
        </div>

        <!-- 1区监测装置 检查工具 同行 -->
        <div class="row q-mb-md">
          <div class="row items-center col-6">
            <div class="text-weight-bold">1区监测装置：</div>
            <q-input dense :style="{ backgroundColor: '#f0f0f0' , width: '470px'}" class="q-ml-sm"/>
          </div>
          <div class="row items-center col-6">
            <div class="text-weight-bold">检查工具IP：</div>
            <q-input dense :style="{ backgroundColor: '#f0f0f0' , width: '475px'}" class="q-ml-sm"/>
          </div>
        </div>

        <!-- 2区监测装置 检查工具 同行 -->
        <div class="row q-mb-md">
          <div class="row items-center col-6">
            <div class="text-weight-bold">2型监测装置：</div>
            <q-input dense :style="{ backgroundColor: '#f0f0f0' , width: '470px'}" class="q-ml-sm"/>
          </div>
          <div class="row items-center col-6">
            <div class="text-weight-bold">检查工具IP：</div>
            <q-input dense :style="{ backgroundColor: '#f0f0f0' , width: '475px'}" class="q-ml-sm"/>
          </div>
        </div>

        <!-- 四个表格 -->
        <div class="text-weight-bold q-mb-sm">检查范围：</div>
        <div class="q-mb-md ">
          <div>主机</div>
          <q-table
              flat
              bordered
              :rows="table1Rows"
              :columns="commonColumns"
              row-key="id"
              hide-pagination
              hide-bottom
              style="width: 100%;"
              :row-class="taskRowClassFn"
              class="scroll-table"
          >
            <template #header="props">
              <q-tr :props="props" class="dialog-header">
                <q-th auto-width>
                  <q-checkbox v-model="allSelected1"/>
                </q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template #body="props">
              <q-tr :props="props" :class="taskRowClassFn(props.row)">
                <q-td>
                  <q-checkbox v-model="props.row.selected"/>
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ props.row[col.field] }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>

        <div class="q-mb-md">
          <div>纵向</div>
          <q-table
              flat
              bordered
              :rows="table2Rows"
              :columns="commonColumns"
              row-key="id"
              hide-pagination
              hide-bottom
              style="width: 100%;"
              :row-class="taskRowClassFn"
              class="scroll-table"
          >
            <template #header="props">
              <q-tr :props="props" class="dialog-header">
                <q-th auto-width>
                  <q-checkbox v-model="allSelected2"/>
                </q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template #body="props">
              <q-tr :props="props" :class="taskRowClassFn(props.row)">
                <q-td>
                  <q-checkbox v-model="props.row.selected"/>
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ props.row[col.field] }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>

        <div class="q-mb-md">
          <div>防火墙</div>
          <q-table
              flat
              bordered
              :rows="table3Rows"
              :columns="commonColumns"
              row-key="id"
              hide-pagination
              hide-bottom
              style="width: 100%;"
              :row-class="taskRowClassFn"
              class="scroll-table"
          >
            <template #header="props">
              <q-tr :props="props" class="dialog-header">
                <q-th auto-width>
                  <q-checkbox v-model="allSelected3"/>
                </q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template #body="props">
              <q-tr :props="props" :class="taskRowClassFn(props.row)">
                <q-td>
                  <q-checkbox v-model="props.row.selected"/>
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ props.row[col.field] }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>

        <div class="q-mb-md">
          <div>隔离</div>
          <q-table
              flat
              bordered
              :rows="table4Rows"
              :columns="commonColumns"
              row-key="id"
              hide-pagination
              hide-bottom
              style="width: 100%;"
              :row-class="taskRowClassFn"
              class="scroll-table"
          >
            <template #header="props">
              <q-tr :props="props" class="dialog-header">
                <q-th auto-width>
                  <q-checkbox v-model="allSelected4"/>
                </q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template #body="props">
              <q-tr :props="props" :class="taskRowClassFn(props.row)">
                <q-td>
                  <q-checkbox v-model="props.row.selected"/>
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ props.row[col.field] }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md" style="flex-shrink: 0;">
        <q-btn flat label="取消" color="primary" @click="closeDialog"/>
        <q-btn label="确认" color="primary" @click="confirmDialog"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
/* 对话框表格样式 */
.dialog-header {
  background-color: #3BB5A3 !important;
  color: white !important;
}

.dialog-header th {
  font-weight: bold;
  color: white !important;
}

.dialog-even-row {
  background-color: #E0F2F1 !important;
}

.dialog-odd-row {
  background-color: #f5f5f5 !important;
}

/* 对话框输入框样式 */
.q-field--dense .q-field__control {
  height: 40px !important;
}

/* 表格滚动条样式 */
.scroll-table {
  max-height: 300px;
  overflow-y: auto;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>