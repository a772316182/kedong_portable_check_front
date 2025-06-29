<script setup lang="ts">
// --- State: Only keep what's necessary for this specific page ---
const dialogVisible = ref(false);
const rows = ref([
  {index: 1, name: "通知单1", plantName: "厂站1", createTime: "2021-01-01 13:00:00", operator: "admin1"},
  {index: 2, name: "通知单2", plantName: "厂站2", createTime: "2021-01-01 00:12:00", operator: "admin2"},
  {index: 3, name: "通知单3", plantName: "厂站3", createTime: "2026-01-01 00:00:00", operator: "admin3"},
  {index: 4, name: "通知单4", plantName: "厂站4", createTime: "2021-01-05 00:00:00", operator: "admin4"},
  {index: 5, name: "通知单5", plantName: "厂站5", createTime: "2021-01-05 00:00:00", operator: "admin4"},
  {index: 6, name: "通知单6", plantName: "厂站6", createTime: "2021-01-05 00:00:00", operator: "admin4"},
  {index: 7, name: "通知单7", plantName: "厂站7", createTime: "2021-01-05 00:00:00", operator: "admin4"},
  {index: 8, name: "通知单8", plantName: "厂站8", createTime: "2021-01-05 00:00:00", operator: "admin4"},
]);

// --- Props for GenericTable: Define the table's appearance and behavior ---
const labels = {
  index: "序号",
  name: "通知单",
  plantName: "厂站名称",
  createTime: "创建时间",
  operator: "操作人",
  actions: "操作",
};

// --- Business Logic Methods: Specific to this page's functionality ---
function generateNoticeSlip() {
  dialogVisible.value = true;
}

function saveRectificationNotice(data: unknown) {
  dialogVisible.value = false;
  console.log("Data saved:", data);
  // Potentially add the new row to the `rows` ref here
}

function viewItem(item) {
  alert(`Viewing ${item.name}`);
}

function downloadItem(item) {
  alert(`Downloading ${item.name}`);
}

function deleteItem(item) {
  alert(`Deleting ${item.name}`);
}

</script>

<template>
  <q-page class="q-pa-md  q-gutter-y-md">
    <q-card flat>
      <q-card-section>
        <common-enhanced-table
            title="通知单列表"
            :rows="rows"
            row-key="index"
            :column-labels="labels"
            :non-sortable-columns="['actions']"
            :non-searchable-columns="['index', 'actions']"
        >
          <template #top-right>
            <q-btn color="primary" @click="generateNoticeSlip">生成通知单</q-btn>
          </template>

          <template #cell-actions="{ row }">
            <q-btn flat dense color="indigo-10" @click="viewItem(row)">查看</q-btn>
            <q-btn flat dense color="primary" @click="downloadItem(row)">下载</q-btn>
            <q-btn flat dense color="red-10" @click="deleteItem(row)">删除</q-btn>
          </template>

        </common-enhanced-table>
      </q-card-section>
    </q-card>
    <q-dialog v-model="dialogVisible">
      <rectification-notice-generate-notice-slip
          @cancel="dialogVisible = false"
          @save="saveRectificationNotice"
      />
    </q-dialog>
  </q-page>
</template>