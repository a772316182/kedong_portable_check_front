<script setup lang="ts">
import { rowClassFn } from "~/utils/tableStyle";
import type { QTableColumn } from 'quasar';

// --- 类型定义 ---
interface TableRow {
  index: number;
  name: string;
  networkSegment: string;
  deviceType: string;
  ip: string;
  mac: string;
  progress: number;
  error?: boolean;
  errorMessage?: string;
}

interface Segment {
  range: string;
  selected: boolean;
}

interface SegmentGroup {
  name: string;
  selectedAll: boolean;
  segments: Segment[];
}


const selectedRows = ref<(number | string)[]>([]);

const columns: QTableColumn[] = [
  {
    name: "selection",
    label: "",
    align: "center",
    field: '' // field is required by QTableColumn
  },
  {
    name: "index",
    label: "编号",
    field: "index",
    align: "center",
  },
  {
    name: "name",
    label: "设备名称",
    field: "name",
    align: "left",
  },
  {
    name: "networkSegment",
    label: "所属网段",
    field: "networkSegment",
    align: "left",
  },
  {
    name: "deviceType",
    label: "设备类型",
    field: "deviceType",
    align: "center",
  },
  {
    name: "ip",
    label: "设备IP",
    field: "ip",
    align: "center",
  },
  {
    name: "mac",
    label: "MAC地址",
    field: "mac",
    align: "center",
  },
  {
    name: "progress",
    label: "核查进度",
    field: "progress",
    align: "center",
  },
];
const rows: TableRow[] = [
  {
    index: 1,
    name: "服务器-A01",
    networkSegment: "生产网段",
    deviceType: "服务器",
    ip: "192.168.1.101",
    mac: "00:1A:C2:7B:00:47",
    progress: 75,
  },
  {
    index: 2,
    name: "交换机-C12",
    networkSegment: "办公网段",
    deviceType: "网络设备",
    ip: "10.0.0.12",
    mac: "00:1B:44:11:3A:B7",
    progress: 100,
  },
  {
    index: 3,
    name: "工作站-W22",
    networkSegment: "研发网段",
    deviceType: "终端设备",
    ip: "172.16.8.22",
    mac: "08:00:27:BE:36:FA",
    progress: 0,
  },
  {
    index: 4,
    name: "工作站-W23",
    networkSegment: "研发网段",
    deviceType: "终端设备",
    ip: "172.16.8.23",
    mac: "08:09:27:BE:36:FB",
    progress: 40,
    error: true,
    errorMessage: "网络不通", // 错误状态
  },
];
const segmentGroups = ref<SegmentGroup[]>([
  {
    name: "Ⅰ区B网",
    selectedAll: false,
    segments: [
      { range: "192.168.11.11 - 192.168.11.12", selected: false },
      { range: "192.168.11.13 - 192.168.11.14", selected: false },
    ],
  },
  {
    name: "ⅠⅠ区A网",
    selectedAll: false,
    segments: [
      { range: "10.0.0.1 - 10.0.0.2", selected: false },
      { range: "10.0.0.3 - 10.0.0.4", selected: false },
    ],
  },
]);
function getProgressColor(row: TableRow) {
  if (row.error) return "red";
  if (row.progress === 0) return "grey";
  return row.progress === 100 ? "green" : "primary";
}

function getStatusText(row: TableRow) {
  if (row.error) return ""; // 错误状态由badge显示
  if (row.progress === 0) return "未开始";
  return row.progress === 100 ? "已完成" : `进行中 (${row.progress}%)`;
}

// 修改parseProgress处理异常值
function parseProgress(value: number) {
  const num = parseInt(String(value));
  return isNaN(num) ? 0 : num / 100;
}

// 切换单行选中状态
function toggleRowSelection(row: TableRow) {
  const index = selectedRows.value.indexOf(row.index);
  if (index === -1) {
    selectedRows.value.push(row.index);
  } else {
    selectedRows.value.splice(index, 1);
  }
}

