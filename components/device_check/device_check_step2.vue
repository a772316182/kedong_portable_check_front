<script setup lang="ts">
import {rowClassFn} from "~/utils/tableStyle";

const selectedRows = ref([]);
const columns = [
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
  <div class="q-pa-md">
    <div class="col">
      <q-page class="q-pa-md q-gutter-y-md">
        <div class="q-gutter-y-md">
          <div class="q-mt-md row justify-left items-center q-gutter-x-md">
            <q-btn label="核查" color="primary" @click="showDialog = true"/>
            <q-btn label="取消" color="primary"/>
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
          >
            <template #body="props">
              <q-tr :props="props">
                <q-td key="index" :props="props">{{ props.row.index }}</q-td>
                <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                <q-td key="deviceType" :props="props">{{
                    props.row.deviceType
                  }}
                </q-td>
                <q-td key="ip" :props="props">{{ props.row.ip }}</q-td>
                <q-td key="mac" :props="props">{{ props.row.mac }}</q-td>
                <q-td key="progress" :props="props">
                  <div v-if="props.row.error">
                    <q-badge color="red">{{ props.row.errorMessage }}</q-badge>
                  </div>
                  <template v-else>
                    <q-linear-progress
                        :value="parseProgress(props.row.progress)"
                        :color="getProgressColor(props.row)"
                        size="md"
                        class="q-mt-sm"
                    />
                    <div class="text-center">
                      {{ getStatusText(props.row) }}
                    </div>
                  </template>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-page>
    </div>

    <!-- 页面底部导航按钮 -->
    <div class="q-mt-md row justify-center items-center q-gutter-x-md">
      <q-btn label="上一步" color="primary" @click="$emit('back')"/>
      <q-btn label="下一步" color="primary" @click="$emit('next')"/>
    </div>
  </div>
</template>
