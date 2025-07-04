<script setup lang="ts">
const dialogVisible = ref(false);
const columns = {
  index: "编号",
  deviceName: "设备名称",
  deviceType: "设备类型",
  deviceIP1: "设备IP1",
  deviceIP2: "设备IP2",
  checkResult: "核查结果",
};
const rows = [
  {
    index: 1,
    deviceName: "核心数据库服务器",
    deviceType: "数据库",
    deviceIP1: "192.168.1.101",
    deviceIP2: "10.0.0.101",
    checkResult: "合格",
  },
  {
    index: 2,
    deviceName: "Web应用服务器",
    deviceType: "应用服务器",
    deviceIP1: "192.168.1.102",
    deviceIP2: "10.0.0.102",
    checkResult: "不合格",
  },
  {
    index: 3,
    deviceName: "文件存储服务器",
    deviceType: "存储设备",
    deviceIP1: "192.168.1.103",
    deviceIP2: "10.0.0.103",
    checkResult: "合格",
  },
  {
    index: 4,
    deviceName: "防火墙网关",
    deviceType: "网络安全",
    deviceIP1: "192.168.1.1",
    deviceIP2: "10.0.0.1",
    checkResult: "合格",
  },
];

// 查看任务详情
function showEvidenceDialog(taskStatus: String) {
  if (taskStatus === "不合格") {
    dialogVisible.value = true;
  }
}
</script>

<template>
  <div class="q-gutter-y-md">
    <common-enhanced-table
      title="检查结果表"
      :rows="rows"
      :column-labels="columns"
      row-key="index"
    >
      <template #cell-checkResult="{ row }">
        <common-status-chip
          :label="row.checkResult"
          @click="showEvidenceDialog(row.checkResult)"
        />
      </template>
    </common-enhanced-table>
  </div>
  <q-dialog v-model="dialogVisible">
    <device-check-evidence @cancel="dialogVisible = false" />
  </q-dialog>
  <!-- 页面底部导航按钮 -->
  <div class="q-mt-md row justify-center items-center q-gutter-x-md">
    <q-btn label="上一步" color="primary" @click="$emit('back')" />
    <q-btn label="完成" color="primary" @click="$emit('next')" />
  </div>
</template>
