<script setup lang="ts">
// Import your GenericTable component

// --- State for Stepper and Dialogs (Business Logic) ---
const dialogVisible = ref(false);
const currentStep = ref(1); // Stepper state
const selectedTask = ref(null); // To pass data to other steps

// --- Data for the Table ---
const rows = ref([
  {
    index: 1,
    taskName: "核心网络设备年度巡检",
    createTime: "2025-06-28 13:00:00",
    checkItem: ["主机策略", "防火墙策略"],
    taskStatus: "进行中"
  },
  {
    index: 2,
    taskName: "数据库服务器安全基线核查",
    createTime: "2025-06-27 09:12:00",
    checkItem: ["主机策略"],
    taskStatus: "已完成"
  },
  {
    index: 3,
    taskName: "Web应用防火墙规则审计",
    createTime: "2025-06-26 15:00:00",
    checkItem: ["防火墙策略", "隔离策略", "纵向策略"],
    taskStatus: "已完成"
  },
  {
    index: 4,
    taskName: "月度安全设备巡检",
    createTime: "2025-06-05 10:00:00",
    checkItem: ["主机策略", "纵向策略"],
    taskStatus: "进行中"
  },
]);

// --- Configuration for GenericTable ---
const labels = {
  index: "编号",
  taskName: "任务名称",
  createTime: "创建时间",
  checkItem: "核查项",
  taskStatus: "任务状态",
  actions: "操作",
};

const alignments = {
  index: "center",
  createTime: "center",
  checkItem: "center",
  taskStatus: "center",
  actions: "center",
};

// --- Business Logic Methods ---
function generateNoticeSlip() {
  dialogVisible.value = true;
}

// This important method controls the stepper workflow
function viewTask(task: any) {
  if (task.taskStatus === "已完成") {
    selectedTask.value = task;
    currentStep.value = 2; // Navigate to the next step
  } else {
    alert(`任务 "${task.taskName}" 正在进行中，无法查看结果。`);
    // Here you might implement the 'pause' logic
  }
}

</script>

<template>
  <div>
    <q-stepper
        v-model="currentStep"
        flat
        header-nav
        active-color="primary"
        done-color="positive"
        inactive-color="grey-6"
    >
      <q-step :name="1" title="创建任务" :done="currentStep > 1" icon="list_alt">
        <common-enhanced-table
            title="任务列表"
            :rows="rows"
            :column-labels="labels"
            :column-alignments="alignments"
            row-key="index"
            :non-sortable-columns="['checkItem', 'taskStatus', 'actions']"
            :non-searchable-columns="['index', 'checkItem', 'taskStatus', 'actions']"
        >
          <template #top-right>
            <q-btn color="primary" label="创建核查任务" @click="generateNoticeSlip"/>

          </template>
          <template #cell-checkItem="{ row }">
            <div class="q-gutter-xs row">
              <common-status-chip
                  v-for="item in row.checkItem"
                  :key="item"
                  :label="item"
              />
            </div>
          </template>

          <template #cell-taskStatus="{ row }">
            <common-status-chip :label="row.taskStatus"/>
          </template>

          <template #cell-actions="{ row }">
            <q-btn
                flat dense
                :color="row.taskStatus === '进行中' ? 'red-10' : 'primary'"
                :label="
                          row.taskStatus === '进行中' ? '暂停' : '查看'
                        "
                @click="viewTask(row)"
            />
            <q-btn dense flat color="primary">下载</q-btn>
            <q-btn dense flat color="red-10">删除</q-btn>
          </template>

        </common-enhanced-table>
      </q-step>

      <q-step :name="2" title="基础检查" :done="currentStep > 2" icon="rule">
        <device-check-step2
            :task="selectedTask"
            @back="currentStep = 1"
            @next="currentStep = 3"
        />
      </q-step>

      <q-step :name="3" title="检查结果" :done="currentStep > 3" icon="check_circle">
        <device-check-step3
            :task="selectedTask"
            @back="currentStep = 2"
            @next="currentStep = 1"
        />
      </q-step>
    </q-stepper>
    <q-dialog v-model="dialogVisible">
      <device-check-generate
          @cancel="dialogVisible = false"
          @save="saveRectificationNotice"
      />
    </q-dialog>
  </div>
</template>