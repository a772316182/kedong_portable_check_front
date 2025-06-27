<script setup lang="ts">
import { ref } from "vue";
import { rowClassFn } from "~/utils/tableStyle";

// 定义 emit
const emit = defineEmits(["save", "cancel"]);

// 表单数据
const taskName = ref("");
const plantName = ref("");
const selectedCheckItems = ref([]); // 存储选中项
const selectedRangeItems = ref([]);
// 检查项目列表
const checkItemOptions = [
  { label: "基线核查" },
  { label: "高危端口" },
  { label: "漏洞扫描" },
  { label: "弱口令扫描" },
  { label: "违规外联" },
  { label: "违规外设" },
  { label: "恶意代码部署情况" },
];
const checkRangeOptions = [
  { label: "I区 A网 192.11.12.31-33" },
  { label: "I区 A网 192.11.12.31-33" },
  { label: "I区 A网 192.11.12.31-33" },
  { label: "I区 A网 192.11.12.31-33" },
  { label: "I区 A网 192.11.12.31-33" },
  { label: "I区 A网 192.11.12.31-33" },
  { label: "I区 A网 192.11.12.31-33" },
  { label: "I区 B网 192.11.12.31-33" },
  { label: "I区 B网 192.11.12.31-33" },
  { label: "I区 B网 192.11.12.31-33" },
  { label: "I区 B网 192.11.12.31-33" },
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
          <q-input v-model="taskName" filled />
        </div>
        <div class="col-1 offset-1 flex flex-center text-body1">厂站名称</div>
        <div class="col-4">
          <q-input v-model="plantName" filled />
        </div>
      </div>
      <div class="row q-col-gutter-md q-gutter-y-md">
        <!-- 检查项目 -->
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

        <!-- 检查范围 - 独立的部分 -->
        <div class="col-1 flex flex-center text-body1">检查范围</div>
        <div class="col-11">
          <div class="bg-grey-3 q-pa-md rounded-borders">
            <div class="row q-col-gutter-md">
              <div
                v-for="option in checkRangeOptions"
                :key="option.label"
                class="col-3 col-md-4 col-sm-6"
              >
                <q-checkbox
                  v-model="selectedRangeItems"
                  :val="option.label"
                  :label="option.label"
                  color="primary"
                />
              </div>
            </div>
          </div>
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
