<script setup lang="ts">
import {ref} from "vue";
import {rowClassFn} from "~/utils/tableStyle";

// 定义 emit
const emit = defineEmits(["save", "cancel"]);
const selectedRows = ref([]);
const columns = [
  {
    name: "index",
    label: "编号",
    field: "index",
    align: "center",
  },
  {
    name: "securityZone",
    label: "安全区",
    field: "securityZone",
    align: "center",
  },
  {
    name: "name",
    label: "设备名称",
    field: "name",
    align: "left",
  },
  {
    name: "networkIp",
    label: "网络设备IP",
    field: "networkIp",
    align: "center",
  },
  {
    name: "deviceType",
    label: "设备类型",
    field: "deviceType",
    align: "center",
  },
  {
    name: "checkToolIp",
    label: "检查工具IP",
    field: "checkToolIp",
    align: "center",
  },
];
const rows = [
  {
    index: 1,
    securityZone: "核心生产区",
    name: "数据库服务器-DB01",
    networkIp: "172.17.8.11",
    deviceType: "服务器",
  },
  {
    index: 2,
    securityZone: "DMZ区",
    name: "防火墙-FW02",
    networkIp: "203.0.113.25",
    deviceType: "安全设备",
  },
  {
    index: 3,
    securityZone: "办公接入区",
    name: "接入交换机-SW45",
    networkIp: "10.5.32.78",
    deviceType: "网络设备",
  },
  {
    index: 4,
    securityZone: "测试环境区",
    name: "虚拟主机-VM09",
    networkIp: "192.168.100.45",
    deviceType: "虚拟化设备",
  },
  {
    index: 5,
    securityZone: "开发隔离区",
    name: "构建服务器-BLD01",
    networkIp: "10.88.77.66",
    deviceType: "服务器",
  },
  {
    index: 6,
    securityZone: "核心生产区",
    name: "负载均衡器-LB07",
    networkIp: "172.17.8.15",
    deviceType: "网络设备",
  },
];

// 表单数据
const taskName = ref("");
const plantName = ref("");
const selectedCheckItems = ref([]); // 存储选中项
const selectedRangeItems = ref([]);
// 检查项目列表
const checkItemOptions = [
  {label: "基线核查"},
  {label: "高危端口"},
  {label: "漏洞扫描"},
  {label: "弱口令扫描"},
  {label: "违规外联"},
  {label: "违规外设"},
  {label: "恶意代码部署情况"},
];

// 保存按钮点击
function onSave() {
  const formData = {
    taskName: taskName.value,
    plantName: plantName.value,
    checkItems: selectedCheckItems.value,
    checkRanges: selectedRangeItems.value,
  };

  emit("save", formData);
}

// 取消按钮点击
function onCancel() {
  emit("cancel");
}
</script>

<template>
  <q-card bordered flat style="min-width: 70%">
    <q-card-section>
      <span class="text-h6">创建核查任务</span>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-1 flex flex-center text-body1">任务名称</div>
        <div class="col-4">
          <q-input v-model="taskName" filled/>
        </div>
        <div class="col-1 offset-1 flex flex-center text-body1">厂站名称</div>
        <div class="col-4">
          <q-input v-model="plantName" filled/>
        </div>
        <div class="row q-col-gutter-md q-gutter-y-md">
          <div class="col-1 flex flex-center text-body1">检查项目</div>
          <div class="col-11">
            <div class="bg-grey-3 q-pa-md rounded-borders">
              <div class="row q-col-gutter-md">
                <div
                    v-for="option in checkItemOptions"
                    :key="option.label"
                    class="col-3 col-md-4 col-sm-6"
                >
                  <q-checkbox
                      v-model="selectedCheckItems"
                      :val="option.label"
                      :label="option.label"
                      color="primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-md q-gutter-y-md">
        <div class="col-1 flex flex-center text-body1">检查范围</div>
        <div class="col-10">
          <q-table
              v-model:selected="selectedRows"
              selection="multiple"
              square
              no-data-label="暂无数据"
              flat
              bordered
              :rows="rows"
              :columns="columns"
              row-key="index"
              :table-row-class-fn="rowClassFn"
              :rows-per-page-options="[5, 10, 20, 50, 0]"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-md justify-center">
        <div class="col-4">
          <q-btn
              class="full-width"
              label="保存"
              color="primary"
              @click="onSave"
          />
        </div>
        <div class="col-4">
          <q-btn
              class="full-width"
              label="取消"
              color="red-10"
              @click="onCancel"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
