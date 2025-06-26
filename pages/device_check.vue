<script setup lang="ts">
import device_check_generate from "~/components/device_check_generate.vue";
import device_check_step2 from "~/components/device_check_step2.vue";
import device_check_step3 from "~/components/device_check_step3.vue";
import { rowClassFn } from "~/utils/tableStyle";

const dialogVisible = ref(false);

const columns = [
  {
    name: "index",
    label: "编号",
    field: "index",
    issortable: true,
    align: "center",
    searchable: false,
  },
  {
    name: "taskName",
    label: "任务名称",
    field: "taskName",
    issortable: true,
    align: "left",
    searchable: true,
  },
  {
    name: "createTime",
    label: "创建时间",
    field: "createTime",
    issortable: true,
    align: "center",
    searchable: true,
  },
  {
    name: "checkItem",
    label: "核查项",
    field: "checkItem",
    issortable: true,
    align: "center",
    searchable: false,
  },
  {
    name: "taskStatus",
    label: "任务状态",
    field: "taskStatus",
    issortable: true,
    align: "center",
    searchable: false,
  },
  {
    name: "actions",
    label: "操作",
    field: "actions",
    issortable: false,
    align: "center",
    searchable: false,
  },
];
const rows = [
  {
    index: 1,
    taskName: "通知单1",
    createTime: "2021-01-01 13:00:00",
    checkItem: ["XXXX", "XXXX", "XXXX", "XXXX"],
    taskStatus: "进行中",
  },
  {
    index: 2,
    taskName: "通知单2",
    createTime: "2021-01-01 00:12:00",
    checkItem: ["XXXX"],
    taskStatus: "已完成",
  },
  {
    index: 3,
    taskName: "通知单3",
    createTime: "2026-01-01 00:00:00",
    checkItem: ["XXXX", "XXXX", "XXXX", "XXXX"],
    taskStatus: "已完成",
  },
  {
    index: 4,
    taskName: "通知单4",
    createTime: "2021-01-05 00:00:00",
    checkItem: ["XXXX", "XXXX"],
    taskStatus: "进行中",
  },
];

// 添加自定义排序状态
const sortState = reactive<{
  column: string | null;
  direction: "asc" | "desc";
}>({
  column: null,
  direction: "asc",
});

const search = reactive({
  name: "",
  plantName: "",
  createTime: "",
  operator: "",
});

const currentStep = ref("1"); // 使用字符串而不是数字来表示步骤
const selectedTask = ref(null);

function generateNoticeSlip() {
  dialogVisible.value = true;
}

function saveDeviceCheck(data: unknown) {
  dialogVisible.value = false;
  console.log(data);
}

