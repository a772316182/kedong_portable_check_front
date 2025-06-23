<script setup lang="ts">
import Rectification_notice_generate_notice_slip from "~/components/rectification_notice_generate_notice_slip.vue";
import { rowClassFn } from "~/utils/tableStyle";

const dialogVisible = ref(false);

const columns = [
  {
    name: "index",
    label: "序号",
    field: "index",
    issortable: true, //因为要使用自定义的排序按钮，因此不使用原生的sortable参数
    align: "center",
    searchable: false,
  },
  {
    name: "name",
    label: "通知单",
    field: "name",
    align: "left",
    searchable: true,
  },
  {
    name: "plantName",
    label: "厂站名称",
    field: "plantName",
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
    name: "operator",
    label: "操作人",
    field: "operator",
    issortable: true,
    align: "center",
    searchable: true,
  },
  {
    name: "actions",
    label: "操作",
    field: "actions",
    align: "center",
    issortable: false,
  },
];
const rows = [
  {
    index: 1,
    name: "通知单1",
    plantName: "厂站1",
    createTime: "2021-01-01 13:00:00",
    operator: "admin1",
  },
  {
    index: 2,
    name: "通知单2",
    plantName: "厂站2",
    createTime: "2021-01-01 00:12:00",
    operator: "admin2",
  },
  {
    index: 3,
    name: "通知单3",
    plantName: "厂站3",
    createTime: "2026-01-01 00:00:00",
    operator: "admin3",
  },
  {
    index: 4,
    name: "通知单4",
    plantName: "厂站4",
    createTime: "2021-01-05 00:00:00",
    operator: "admin4",
  },
  {
    index: 5,
    name: "通知单4",
    plantName: "厂站4",
    createTime: "2021-01-05 00:00:00",
    operator: "admin4",
  },
  {
    index: 6,
    name: "通知单4",
    plantName: "厂站4",
    createTime: "2021-01-05 00:00:00",
    operator: "admin4",
  },
  {
    index: 7,
    name: "通知单4",
    plantName: "厂站4",
    createTime: "2021-01-05 00:00:00",
    operator: "admin4",
  },
  {
    index: 8,
    name: "通知单4",
    plantName: "厂站4",
    createTime: "2021-01-05 00:00:00",
    operator: "admin4",
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

function generateNoticeSlip() {
  dialogVisible.value = true;
}

function saveRectificationNotice(data: unknown) {
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
</script>

<template>
  <div>
    <q-page class="q-pa-md q-gutter-y-md">
      <div class="q-gutter-y-md">
        <div class="row">
          <q-btn color="primary" class="col-auto" @click="generateNoticeSlip"
            >创建核查任务</q-btn
          >
        </div>
        <q-table
          square
          no-data-label="暂无数据"
          flat
          bordered
          title="核查任务表"
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
                          v-model="search[col.name]"
                          v-slot="scope"
                          anchor="top left"
                          self="bottom right"
                          auto-save
                        >
                          <q-input
                            dense
                            autofocus
                            v-model="scope.value"
                            @keyup.enter="scope.set"
                            label="搜索"
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
              <q-td key="index" :props="props">{{ props.row.index }}</q-td>
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="plantName" :props="props">{{
                props.row.plantName
              }}</q-td>
              <q-td key="createTime" :props="props">{{
                props.row.createTime
              }}</q-td>
              <q-td key="operator" :props="props">{{
                props.row.operator
              }}</q-td>
              <q-td key="actions" :props="props">
                <q-btn flat color="indigo-10">查看</q-btn>
                <q-btn flat color="primary">下载</q-btn>
                <q-btn flat color="red-10">删除</q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-page>
    <q-dialog v-model="dialogVisible">
      <rectification_notice_generate_notice_slip
        @cancel="dialogVisible = false"
        @save="saveRectificationNotice"
      />
    </q-dialog>
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
