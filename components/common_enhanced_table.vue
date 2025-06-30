<script setup lang="ts">
import type {QTableProps} from 'quasar';

interface Props {
  title?: string;
  rows: Record<string, any>[];
  rowKey: string;
  // 用于隐藏不想在表格中展示的列
  hiddenColumns?: string[];
  // 用于将字段名映射为更友好的列标题
  columnLabels?: Record<string, string>;
  // 控制哪些列不可排序或不可搜索
  nonSortableColumns?: string[];
  nonSearchableColumns?: string[];
  // 开启多选
  enableSelection?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  rows: () => [],
  hiddenColumns: () => [],
  columnLabels: () => ({}),
  nonSortableColumns: () => [],
  nonSearchableColumns: () => [],
  enableSelection: false,
});

const emit = defineEmits(['update:selection']);

// --- 内部状态管理 ---
const search = reactive<Record<string, string>>({});
const sortState = reactive<{ column: string | null; direction: 'asc' | 'desc' }>({
  column: null,
  direction: 'asc',
});
const pagination = ref({
  page: 1,
  rowsPerPage: 50,
});
const customPage = ref(1);
const selected = ref<Record<string, any>[]>([]);

const rowsPerPageOptions = [
  {label: '5 条/页', value: 5},
  {label: '10 条/页', value: 10},
  {label: '20 条/页', value: 20},
  {label: '50 条/页', value: 50},
  {label: '全部', value: 0},
];


const generatedColumns = computed<QTableProps['columns']>(() => {
  // 如果没有提供列标签，则不生成任何列
  if (Object.keys(props.columnLabels).length === 0) return [];

  // 【修复】: 使用 columnLabels 的键作为列的真实来源。
  // 这允许我们创建像 'actions' 这样不存在于 row 数据中的“虚拟列”。
  const allDefinedKeys = Object.keys(props.columnLabels);

  // 过滤掉需要在表格中隐藏的列
  const visibleKeys = allDefinedKeys.filter(key => !props.hiddenColumns.includes(key));

  return visibleKeys.map(key => ({
    name: key,
    label: props.columnLabels[key] || key.charAt(0).toUpperCase() + key.slice(1),
    field: key,
    align: 'left',
    isCustomSortable: !props.nonSortableColumns.includes(key),
    isCustomSearchable: !props.nonSearchableColumns.includes(key),
  }));
});


// --- 核心计算属性：搜索、排序和分页 ---

// 1. 搜索和排序
const filteredAndSortedRows = computed(() => {
  let result = [...props.rows];

  // 过滤
  const searchKeys = Object.keys(search).filter(key => search[key]);
  if (searchKeys.length > 0) {
    result = result.filter(row =>
        searchKeys.every(key =>
            String(row[key]).toLowerCase().includes(search[key].toLowerCase())
        )
    );
  }

  // 排序
  if (sortState.column) {
    const col = sortState.column;
    const dir = sortState.direction;
    result.sort((a, b) => {
      const valA = a[col];
      const valB = b[col];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return dir === 'asc' ? valA - valB : valB - valA;
      }
      // 尝试解析为日期
      const dateA = new Date(valA).getTime();
      const dateB = new Date(valB).getTime();
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dir === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // 字符串比较
      return String(valA).localeCompare(String(valB)) * (dir === 'asc' ? 1 : -1);
    });
  }

  return result;
});

// 2. 分页
const paginatedRows = computed(() => {
  if (pagination.value.rowsPerPage === 0) {
    return filteredAndSortedRows.value;
  }
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
  const end = start + pagination.value.rowsPerPage;
  return filteredAndSortedRows.value.slice(start, end);
});


// --- 分页相关计算属性 ---
const totalPages = computed(() => {
  if (pagination.value.rowsPerPage === 0) return 1;
  return Math.ceil(filteredAndSortedRows.value.length / pagination.value.rowsPerPage);
});

const currentPageRange = computed(() => {
  const total = filteredAndSortedRows.value.length;
  if (total === 0) return {start: 0, end: 0};

  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage + 1;
  const end = Math.min(start + pagination.value.rowsPerPage - 1, total);

  return {start, end};
});


// --- 方法 ---
function handleSortClick(columnName: string) {
  if (sortState.column === columnName) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.column = columnName;
    sortState.direction = 'asc';
  }
}

function getSortIcon(colName: string) {
  if (sortState.column !== colName) return 'unfold_more';
  return sortState.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
}

function goToPage() {
  const page = Number(customPage.value);
  if (page > 0 && page <= totalPages.value) {
    pagination.value.page = page;
  }
}

