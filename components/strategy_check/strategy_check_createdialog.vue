<script setup lang="ts">

// --- Component's Interface ---
defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['update:modelValue', 'save']);

// --- Form State ---
const taskName = ref('富国站及核查任务');
const stationName = ref('富国站');
const checkTool1 = ref('')
const checkTool1IP = ref('')
const checkTool2 = ref('')
const checkTool2IP = ref('')
const selectedPolicies = ref([]);

// 定义四个表格的数据
const hostRows = ref([
  {id: 1, name: '主机1', ip: '192.168.1.1', selected: false},
  {id: 2, name: '主机2', ip: '192.168.1.2', selected: false},
  {id: 3, name: '主机3', ip: '192.168.1.3', selected: false},
  {id: 4, name: '主机4', ip: '192.168.1.4', selected: false},
  {id: 5, name: '主机5', ip: '192.168.1.5', selected: false}
])

const verticalRows = ref([
  {id: 1, name: '交换机1', ip: '192.168.2.1', selected: false},
  {id: 2, name: '交换机2', ip: '192.168.2.2', selected: false},
  {id: 3, name: '交换机3', ip: '192.168.2.3', selected: false},
  {id: 4, name: '交换机4', ip: '192.168.2.4', selected: false}
])

const firewallRows = ref([
  {id: 1, name: '防火墙1', ip: '192.168.3.1', selected: false},
  {id: 2, name: '防火墙2', ip: '192.168.3.2', selected: false},
  {id: 3, name: '防火墙3', ip: '192.168.3.3', selected: false}
])

const isolationRows = ref([
  {id: 1, name: '监测装置1', ip: '192.168.4.1', selected: false},
  {id: 2, name: '监测装置2', ip: '192.168.4.2', selected: false},
  {id: 3, name: '监测装置3', ip: '192.168.4.3', selected: false},
  {id: 4, name: '监测装置4', ip: '192.168.4.4', selected: false}
])

// --- Selection state for each table ---
const hostSelection = ref([]);
const verticalSelection = ref([]);
const firewallSelection = ref([]);
const isolationSelection = ref([]);

const labels = {
  id: '编号',
  name: '设备名称',
  ip: '设备IP',
};

// --- Dialog Actions ---
function onSave() {
  const allSelectedItems = {
    hosts: hostSelection.value,
    vertical: verticalSelection.value,
    firewalls: firewallSelection.value,
    isolation: isolationSelection.value,
  };
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
    <q-card bordered flat style="min-width: 80vw">
      <q-card-section>
        <span class="text-h6">新建任务</span>
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
              <q-input v-model="checkTool1" label="1区监测装置" dense outlined/>
            </div>
            <div class="col-6">
              <q-input v-model="checkTool1IP" label="1区检查工具IP：" dense outlined/>
            </div>
            <div class="col-6">
              <q-input v-model="checkTool2" label="2区监测装置" dense outlined/>
            </div>
            <div class="col-6">
              <q-input v-model="checkTool2IP" label="2区检查工具IP" dense outlined/>
            </div>
          </div>

          <div>
            <div class="text-subtitle1 q-mb-sm">检查范围</div>
            <q-option-group
                v-model="selectedPolicies"
                :options="[ { label: '主机策略核查', value: '主机策略核查' }, { label: '纵向策略核查', value: '纵向策略核查' },
                { label: '隔离策略核查', value: '隔离策略核查' },{ label: '防火墙策略核查', value: '防火墙策略核查' },
                 ]"
                type="checkbox"
                inline
            />
          </div>

          <div>
            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">检查对象：主机</div>
              <common-enhanced-table
                  v-model:selection="hostSelection"
                  :rows="hostRows"
                  :column-labels="labels"
                  row-key="id"
                  enable-selection
              />
            </div>

            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">检查对象：纵向</div>
              <common-enhanced-table
                  v-model:selection="verticalSelection"
                  :rows="verticalRows"
                  :column-labels="labels"
                  row-key="id"
                  enable-selection
              />
            </div>

            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">检查对象：防火墙</div>
              <common-enhanced-table
                  v-model:selection="firewallSelection"
                  :rows="firewallRows"
                  :column-labels="labels"
                  row-key="id"
                  enable-selection
              />
            </div>

            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">检查对象：隔离</div>
              <common-enhanced-table
                  v-model:selection="isolationSelection"
                  :rows="isolationRows"
                  :column-labels="labels"
                  row-key="id"
                  enable-selection
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pa-md">
        <q-btn class="col-3" label="确认" color="primary" @click="onSave"/>
        <q-btn class="col-3" outline label="取消" color="grey-8" @click="closeDialog"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style scoped>
</style>