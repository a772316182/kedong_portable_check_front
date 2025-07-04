<script setup lang="ts">
const dialogVisible = ref(false);
const evidenceTitle = ref("");
const columns = {
  index: "编号",
  deviceName: "设备名称",
  deviceType: "设备类型",
  deviceIP1: "设备IP1",
  deviceIP2: "设备IP2",
  baselineCheck: "基线核查",
  vulnerabilityScan: "漏洞扫描",
  highRiskPorts: "高危端口",
  weakPasswordScan: "弱口令扫描",
  illegalConnection: "违规外联",
  illegalPeripheral: "违规外设",
  malwareConfig: "恶意代码配置",
  networkPlanConfig: "网络规划配置",
};
const rows = [
  {
    index: 1,
    deviceName: "核心数据库服务器",
    deviceType: "数据库",
    deviceIP1: "192.168.1.101",
    deviceIP2: "10.0.0.101",
    baselineCheck: "合格",
    vulnerabilityScan: "不合格",
    highRiskPorts: "不合格",
    weakPasswordScan: "合格",
    illegalConnection: "合格",
    illegalPeripheral: "合格",
    malwareConfig: "不合格",
    networkPlanConfig: "合格",
  },
  {
    index: 2,
    deviceName: "Web应用服务器",
    deviceType: "应用服务器",
    deviceIP1: "192.168.1.102",
    deviceIP2: "10.0.0.102",
    baselineCheck: "不合格",
    vulnerabilityScan: "不合格",
    highRiskPorts: "合格",
    weakPasswordScan: "不合格",
    illegalConnection: "合格",
    illegalPeripheral: "合格",
    malwareConfig: "不合格",
    networkPlanConfig: "合格",
  },
  {
    index: 3,
    deviceName: "文件存储服务器",
    deviceType: "存储设备",
    deviceIP1: "192.168.1.103",
    deviceIP2: "10.0.0.103",
    baselineCheck: "合格",
    vulnerabilityScan: "合格",
    highRiskPorts: "不合格",
    weakPasswordScan: "不合格",
    illegalConnection: "不合格",
    illegalPeripheral: "不合格",
    malwareConfig: "不合格",
    networkPlanConfig: "不合格",
  },
  {
    index: 4,
    deviceName: "防火墙网关",
    deviceType: "网络安全",
    deviceIP1: "192.168.1.1",
    deviceIP2: "10.0.0.1",
    baselineCheck: "合格",
    vulnerabilityScan: "合格",
    highRiskPorts: "合格",
    weakPasswordScan: "合格",
    illegalConnection: "合格",
    illegalPeripheral: "合格",
    malwareConfig: "合格",
    networkPlanConfig: "未核查",
  },
  {
    index: 5,
    deviceName: "开发测试服务器",
    deviceType: "虚拟化",
    deviceIP1: "192.168.1.201",
    deviceIP2: "10.0.0.201",
    baselineCheck: "不合格",
    vulnerabilityScan: "不合格",
    highRiskPorts: "不合格",
    weakPasswordScan: "不合格",
    illegalConnection: "不合格",
    illegalPeripheral: "不合格",
    malwareConfig: "不合格",
    networkPlanConfig: "不合格",
  },
  {
    index: 6,
    deviceName: "邮件服务器",
    deviceType: "通信服务",
    deviceIP1: "192.168.1.15",
    deviceIP2: "10.0.0.15",
    baselineCheck: "合格",
    vulnerabilityScan: "不合格",
    highRiskPorts: "合格",
    weakPasswordScan: "合格",
    illegalConnection: "合格",
    illegalPeripheral: "合格",
    malwareConfig: "合格",
    networkPlanConfig: "合格",
  },
];

// 查看任务详情
function showEvidenceDialog(taskStatus: string, field: keyof typeof columns) {
  if (taskStatus === "不合格") {
    dialogVisible.value = true;
    evidenceTitle.value = columns[field];
  }
}
</script>

<template>
  <common-enhanced-table
    title="检查结果表"
    :rows="rows"
    :column-labels="columns"
    row-key="index"
    :non-searchable-columns="Object.keys(columns)"
  >
    <template #cell-baselineCheck="{ row }">
      <common-status-chip
        :label="row.baselineCheck"
        @click="showEvidenceDialog(row.baselineCheck, 'baselineCheck')"
      />
    </template>

    <template #cell-vulnerabilityScan="{ row }">
      <common-status-chip
        :label="row.vulnerabilityScan"
        @click="showEvidenceDialog(row.vulnerabilityScan, 'vulnerabilityScan')"
      />
    </template>

    <template #cell-highRiskPorts="{ row }">
      <common-status-chip
        :label="row.highRiskPorts"
        @click="showEvidenceDialog(row.highRiskPorts, 'highRiskPorts')"
      />
    </template>

    <template #cell-weakPasswordScan="{ row }">
      <common-status-chip
        :label="row.weakPasswordScan"
        @click="showEvidenceDialog(row.weakPasswordScan, 'weakPasswordScan')"
      />
    </template>

    <template #cell-illegalConnection="{ row }">
      <common-status-chip
        :label="row.illegalConnection"
        @click="showEvidenceDialog(row.illegalConnection, 'illegalConnection')"
      />
    </template>

    <template #cell-illegalPeripheral="{ row }">
      <common-status-chip
        :label="row.illegalPeripheral"
        @click="showEvidenceDialog(row.illegalPeripheral, 'illegalPeripheral')"
      />
    </template>

    <template #cell-malwareConfig="{ row }">
      <common-status-chip
        :label="row.malwareConfig"
        @click="showEvidenceDialog(row.malwareConfig, 'malwareConfig')"
      />
    </template>

    <template #cell-networkPlanConfig="{ row }">
      <common-status-chip
        :label="row.networkPlanConfig"
        @click="showEvidenceDialog(row.networkPlanConfig, 'networkPlanConfig')"
      />
    </template>
  </common-enhanced-table>

  <q-dialog v-model="dialogVisible">
    <security-basic-evidence
      :evidence-title="evidenceTitle"
      @cancel="dialogVisible = false"
    />
  </q-dialog>

  <!-- 页面底部导航按钮 -->
  <div class="q-mt-md row justify-center items-center q-gutter-x-md">
    <q-btn label="上一步" color="primary" @click="$emit('back')" />
    <q-btn label="完成" color="primary" @click="$emit('next')" />
  </div>
</template>
