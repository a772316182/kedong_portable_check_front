<script setup lang="ts">

const selectedRows = ref([]);
const columns = ref({
  index: "编号",
  name: "设备名称",
  networkSegment: "所属网段",
  deviceType: "设备类型",
  ip: "设备IP",
  mac: "MAC地址",
  progress: "核查进度",
})

const rows = [
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
const segmentGroups = ref([
  {
    name: "Ⅰ区B网",
    selectedAll: false,
    segments: [
      {range: "192.168.11.11 - 192.168.11.12", selected: false},
      {range: "192.168.11.13 - 192.168.11.14", selected: false},
    ],
  },
  {
    name: "ⅠⅠ区A网",
    selectedAll: false,
    segments: [
      {range: "10.0.0.1 - 10.0.0.2", selected: false},
      {range: "10.0.0.3 - 10.0.0.4", selected: false},
    ],
  },
]);

function getProgressColor(row) {
  if (row.error) return "red";
  if (row.progress === 0) return "grey";
  return row.progress === 100 ? "green" : "primary";
}

function getStatusText(row) {
  if (row.error) return ""; // 错误状态由badge显示
  if (row.progress === 0) return "未开始";
  return row.progress === 100 ? "已完成" : `进行中 (${row.progress}%)`;
}

// 修改parseProgress处理异常值
function parseProgress(value) {
  const num = parseInt(value);
  return isNaN(num) ? 0 : num / 100;
}

// 切换单行选中状态
function toggleRowSelection(row) {
  const index = selectedRows.value.indexOf(row.index);
  if (index === -1) {
    selectedRows.value.push(row.index);
  } else {
    selectedRows.value.splice(index, 1);
  }
}

// 切换整个组的选中状态
function toggleGroup(group) {
  group.segments.forEach((seg) => {
    seg.selected = group.selectedAll;
  });
}

// 更新“全选”状态
function updateGroupSelection(group) {
  group.selectedAll = group.segments.every((seg) => seg.selected);
}
</script>

<template>
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
      <div class="q-gutter-y-md">
        <common-enhanced-table
            title="基础检查表"
            :rows="rows"
            :column-labels="columns"
            row-key="index"
        >
          <template #top-right>
            <div class="q-gutter-md">
              <q-btn label="批量核查" color="primary"/>
              <q-btn label="取消检查" color="yellow-10"/>
            </div>
          </template>
          <template #cell-selection="{row}">
            <q-checkbox v-model="selectedRows" :val="row.index"/>
          </template>
          <template #cell-progress="{row}">
            <div v-if="row.error">
              <q-badge color="red">{{
                  row.errorMessage
                }}
              </q-badge>
            </div>
            <div v-else>
              <q-linear-progress
                  :value="parseProgress(row.progress)"
                  :color="getProgressColor(row)"
                  size="md"
                  class="q-mt-sm"
              />
              <div class="text-center">
                {{ getStatusText(row) }}
              </div>
            </div>
          </template>
        </common-enhanced-table>
      </div>
    </div>
  </div>

  <!-- 页面底部导航按钮 -->
  <div class="q-mt-md row justify-center items-center q-gutter-x-md">
    <q-btn label="上一步" color="primary" @click="$emit('back')"/>
    <q-btn label="下一步" color="primary" @click="$emit('next')"/>
  </div>
</template>
