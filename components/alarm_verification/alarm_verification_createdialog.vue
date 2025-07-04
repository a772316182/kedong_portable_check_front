<script setup lang="ts">

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue','save'])

const taskName = ref('富国站及核查任务')
const stationName = ref('富国站')
const ip1 = ref('')
const ip2 = ref('')
const checkboxes = ref([])
const itemSelection = ref([]);

const labels = {
  id: '编号',
  type: '触发方式',
  device: '设备类型',
  event: '告警事件',
  detail: '备注'
};

const taskRows = ref([
  {id: 1, type: '自动', device: '主机', event: '登录/退出日志', detail: 'XXXXXX', selected: false},
  {id: 2, type: '自动', device: '交换机', event: '登录/退出日志', detail: 'XXXXXX', selected: false},
  {id: 3, type: '手动', device: '交换机', event: '网口接入情况', detail: 'XXXXX', selected: false},
  {id: 4, type: '手动', device: '交换机', event: '配置变更日志', detail: 'XXXXX', selected: false},
])

function onSave() {
  const allSelectedItems = itemSelection.value;
  console.log('Saving task with selected items:', allSelectedItems);
  emit('save', allSelectedItems);
  closeDialog();
}

function closeDialog() {
  emit('update:modelValue', false);
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
        <q-btn
icon="close" flat round dense style="position: absolute; top: 4px; right: 4px; color: white;"
               @click="closeDialog"/>
      </q-card-section>

      

      <q-card-section class="col" style="overflow-y: auto;">
        <div class="q-gutter-y-md">
          <div class="row q-col-gutter-lg">
            <div class="col-6">
              <q-input v-model="taskName" dense outlined label="任务名称"/>
            </div>
            <div class="col-6">
              <q-input v-model="stationName" dense outlined label="厂站名称"/>
            </div>
            <div class="col-6">
              <q-input v-model="ip1" label="本机IP1" dense outlined/>
            </div>
            <div class="col-6">
              <q-input v-model="ip2" label="本机IP2" dense outlined/>
            </div>
          </div>
            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">检查项目</div>
              <common-enhanced-table
                  v-model:selection="itemSelection"
                  :rows="taskRows"
                  :column-labels="labels"
                  row-key="id"
                  enable-selection
              />
            </div>
          
          <div>
            <div class="text-subtitle1 q-mb-sm">检查范围</div>
            <q-option-group
                v-model="checkboxes"
                :options="[ { label: '安全1区', value: '安全1区' }, { label: '安全2区', value: '安全2区' }
                 ]"
                type="checkbox"
                inline
            />
          </div>

            

          </div>
        
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="取消" color="primary" @click="closeDialog"/>
        <q-btn label="确认" color="primary" @click="onSave"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>