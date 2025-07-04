<script setup lang="ts">

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const showPolicyDialog = ref(false);
const currentDevice = ref(null);

const emit = defineEmits(['update:modelValue','save'])

const taskName = ref('富国站及核查任务')
const stationName = ref('富国站')
const creator = ref('张三')
const checkboxes = ref([])
const itemSelection = ref([]);

const labels = {
  id: '编号',
  type: '任务类型',
  name: '检查任务名称',
  time: '检查时间',
  detail: '查看详情'
};

const taskRows = ref([
  {id: 1, type: '安全基础检查', name: '', time: '2023-09-09 00:00:00', detail: '查看', selected: false},
  {id: 2, type: '安全基础检查', name: '', time: '2023-09-09 00:00:00', detail: '', selected: false},
  {id: 3, type: '策略核查', name: '', time: '2023-09-09 00:00:00', detail: '', selected: false},
  {id: 4, type: '安全基础检查', name: '', time: '', detail: '', selected: false},
  {id: 5, type: '安全基础检查', name: '', time: '', detail: '', selected: false}
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

function handlePolicyClick(row: any) {
  currentDevice.value = row;
  showPolicyDialog.value = true;
    
}
</script>

<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="val => emit('update:modelValue', val)">
    <q-card style="min-width: 1200px; max-width: 90vw; max-height: 90vh; overflow-y: auto;">
      <!-- 顶部标题行 -->
      <q-card-section class="q-py-sm row items-center" style="background-color: #3BB5A3; position: relative;">
        <q-icon
            name="description"
            size="30px"
            class="q-mr-sm text-white"
        />
        <div class="text-h6 text-white" style="flex: 1; text-align: center;">
          生成报告
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
              <q-input v-model="creator" label="创建人" dense outlined/>
            </div>
          </div>

          <div>
            <div class="text-subtitle1 q-mb-sm">报告项</div>
            <q-option-group
                v-model="checkboxes"
                :options="[ { label: '安全基础检查', value: '安全基础检查' }, { label: '网络设备检查', value: '网络设备检查' }
                 , { label: '策略核查', value: '策略核查' }, { label: '告警验证', value: '告警验证' }]"
                type="checkbox"
                inline
            />
          </div>

            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">任务列表</div>
              <common-enhanced-table
                  v-model:selection="itemSelection"
                  :rows="taskRows"
                  :column-labels="labels"
                  row-key="id"
                  enable-selection
              >
            
              <template #cell-detail="{ row }">
                <q-btn v-if="row.detail" outline color="primary" @click="handlePolicyClick(row)">{{ row.detail }}</q-btn>
              </template>
            
              </common-enhanced-table>
            </div>
          
          

            

          </div>
        
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="取消" color="primary" @click="closeDialog"/>
        <q-btn label="确认" color="primary" @click="onSave"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <security-report-generate-detail v-model="showPolicyDialog" :currentDevice="currentDevice"/>
</template>

<style scoped>

</style>