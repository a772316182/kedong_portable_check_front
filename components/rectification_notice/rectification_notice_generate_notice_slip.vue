<script setup lang="ts">

// 定义 emit
const emit = defineEmits(['save', 'cancel']);

// --- 表单数据 (保持不变) ---
const taskName = ref('');
const plantName = ref('');
const creator = ref('');
const completeTime = ref('');
const rectificationContent = ref('');
const repairMethod = ref('');
const workRequirements = ref('');

// --- 表格1: 整改设备 ---
const selectedEquipmentRows = ref([]);
const equipmentRows = ref([
  { index: 1, equipmentName: '核心交换机-A', equipmentType: '网络设备', equipmentIp: '192.168.1.1' },
  { index: 2, equipmentName: '数据库服务器', equipmentType: '服务器', equipmentIp: '192.168.1.10' },
  { index: 3, equipmentName: 'Web应用防火墙', equipmentType: '安全设备', equipmentIp: '192.168.1.3' }
]);
// 用 labels 对象替换 columns 数组
const equipmentLabels = {
  index: '序号',
  equipmentName: '设备名称',
  equipmentType: '设备类型',
  equipmentIp: '设备IP'
};

// --- 表格2: 整改项目 ---
const selectedRectifyItems = ref([]);
const rectifyItemRows = ref([
  { index: 1, itemType: '配置错误', itemDesc: 'SSH服务允许密码登录，存在暴力破解风险。' },
  { index: 2, itemType: '漏洞补丁', itemDesc: '操作系统存在未修复的高危漏洞 CVE-2025-XXXX。' },
  { index: 3, itemType: '权限过高', itemDesc: '应用服务账号拥有不必要的root权限。' }
]);
// 用 labels 对象替换 columns 数组
const rectifyItemLabels = {
  index: '序号',
  itemType: '问题类型',
  itemDesc: '问题描述'
};

// --- 事件处理 (保持不变) ---
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
  };
  emit('save', formData);
}

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <q-card bordered flat style="min-width: 80vw">
    <q-card-section>
      <span class="text-h6">生成通知单</span>
    </q-card-section>

    <q-card-section class="q-gutter-y-lg">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-6">
          <q-input v-model="taskName" dense filled label="任务名称" />
        </div>
        <div class="col-12 col-sm-6">
          <q-input v-model="plantName" dense filled label="厂站名称" />
        </div>
        <div class="col-12 col-sm-6">
          <q-input v-model="creator" dense filled label="创建人" />
        </div>
        <div class="col-12 col-sm-6">
          <q-input v-model="completeTime" dense filled label="整改完成时间" mask="date" :rules="['date']">
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="completeTime">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="q-gutter-y-sm">
        <div class="text-subtitle1">整改设备</div>
        <common-enhanced-table
            v-model:selection="selectedEquipmentRows"
            :rows="equipmentRows"
            :column-labels="equipmentLabels"
            row-key="index"
            enable-selection
            :non-sortable-columns="['index', 'institution', 'actions']"
            :non-searchable-columns="['index', 'actions']"
        />
      </div>

      <div class="q-gutter-y-sm">
        <div class="text-subtitle1">整改项目</div>
        <common-enhanced-table
            v-model:selection="selectedRectifyItems"
            :rows="rectifyItemRows"
            :column-labels="rectifyItemLabels"
            row-key="index"
            enable-selection
            hide-pagination
            :non-sortable-columns="['index', 'institution', 'actions']"
            :non-searchable-columns="['index', 'actions']"
        />
      </div>

      <div class="q-gutter-y-sm">
        <div class="text-subtitle1">整改内容</div>
        <q-input v-model="rectificationContent" dense type="textarea" autogrow filled />
      </div>

      <div class="q-gutter-y-sm">
        <div class="text-subtitle1">修复方式</div>
        <q-input v-model="repairMethod" dense type="textarea" autogrow filled />
      </div>

      <div class="q-gutter-y-sm">
        <div class="text-subtitle1">工作要求</div>
        <q-input v-model="workRequirements" dense type="textarea" autogrow filled />
      </div>

    </q-card-section>

    <q-separator />

    <q-card-actions align="center" class="q-pa-md q-gutter-x-md">
      <q-btn class="col-3" label="保存" color="primary" @click="onSave" />
      <q-btn class="col-3" label="取消" outline color="grey-8" @click="onCancel" />
    </q-card-actions>
  </q-card>
</template>

<style scoped>
/* Scoped styles here if needed */
</style>