// 自定义排序函数
const customSort = (rows: any[], column: string, direction: "asc" | "desc") => {
  return [...rows].sort((a, b) => {
    let valA = a[column];
    let valB = b[column];

    // 特殊处理日期排序
    if (column === "createTime") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    // 处理数字索引排序
    if (column === "index") {
      valA = Number(valA);
      valB = Number(valB);
    }

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

// 修改后的过滤+排序计算属性
const filteredRows = computed(() => {
  let result = rows.filter((row) =>
    Object.keys(search).every((key) =>
      String(row[key as keyof typeof row])
        .toLowerCase()
        .includes(search[key as keyof typeof search].toLowerCase())
    )
  );

  // 应用自定义排序
  if (sortState.column) {
    result = customSort(result, sortState.column, sortState.direction);
  }

  return result;
});

// 修改排序按钮点击处理函数
function handleSortClick(columnName: string) {
  if (sortState.column === columnName) {
    // 同一列：切换排序方向
    sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
  } else {
    // 新列：设置默认升序
    sortState.column = columnName;
    sortState.direction = "asc";
  }
}

// 获取排序图标函数
function getSortIcon(colName: string) {
  if (sortState.column !== colName) return "unfold_more";
  return sortState.direction === "asc" ? "arrow_upward" : "arrow_downward";
}

// 查看任务详情
function viewTask(task) {
  if (task.taskStatus === "已完成") {
    selectedTask.value = task;
    currentStep.value = "2"; // 进入第二步
  }
}
</script>

<template>
  <div>
    <q-stepper
      v-model="currentStep"
      alternative-labels
      active-color="orange"
      done-color="green"
    >
      <q-step name="1" title="创建任务" :done="currentStep > '1'">
        <div>
          <q-page class="q-pa-md q-gutter-y-md">
            <div class="q-gutter-y-md">
              <div class="row">
                <q-btn
                  color="primary"
                  class="col-auto"
                  @click="generateNoticeSlip"
                >
                  创建核查任务
                </q-btn>
              </div>
              <q-table
                square
                no-data-label="暂无数据"
                flat
                bordered
                title="任务列表"
                :rows="filteredRows"
                :columns="columns"
                row-key="index"
                :table-row-class-fn="rowClassFn"
                :rows-per-page-options="[5, 10, 20, 50, 0]"
                :sort-method="() => {}"
                @sort="(ctx) => {}"
              >
                <template #header="props">
                  <q-tr :props="props">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      class="relative"
                    >
                      <div class="row items-center no-wrap justify-between">
                        <span>{{ col.label }}</span>
                        <div class="row items-center">
                          <!-- 只在 searchable 为 true 的列显示搜索按钮 -->
                          <template v-if="col.searchable">
                            <q-btn
                              dense
                              flat
                              round
                              icon="search"
                              size="sm"
                              @click.stop
                            >
                              <q-popup-edit
                                v-slot="scope"
                                v-model="search[col.name]"
                                anchor="top left"
                                self="bottom right"
                                auto-save
                              >
                                <q-input
                                  v-model="scope.value"
                                  dense
                                  autofocus
                                  label="搜索"
                                  @keyup.enter="scope.set"
                                />
                              </q-popup-edit>
                            </q-btn>
                          </template>

                          <template v-if="col.issortable">
                            <q-btn
                              dense
                              flat
                              round
                              :icon="getSortIcon(col.name)"
                              size="sm"
                              @click="handleSortClick(col.name)"
                            />
                          </template>
                        </div>
                      </div>
                    </q-th>
                  </q-tr>
                </template>
                <!-- 保留 body 插槽 -->
                <template #body="props">
                  <q-tr :props="props">
                    <q-td key="index" :props="props">{{
                      props.row.index
                    }}</q-td>
                    <q-td key="taskName" :props="props">{{
                      props.row.taskName
                    }}</q-td>
                    <q-td key="createTime" :props="props">{{
                      props.row.createTime
                    }}</q-td>
                    <q-td key="checkItem" :props="props">
                      <div class="q-gutter-sm row items-center">
                        <q-badge
                          v-for="(item, index) in props.row.checkItem"
                          :key="index"
                          color="green-1"
                          text-color="green-7"
                          class="q-pa-sm"
                        >
                          {{ item }}
                        </q-badge>
                      </div>
                    </q-td>
                    <q-td
                      key="taskStatus"
                      :props="props"
                      :class="{
                        'text-green': props.row.taskStatus === '进行中',
                        'text-black': props.row.taskStatus === '已完成',
                      }"
                      >{{ props.row.taskStatus }}
                    </q-td>
                    <q-td key="actions" :props="props">
                      <q-btn
                        flat
                        color="indigo-10"
                        :label="
                          props.row.taskStatus === '进行中' ? '暂停' : '查看'
                        "
                        @click="viewTask(props.row)"
                      />
                      <q-btn flat color="primary">下载</q-btn>
                      <q-btn flat color="red-10">删除</q-btn>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-page>
          <q-dialog v-model="dialogVisible">
            <device_check_generate
              @cancel="dialogVisible = false"
              @save="saveDeviceCheck"
            />
          </q-dialog>
        </div>
      </q-step>
      <q-step name="2" title="基础检查" :done="currentStep > '2'">
        <div>
          <q-page class="q-pa-md">
            <!-- 这里放置第二步的内容组件 -->
            <device_check_step2
              :task="selectedTask"
              @back="currentStep = '1'"
              @next="currentStep = '3'"
            />
          </q-page>
        </div>
      </q-step>
      <q-step name="3" title="检查结果" :done="currentStep > '3'">
        <div>
          <q-page class="q-pa-md">
            <device_check_step3
              :task="selectedTask"
              @back="currentStep = '2'"
              @next="currentStep = '1'"
            />
          </q-page>
        </div>
      </q-step>
    </q-stepper>
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
