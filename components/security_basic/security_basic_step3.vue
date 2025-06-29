<script setup lang="ts">

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
  illegalConnection: "违规外联"
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
  },
];
</script>

<template>
  <common-enhanced-table
      title="检查结果表"
      :rows="rows"
      :column-labels="columns"
      row-key="index"
  >
    <template #cell-baselineCheck="{row}">
      <span :class="{ 'text-red': row.baselineCheck === '不合格' }">
        {{ row.baselineCheck }}
      </span>
    </template>
    <template #cell-vulnerabilityScan="{row}">
      <span :class="{'text-red': row.vulnerabilityScan === '不合格'}">
        {{ row.vulnerabilityScan }}
      </span>
    </template>
    <template #cell-highRiskPorts="{row}">
      <span :class="{ 'text-red': row.highRiskPorts === '不合格'}">
        {{ row.highRiskPorts }}
      </span>
    </template>
    <template #cell-weakPasswordScan="{row}">
      <span :class="{ 'text-red': row.weakPasswordScan === '不合格'}">
        {{ row.weakPasswordScan }}
      </span>
    </template>
    <template #cell-illegalConnection="{row}">
      <span :class="{'text-red': row.illegalConnection === '不合格'                }">{{ row.illegalConnection }}</span>
    </template>
  </common-enhanced-table>
  <!-- 页面底部导航按钮 -->
  <div class="q-mt-md row justify-center items-center q-gutter-x-md">
    <q-btn label="上一步" color="primary" @click="$emit('back')"/>
    <q-btn label="完成" color="primary" @click="$emit('next')"/>
  </div>
</template>