// --- 侦听器 ---
// 当内部选择变化时，emit到父组件
watch(selected, (newValue) => {
  emit('update:selection', newValue);
});

// 当父组件传入的行数据变化时，重置分页到第一页
watch(() => props.rows, () => {
  pagination.value.page = 1;
});
</script>

<template>
  <div>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">{{ title }}</div>
      <!-- 直接添加一个不可见的按钮，让row在top-right不插入按钮时，也能保持和插入按钮时一样的高度，避免复杂的height计算逻辑 -->
      <q-btn flat disable/>
      <div>
        <slot name="top-right"/>
      </div>
    </div>

    <q-table
        v-model:pagination="pagination"
        v-model:selected="selected"
        :table-row-class-fn="rowClassFn"
        square
        no-data-label="暂无数据"
        flat
        bordered
        :rows="paginatedRows"
        :columns="generatedColumns"
        :row-key="rowKey"
        hide-bottom
        :selection="enableSelection ? 'multiple' : 'none'"
    >
      <template #header="props">
        <q-tr :props="props">
          <q-th v-if="enableSelection" auto-width>
            <q-checkbox v-model="props.selected"/>
          </q-th>

          <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              :class="`text-${col.align || 'left'}`"
          >
            <div class="row items-center no-wrap justify-between">
              <span class="no-wrap">{{ col.label }}</span>
              <div class="row items-center no-wrap">
                <template v-if="col.isCustomSearchable">
                  <q-btn dense flat round icon="search" size="sm" @click.stop>
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
                          label="搜索..."
                          @keyup.enter="scope.set"
                      />
                    </q-popup-edit>
                  </q-btn>
                </template>

                <template v-if="col.isCustomSortable">
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

      <template #body="props">
        <q-tr :props="props">
          <q-td v-if="enableSelection" auto-width>
            <q-checkbox v-model="props.selected"/>
          </q-td>

          <q-td v-for="col in generatedColumns" :key="col.name" :props="props">
            <slot :name="`cell-${col.name}`" :row="props.row" :value="props.row[col.field]">
              {{ props.row[col.field] }}
            </slot>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <div v-if="pagination.rowsPerPage > 0" class="row items-center justify-start q-mt-md">
      <div class="text-caption q-mr-md">
        第 {{ currentPageRange.start }}-{{ currentPageRange.end }} 条，共 {{ filteredAndSortedRows.length }} 条
      </div>

      <q-pagination
          v-model="pagination.page"
          :max="totalPages"
          :max-pages="6"
          direction-links
          boundary-links
          boundary-numbers
          size="sm"
          flat
          color="black"
          active-color="primary"
          class="my-pagination-custom q-mr-md"
      />

      <div class="row items-center q-gutter-x-md">
        <q-select
            v-model="pagination.rowsPerPage"
            :options="rowsPerPageOptions"
            dense
            borderless
            emit-value
            map-options
            options-dense
            style="min-width: 80px"
        />

        <div class="row items-center no-wrap">
          <span class="q-mr-sm text-caption">跳至</span>
          <q-input
              v-model.number="customPage"
              type="number"
              dense
              style="width: 60px"
              class="custom-jump-input"
              @keyup.enter="goToPage"
          />
          <span class="q-ml-sm text-caption">页</span>
          <q-btn class="q-ml-sm text-caption" flat dense @click="goToPage">确定</q-btn>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.q-table th {
  font-weight: bold;
}

.my-pagination-custom .q-btn {
  border-radius: 4px;
}

.custom-jump-input .q-field__control {
  padding: 0 8px;
}

.custom-header th {
  font-weight: bold;
  color: white !important;
}

::v-deep(.my-pagination-custom .q-pagination__content .q-btn[aria-label*="页"]),
.custom-page-size,
::v-deep(.custom-jump-input .q-field__control) {
  /* border: 1px solid #2e7d32 !important; */
  border: 1px solid #3BB5A3 !important;
  border-radius: 4px !important;
}

::v-deep(.my-pagination-custom .q-pagination__content .q-btn[aria-label*="页"]) {
  /* background: #e8f5e9 !important;
  color: #2e7d32 !important; */
  background: #E0F2F1 !important;
  color: #3BB5A3 !important;
  min-width: 28px !important;
  min-height: 28px !important;
}


::v-deep(.custom-jump-input .q-field__control) {
  /* background-color: #e8f5e9 !important; */
  background-color: #E0F2F1 !important;
  height: 28px !important;
  min-height: unset !important;
}

::v-deep(.custom-jump-input .q-field__native) {
  color: black !important;
  padding: 0 8px;
  height: 26px !important;
}

::v-deep(.custom-jump-input) {
  height: 28px !important;
}
</style>