// 切换整个组的选中状态
function toggleGroup(group: SegmentGroup) {
  group.segments.forEach((seg) => {
    seg.selected = group.selectedAll;
  });
}

// 更新"全选"状态
function updateGroupSelection(group: SegmentGroup) {
  group.selectedAll = group.segments.every((seg) => seg.selected);
}
</script>

<template>
  <div class="q-pa-md">
    <div class="row q-gutter-md">
      <!-- 左侧：白色分区选择框 -->
      <div
        class="bg-white q-pa-md"
        style="
          width: 300px;
          border: 1px solid #ccc;
          border-radius: 8px;
          max-height: 600px;
          overflow-y: auto;
        "
      >
        <div
          v-for="(group, index) in segmentGroups"
          :key="index"
          class="q-mb-md"
        >
          <div class="row items-center q-mb-sm">
            <q-checkbox
              v-model="group.selectedAll"
              label="全选"
              @update:model-value="toggleGroup(group)"
            />
            <div class="q-ml-sm text-bold">{{ group.name }}</div>
          </div>
          <div class="q-ml-lg">
            <q-checkbox
              v-for="(segment, idx) in group.segments"
              :key="idx"
              v-model="segment.selected"
              :label="segment.range"
              @update:model-value="updateGroupSelection(group)"
            />
          </div>
        </div>
      </div>

      <!-- 右侧：原来的q-table -->
      <div class="col">
        <q-page class="q-pa-md q-gutter-y-md">
          <div class="q-gutter-y-md">
            <div class="q-mt-md row justify-left items-center q-gutter-x-md">
              <q-btn label="批量核查" color="primary" />
              <q-btn label="取消检查" color="primary" />
            </div>
            <q-table
              square
              no-data-label="暂无数据"
              flat
              bordered
              title="基础检查表"
              :rows="rows"
              :columns="columns"
              row-key="index"
              :table-row-class-fn="rowClassFn"
              :rows-per-page-options="[5, 10, 20, 50, 0]"
              selection="multiple"
              v-model:selected="selectedRows"
            >
              <template #body="props">
                <q-tr :props="props">
                  <q-td>
                    <q-checkbox v-model="props.selected" />
                  </q-td>
                  <q-td key="index" :props="props">{{ props.row.index }}</q-td>
                  <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                  <q-td key="networkSegment" :props="props">{{
                    props.row.networkSegment
                  }}</q-td>
                  <q-td key="deviceType" :props="props">{{
                    props.row.deviceType
                  }}</q-td>
                  <q-td key="ip" :props="props">{{ props.row.ip }}</q-td>
                  <q-td key="mac" :props="props">{{ props.row.mac }}</q-td>
                  <q-td key="progress" :props="props">
                    <div
                      class="row items-center justify-center no-wrap"
                      style="gap: 8px"
                    >
                      <q-linear-progress
                        stripe
                        rounded
                        size="20px"
                        :value="parseProgress(props.row.progress)"
                        :color="getProgressColor(props.row)"
                        class="col"
                      >
                        <div class="absolute-full flex flex-center">
                          <q-badge
                            v-if="props.row.error"
                            color="red"
                            text-color="white"
                            :label="props.row.errorMessage"
                          />
                          <span
                            v-else-if="props.row.progress > 0"
                            class="text-white"
                            >{{ props.row.progress }}%</span
                          >
                        </div>
                      </q-linear-progress>
                      <div class="text-caption">
                        {{ getStatusText(props.row) }}
                      </div>
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-page>
      </div>
    </div>

    <!-- 页面底部导航按钮 -->
    <div class="q-mt-md row justify-center items-center q-gutter-x-md">
      <q-btn label="上一步" color="primary" @click="$emit('back')" />
      <q-btn label="下一步" color="primary" @click="$emit('next')" />
    </div>
  </div>
</template>

<style scoped></style>
