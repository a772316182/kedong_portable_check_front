<script setup lang="ts">
const columns = {
  index: "编号",
  name: "设备名称",
  deviceType: "设备类型",
  ip: "设备IP",
  mac: "MAC地址",
  progress: "核查进度",
}

const rows = [
  {
    index: 1,
    name: "服务器-A01",
    deviceType: "服务器",
    ip: "192.168.1.101",
    mac: "00:1A:C2:7B:00:47",
    progress: 75,
  },
  {
    index: 2,
    name: "交换机-C12",
    deviceType: "网络设备",
    ip: "10.0.0.12",
    mac: "00:1B:44:11:3A:B7",
    progress: 100,
  },
  {
    index: 3,
    name: "工作站-W22",
    deviceType: "终端设备",
    ip: "172.16.8.22",
    mac: "08:00:27:BE:36:FA",
    progress: 0,
  },
  {
    index: 4,
    name: "工作站-W23",
    deviceType: "终端设备",
    ip: "172.16.8.23",
    mac: "08:09:27:BE:36:FB",
    progress: 40,
    error: true,
    errorMessage: "网络不通", // 错误状态
  },
];

const showDialog = ref(false);
const checked = ref(false);
const handleCancel = () => {
  showDialog.value = false;
  checked.value = false;
};

const handleStart = () => {
  // 执行开始逻辑
  console.log("开始核查...");
  showDialog.value = false;
  checked.value = false;
};

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
</script>

<template>
          <common-enhanced-table
              title="基础检查表"
              :rows="rows"
              :column-labels="columns"
              row-key="index"
          >
            <template #top-right>
              <div class="q-gutter-md">
                <q-btn label="核查" color="primary" @click="showDialog = true"/>
                <q-btn label="取消" color="orange-10"/>
              </div>
            </template>
            <template #cell-progress="{row}">
              <div v-if="row.error">
                <q-badge color="red">{{ row.errorMessage }}</q-badge>
              </div>
              <template v-else>
                <q-linear-progress
                    :value="parseProgress(row.progress)"
                    :color="getProgressColor(row)"
                    size="md"
                    class="q-mt-sm"
                />
                <div class="text-center">
                  {{ getStatusText(row) }}
                </div>
              </template>
            </template>
          </common-enhanced-table>

    <!-- 页面底部导航按钮 -->
    <div class="q-mt-md row justify-center items-center q-gutter-x-md">
      <q-btn label="上一步" color="primary" @click="$emit('back')"/>
      <q-btn label="下一步" color="primary" @click="$emit('next')"/>
    </div>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">提示</div>
        </q-card-section>

        <q-card-section>
          <div>请将检查工具与待检查的网络设备直连</div>
          <q-checkbox v-model="checked" label="已连接"/>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
              flat
              label="取消"
              color="primary"
              @click="handleCancel"
          />
          <q-btn
              flat
              label="开始"
              color="primary"
              :disable="!checked"
              @click="handleStart"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
