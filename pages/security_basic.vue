<script setup lang="ts">
const dialogVisible = ref(false);

const columns = {
  index: "编号",
  taskName: "任务名称",
  createTime: "创建时间",
  checkItem: "核查项",
  taskStatus: "任务状态",
  actions: "操作",
};
const rows: {
  index: number;
  taskName: string;
  createTime: string;
  checkItem: string[];
  taskStatus: string;
}[] = [
  {
    index: 1,
    taskName: "通知单1",
    createTime: "2021-01-01 13:00:00",
    checkItem: ["基线核查", "高危端口", "弱口令扫描", "漏洞扫描"],
    taskStatus: "进行中",
  },
  {
    index: 2,
    taskName: "通知单2",
    createTime: "2021-01-01 00:12:00",
    checkItem: ["违规外联"],
    taskStatus: "已完成",
  },
  {
    index: 3,
    taskName: "通知单3",
    createTime: "2026-01-01 00:00:00",
    checkItem: ["基线核查", "高危端口", "弱口令扫描", "漏洞扫描"],
    taskStatus: "已完成",
  },
  {
    index: 4,
    taskName: "通知单4",
    createTime: "2021-01-05 00:00:00",
    checkItem: ["基线核查", "高危端口", "弱口令扫描", "漏洞扫描"],
    taskStatus: "进行中",
  },
  {
    index: 5,
    taskName: "通知单5",
    createTime: "2021-01-05 00:00:00",
    checkItem: ["恶意代码部署情况"],
    taskStatus: "进行中",
  },
  {
    index: 6,
    taskName: "通知单6",
    createTime: "2021-01-05 00:00:00",
    checkItem: ["恶意代码部署情况"],
    taskStatus: "进行中",
  },
];

const currentStep = ref(1);
const selectedTask = ref<{
  index: number;
  taskName: string;
  createTime: string;
  checkItem: string[];
  taskStatus: string;
} | null>(null);

function generateNoticeSlip() {
  dialogVisible.value = true;
}

function saveSecurityBasic(data: unknown) {
  dialogVisible.value = false;
  console.log(data);
}

// 查看任务详情
function viewTask(task: (typeof rows)[number]) {
  if (task.taskStatus === "已完成") {
    selectedTask.value = task;
    currentStep.value = 2; // 进入第二步
  }
}
</script>

<template>
  <q-page class="q-pa-md q-gutter-y-md">
    <q-stepper
      v-model="currentStep"
      flat
      header-nav
      active-color="primary"
      done-color="positive"
      inactive-color="grey-6"
    >
      <q-step
        :name="1"
        title="创建任务"
        :done="currentStep > 1"
        icon="list_alt"
      >
        <common-enhanced-table
          title="任务列表"
          :rows="rows"
          :column-labels="columns"
          row-key="index"
          :non-sortable-columns="['actions']"
          :non-searchable-columns="[
            'index',
            'actions',
            'checkItem',
            'taskStatus',
          ]"
        >
          <template #top-right>
            <q-btn color="primary" class="col-auto" @click="generateNoticeSlip">
              创建核查任务
            </q-btn>
          </template>
          <template #cell-checkItem="{ row }">
            <common-status-chip
              v-for="(item, index) in row.checkItem"
              :key="index"
              :label="item"
            >
            </common-status-chip>
          </template>
          <template #cell-taskStatus="{ row }">
            <common-status-chip :label="row.taskStatus" />
          </template>
          <template #cell-actions="{ row }">
            <q-btn
              flat
              :color="row.taskStatus === '进行中' ? 'red-10' : 'primary'"
              :label="row.taskStatus === '进行中' ? '暂停' : '查看'"
              @click="viewTask(row)"
            />
            <q-btn flat color="primary">下载</q-btn>
            <q-btn flat color="red-10">删除</q-btn>
          </template>
        </common-enhanced-table>
      </q-step>
      <q-step :name="2" title="基础检查" :done="currentStep > 2" icon="rule">
        <security-basic-step2
          :task="selectedTask"
          @back="currentStep = 1"
          @next="currentStep = 3"
        />
      </q-step>
      <q-step
        :name="3"
        title="检查结果"
        :done="currentStep > 3"
        icon="check_circle"
      >
        <security-basic-step3
          :task="selectedTask"
          @back="currentStep = 2"
          @next="currentStep = 1"
        />
      </q-step>
    </q-stepper>
    <q-dialog v-model="dialogVisible">
      <security-basic-generate
        @cancel="dialogVisible = false"
        @save="saveSecurityBasic"
      />
    </q-dialog>
  </q-page>
</template>
