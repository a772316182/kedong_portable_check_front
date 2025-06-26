<script setup lang="ts">
import { rowClassFn } from "~/utils/tableStyle";

const columns = [
  {
    name: "index",
    label: "编号",
    field: "index",
    align: "center",
    sortable: true,
  },
  {
    name: "deviceName",
    label: "设备名称",
    field: "deviceName",
    align: "left",
    sortable: true,
  },
  {
    name: "deviceType",
    label: "设备类型",
    field: "deviceType",
    align: "center",
    sortable: true,
  },
  {
    name: "deviceIP1",
    label: "设备IP1",
    field: "deviceIP1",
    align: "center",
    sortable: true,
  },
  {
    name: "deviceIP2",
    label: "设备IP2",
    field: "deviceIP2",
    align: "center",
    sortable: true,
  },
  {
    name: "baselineCheck",
    label: "基线核查",
    field: "baselineCheck",
    align: "center",
    sortable: true,
  },
  {
    name: "vulnerabilityScan",
    label: "漏洞扫描",
    field: "vulnerabilityScan",
    align: "center",
    sortable: true,
  },
  {
    name: "highRiskPorts",
    label: "高危端口",
    field: "highRiskPorts",
    align: "center",
    sortable: true,
  },
  {
    name: "weakPasswordScan",
    label: "弱口令扫描",
    field: "weakPasswordScan",
    align: "center",
    sortable: true,
  },
  {
    name: "illegalConnection",
    label: "违规外联",
    field: "illegalConnection",
    align: "center",
    sortable: true,
  },
];
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
  <div>
    <q-page class="q-pa-md q-gutter-y-md">
      <div class="q-gutter-y-md">
        <q-table
          square
          no-data-label="暂无数据"
          flat
          bordered
          title="检查结果表"
          :rows="rows"
          :columns="columns"
          row-key="index"
          :table-row-class-fn="rowClassFn"
          :rows-per-page-options="[5, 10, 20, 50, 0]"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td key="index" :props="props">{{ props.row.index }}</q-td>
              <q-td key="deviceName" :props="props">{{
                props.row.deviceName
              }}</q-td>
              <q-td key="deviceType" :props="props">{{
                props.row.deviceType
              }}</q-td>
              <q-td key="deviceIP1" :props="props">{{
                props.row.deviceIP1
              }}</q-td>
              <q-td key="deviceIP2" :props="props">{{
                props.row.deviceIP2
              }}</q-td>
              <q-td
                key="baselineCheck"
                :props="props"
                :class="{ 'text-red': props.row.baselineCheck === '不合格' }"
              >
                {{ props.row.baselineCheck }}
              </q-td>
              <q-td
                key="vulnerabilityScan"
                :props="props"
                :class="{
                  'text-red': props.row.vulnerabilityScan === '不合格',
                }"
              >
                {{ props.row.vulnerabilityScan }}
              </q-td>
              <q-td
                key="highRiskPorts"
                :props="props"
                :class="{ 'text-red': props.row.highRiskPorts === '不合格' }"
              >
                {{ props.row.highRiskPorts }}
              </q-td>
              <q-td
                key="weakPasswordScan"
                :props="props"
                :class="{ 'text-red': props.row.weakPasswordScan === '不合格' }"
              >
                {{ props.row.weakPasswordScan }}
              </q-td>
              <q-td
                key="illegalConnection"
                :props="props"
                :class="{
                  'text-red': props.row.illegalConnection === '不合格',
                }"
              >
                {{ props.row.illegalConnection }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-page>
  </div>
  <!-- 页面底部导航按钮 -->
  <div class="q-mt-md row justify-center items-center q-gutter-x-md">
    <q-btn label="上一步" color="primary" @click="$emit('back')" />
    <q-btn label="完成" color="primary"  @click="$emit('next')" />
  </div>
</template>

<style scoped>
.q-btn[icon="search"] {
  margin-left: 4px;
}

.q-btn[icon="unfold_more"] {
  margin-left: 2px;
  transform: scale(0.9);
}

.q-th .q-btn {
  padding: 2px;
}
/* 强制列表头居中 */
.q-table th:nth-child(6) > div {
  justify-content: center !important;
}

.q-table th:nth-child(4) > div {
  justify-content: center !important;
}

.q-table th:nth-child(5) > div {
  justify-content: center !important;
}

/* 消除排序图标偏移 */
.q-table th:last-child .q-table__sort-icon {
  left: 50%;
  transform: translateX(-50%);
}
</style>
