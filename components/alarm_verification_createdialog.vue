<script setup lang="ts">
import { ref } from 'vue'

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

const taskColumns = [
  { name: 'id', label: '编号', field: 'id', align: 'left' },
  { name: 'type', label: '触发方式', field: 'type', align: 'left' },
  { name: 'device', label: '设备类型', field: 'device', align: 'left' },
  { name: 'event', label: '告警事件', field: 'event', align: 'left' },
  { name: 'detail', label: '备注', field: 'detail', align: 'left' }
]

const taskRows = ref([
  { id: 1, type: '自动', device: '主机', event: '登录/退出日志', detail: 'XXXXXX', selected: false },
  { id: 2, type: '自动', device: '交换机', event: '登录/退出日志', detail: 'XXXXXX', selected: false },
  { id: 3, type: '手动', device: '交换机', event: '网口接入情况', detail: 'XXXXX', selected: false },
  { id: 4, type: '手动', device: '交换机', event: '配置变更日志', detail: 'XXXXX', selected: false },
])


// 控制全选状态
const allSelected = ref(false)

// 监听“全选”复选框，执行真正的“全选/取消全选”
watch(allSelected, (val) => {
  taskRows.value.forEach(row => {
    row.selected = val
  })
})

// 监听行的选择状态，**仅更新 allSelected 的值**，不会去修改行数据
watch(
  () => taskRows.value.map(row => row.selected),
  (selectedList) => {
    const all = selectedList.length > 0 && selectedList.every(Boolean)
    // 只有在 allSelected 状态变化时才更新，避免触发 watch(allSelected)
    if (allSelected.value !== all) {
      allSelected.value = all
    }
  },
  { deep: true }
)

function taskRowClassFn(row) {
  return row.id % 2 === 0 ? 'dialog-even-row' : 'dialog-odd-row'
}

function closeDialog() {
  emit('update:modelValue', false)
}

function confirmDialog() {
  // 这里可以添加确认逻辑
  emit('update:modelValue', false)
}
</script>

<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="val => emit('update:modelValue', val)">
    <q-card style="min-width: 1200px;">
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
        <q-btn icon="close" flat round dense style="position: absolute; top: 4px; right: 4px; color: white;" @click="closeDialog" />
      </q-card-section>

      <q-card-section>
        <!-- 任务名称 + 厂站名称 同行 -->
        <div class="row q-mb-md">
          <div class="row items-center col-6">
            <div class="text-weight-bold">任务名称：</div>
            <q-input v-model="taskName" dense :style="{ backgroundColor: '#f0f0f0' , width: '490px'}" class="q-ml-sm" />
          </div>
          <div class="row items-center col-6">
            <div class="text-weight-bold">厂站名称：</div>
            <q-input v-model="stationName" dense :style="{ backgroundColor: '#f0f0f0' , width: '490px'}" class="q-ml-sm" />
          </div>
        </div>

        <!-- IP1 + IP2 同行 -->
        <div class="row q-mb-md">
          <div class="row items-center col-6">
            <div class="text-weight-bold" style="margin-left: 0.5em;">本机IP1：</div>
            <q-input  dense :style="{ backgroundColor: '#f0f0f0' , width: '490px'}" class="q-ml-sm" />
          </div>
          <div class="row items-center col-6">
            <div class="text-weight-bold" style="margin-left: 0.5em;">本机IP2：</div>
            <q-input  dense :style="{ backgroundColor: '#f0f0f0' , width: '490px'}" class="q-ml-sm" />
          </div>
        </div>

        
        <div class="row no-wrap q-mt-md" style="align-items: flex-start;">
          <div class="text-weight-bold q-mb-sm">检查项目：</div>
          <q-table
            flat
            bordered
            :rows="taskRows"
            :columns="taskColumns"
            row-key="id"
            hide-pagination
            hide-bottom
            style="width: 1080px;"
            :row-class="taskRowClassFn"
          >
            <template #header="props">
              <q-tr :props="props" class="dialog-header">
                <q-th auto-width>
                    <q-checkbox v-model="allSelected" />
                </q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template #body="props">
              <q-tr :props="props" :class="taskRowClassFn(props.row)">
                <q-td>
                  <q-checkbox v-model="props.row.selected" />
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>

        <!-- 报告项 -->
        <div class="row q-mb-md" style="margin-top: 1em;">
          <div class="text-weight-bold" style="margin-left: 1em;">检查范围：</div>
          <div class="q-ml-sm">
            <q-checkbox v-model="checkboxes" val="安全1区" label="安全1区" />
            <q-checkbox v-model="checkboxes" val="安全2区" label="安全2区" />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md" >
        <q-btn flat label="取消" color="primary" @click="closeDialog" />
        <q-btn label="确认" color="primary" @click="confirmDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
/* 对话框表格样式 */
.dialog-header {
  /* background-color: #2e7d32 !important; */
  background-color: #3BB5A3 !important;
  color: white !important;
}

.dialog-header th {
  font-weight: bold;
  color: white !important;
}

.dialog-even-row {
  /* background-color: #e8f5e9 !important; */
  background-color: #E0F2F1 !important;
}

.dialog-odd-row {
  background-color: #f5f5f5 !important;
}

/* 对话框输入框样式 */
.q-field--dense .q-field__control {
  height: 40px !important;
}
</style>