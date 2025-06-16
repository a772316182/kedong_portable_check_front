<script setup lang="ts">
import {ref} from 'vue'
import {rowClassFn} from "~/utils/tableStyle";

// 定义 emit
const emit = defineEmits(['save', 'cancel'])

// 表单数据
const taskName = ref('')
const plantName = ref('')
const creator = ref('')
const completeTime = ref('')
const rectificationContent = ref('')
const repairMethod = ref('')
const workRequirements = ref('')

// 整改设备表格相关
const selectedEquipmentRows = ref([])
const equipmentColumns = [
  {name: 'index', label: '序号', field: 'index', sortable: true},
  {name: 'equipmentName', label: '设备名称', field: 'equipmentName', sortable: true},
  {name: 'equipmentType', label: '设备类型', field: 'equipmentType', sortable: true},
  {name: 'equipmentIp', label: '设备IP', field: 'equipmentIp', sortable: true}
]
const equipmentRows = [
  {
    index: 1,
    equipmentName: '设备1',
    equipmentType: '类型1',
    equipmentIp: '192.168.1.1'
  },
  {
    index: 2,
    equipmentName: '设备2',
    equipmentType: '类型2',
    equipmentIp: '192.168.1.2'
  },
  {
    index: 3,
    equipmentName: '设备3',
    equipmentType: '类型3',
    equipmentIp: '192.168.1.3'
  }
]

// 整改项目表格相关
const selectedRectifyItems = ref([])
const rectifyItemColumns = [
  {name: 'index', label: '序号', field: 'index', sortable: true},
  {name: 'itemType', label: '问题类型', field: 'itemType', sortable: true},
  {name: 'itemDesc', label: '问题描述', field: 'itemDesc', sortable: true}
]
const rectifyItemRows = [
  {
    index: 1,
    itemType: '类型1',
    itemDesc: '问题描述1'
  },
  {
    index: 2,
    itemType: '类型2',
    itemDesc: '问题描述2'
  },
  {
    index: 3,
    itemType: '类型3',
    itemDesc: '问题描述3'
  }
]

// 保存按钮点击
function onSave() {
  const formData = {
    taskName: taskName.value,
    plantName: plantName.value,
    creator: creator.value,
    completeTime: completeTime.value,
    rectificationContent: rectificationContent.value,
    repairMethod: repairMethod.value,
    workRequirements: workRequirements.value,
    selectedEquipmentItems: selectedEquipmentRows.value,
    selectedRectifyItems: selectedRectifyItems.value
  }

  emit('save', formData)
}

// 取消按钮点击
function onCancel() {
  emit('cancel')
}
</script>

<template>
  <q-card bordered flat style="min-width: 70%">
    <q-card-section>
      <span class="text-h6">生成通知单</span>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-1 flex flex-center text-body1">任务名称</div>
        <div class="col-4">
          <q-input v-model="taskName" filled/>
        </div>
        <div class="col-1 offset-1 flex flex-center text-body1">厂站名称</div>
        <div class="col-4">
          <q-input v-model="plantName" filled/>
        </div>
      </div>
      <div class="row q-col-gutter-md q-gutter-y-md">
        <div class="col-1 flex flex-center text-body1">创建人</div>
        <div class="col-4">
          <q-input v-model="creator" filled/>
        </div>
        <div class="col-1 offset-1 flex flex-center text-body1">整改完成时间</div>
        <div class="col-4">
          <q-input v-model="completeTime" filled/>
        </div>
      </div>
      <div class="row q-col-gutter-md q-gutter-y-md">
        <div class="col-1 flex flex-center text-body1">整改设备</div>
        <div class="col-10">
          <q-table
              v-model:selected="selectedEquipmentRows"
              selection="multiple"
              square
              no-data-label="暂无数据"
              flat bordered
              :rows="equipmentRows"
              :columns="equipmentColumns"
              row-key="index"
              :table-row-class-fn="rowClassFn"
              :rows-per-page-options="[0]"
          />
        </div>
      </div>
      <div class="row q-col-gutter-md q-gutter-y-md">
        <div class="col-1 flex flex-center text-body1">整改项目</div>
        <div class="col-10">
          <q-table
              v-model:selected="selectedRectifyItems"
              selection="multiple"
              square
              no-data-label="暂无数据"
              flat bordered
              :rows="rectifyItemRows"
              :columns="rectifyItemColumns"
              row-key="index"
              :table-row-class-fn="rowClassFn"
              :rows-per-page-options="[0]"
          />
        </div>
      </div>
      <div class="row q-col-gutter-md q-gutter-y-md">
        <div class="col-1 flex flex-center text-body1">整改内容</div>
        <div class="col-10">
          <q-input v-model="rectificationContent" type="textarea" autogrow filled/>
        </div>
      </div>
      <div class="row q-col-gutter-md q-gutter-y-md">
        <div class="col-1 flex flex-center text-body1">修复方式</div>
        <div class="col-10">
          <q-input v-model="repairMethod" type="textarea" autogrow filled/>
        </div>
      </div>
      <div class="row q-col-gutter-md q-gutter-y-md">
        <div class="col-1 flex flex-center text-body1">工作要求</div>
        <div class="col-10">
          <q-input v-model="workRequirements" type="textarea" autogrow filled/>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md justify-center">
        <div class="col-4">
          <q-btn class="full-width" label="保存" color="primary" @click="onSave"/>
        </div>
        <div class="col-4">
          <q-btn class="full-width" label="取消" color="red-10" @click="onCancel"/>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
</style>