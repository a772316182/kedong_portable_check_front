<script setup>
import {ref, computed, reactive, watch} from 'vue';

// 1. Props 定义，功能默认开启
const props = withDefaults(defineProps({
  // --- 核心数据 ---
  title: String,
  rows: Array,
  columns: Array,
  rowKey: String,
  loading: Boolean,

  // --- 功能开关 (现在默认开启) ---
  enableSelection: Boolean,
  enableSearch: Boolean,
  enableSorting: Boolean,
  enablePagination: Boolean,
  virtualScroll: Boolean, // 虚拟滚动默认关闭，因为它适用于大数据量特殊场景

  // --- 初始状态 ---
  initialSelected: Array,
  initialPagination: Object,
}), {
  title: '',
  rowKey: 'id',
  loading: false,
  enableSelection: true,
  enableSearch: true,
  enableSorting: true,
  enablePagination: true,
  virtualScroll: false,
  initialSelected: () => [],
  initialPagination: () => ({page: 1, rowsPerPage: 10}),
});

// 2. Emits 定义
const emit = defineEmits(['update:selected']);

// 3. 内部状态管理
const pagination = ref({
  ...props.initialPagination,
});
const customPageJump = ref(null);
const selectedRows = ref(props.initialSelected);
const searchTerms = reactive({});
const sortState = reactive({column: null, direction: 'asc'});

// 初始化搜索词
if (props.enableSearch) {
  props.columns?.forEach(col => {
    if (col.searchable) {
      searchTerms[col.name] = '';
    }
  });
}

// 4. 核心逻辑：计算属性
const filteredAndSortedRows = computed(() => {
  let processedRows = [...props.rows];

  // a. 应用搜索
  if (props.enableSearch) {
    const activeSearchTerms = Object.entries(searchTerms).filter(([, value]) => value);
    if (activeSearchTerms.length > 0) {
      processedRows = processedRows.filter(row =>
          activeSearchTerms.every(([key, value]) =>
              String(row[key]).toLowerCase().includes(value.toLowerCase())
          )
      );
    }
  }

  // b. 应用排序
  if (props.enableSorting && sortState.column) {
    const {column, direction} = sortState;
    processedRows.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      if (typeof valA === 'string' && !isNaN(Date.parse(valA)) && typeof valB === 'string' && !isNaN(Date.parse(valB))) {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        // it's a number
      } else {
        valA = String(valA);
        valB = String(valB);
      }

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return processedRows;
});

// c. 应用分页
const paginatedRows = computed(() => {
  if (!props.enablePagination || !pagination.value.rowsPerPage) {
    return filteredAndSortedRows.value;
  }
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
  const end = start + pagination.value.rowsPerPage;
  return filteredAndSortedRows.value.slice(start, end);
});

const totalRows = computed(() => filteredAndSortedRows.value.length);
const maxPages = computed(() => {
  if (!pagination.value.rowsPerPage) return 1;
  return Math.ceil(totalRows.value / pagination.value.rowsPerPage)
});
const paginationInfo = computed(() => {
  const start = totalRows.value === 0 ? 0 : (pagination.value.page - 1) * pagination.value.rowsPerPage + 1;
  const end = Math.min(pagination.value.page * pagination.value.rowsPerPage, totalRows.value);
  return `第 ${start}-${end} 条，共 ${totalRows.value} 条`;
});

// 5. 方法
watch(selectedRows, (newValue) => {
  emit('update:selected', newValue);
});

function handleSortClick(col) {
  if (!col.sortable) return;
  const columnName = col.name;
  if (sortState.column === columnName) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.column = columnName;
    sortState.direction = 'asc';
  }
}

function getSortIcon(colName) {
  if (sortState.column !== colName) return 'unfold_more';
  return sortState.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
}

function goToPage() {
  if (customPageJump.value === null) return;
  const pageNum = Number(customPageJump.value);
  if (pageNum >= 1 && pageNum <= maxPages.value) {
    pagination.value.page = pageNum;
    customPageJump.value = null;
  }
}
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <slot name="top">
        <div v-if="title" class="text-h6">{{ title }}</div>
      </slot>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-table
          v-model:selected="selectedRows"
          :rows="paginatedRows"
          :columns="columns"
          :row-key="rowKey"
          :loading="loading"
          :selection="enableSelection ? 'multiple' : 'none'"
          :virtual-scroll="virtualScroll"
          hide-pagination
          square
          flat
          bordered
          no-data-label="暂无数据"
          class="universal-table"
      >
        <template #header="props">
          <q-tr :props="props" class="custom-header">
            <q-th v-if="enableSelection" auto-width>
              <q-checkbox v-model="props.selected"/>
            </q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props" @click="handleSortClick(col)">
              <div class="row items-center no-wrap justify-center">
                <span>{{ col.label }}</span>
                <q-btn
                    v-if="enableSearch && col.searchable"
                    dense flat round icon="search" size="sm" class="q-ml-xs"
                    @click.stop
                >
                  <q-popup-edit v-slot="scope" v-model="searchTerms[col.name]" auto-save>
                    <q-input
                        v-model="scope.value"
                        dense autofocus label="搜索..."
                        @keyup.enter="scope.set"
                    />
                  </q-popup-edit>
                </q-btn>
                <q-icon
                    v-if="enableSorting && col.sortable"
                    :name="getSortIcon(col.name)"
                    size="sm"
                    class="q-ml-xs"
                />
              </div>
            </q-th>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td v-if="enableSelection">
              <q-checkbox v-model="props.selected"/>
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <slot :name="`body-cell-${col.name}`" :row="props.row" :value="props.row[col.name]">
                {{ props.row[col.name] }}
              </slot>
            </q-td>
          </q-tr>
        </template>

        <template #no-data>
          <slot name="no-data">
            <div class="full-width row flex-center text-grey q-gutter-sm q-pa-lg">
              <q-icon size="2em" name="sentiment_dissatisfied"/>
              <span>暂无可用数据</span>
            </div>
          </slot>
        </template>
      </q-table>
    </q-card-section>

    <q-card-section v-if="enablePagination" class="row items-center justify-start q-mt-md">
      <div class="text-caption q-mr-md">
        {{ paginationInfo }}
      </div>
      <q-pagination
          v-model="pagination.page"
          :max="maxPages"
          :max-pages="6"
          direction-links
          boundary-links
          size="sm"
          flat
          color="grey"
          active-color="primary"
          class="pagination-custom q-mr-md"
      />
      <div class="text-caption page-size-display q-mr-md">
        {{ pagination.rowsPerPage }} 条/页
      </div>
      <div class="row items-center">
        <span class="q-mr-sm text-caption">跳至</span>
        <q-input
            v-model.number="customPageJump"
            type="number"
            dense
            style="width: 60px;"
            class="page-jump-input"
            @keyup.enter="goToPage"
        />
        <span class="q-ml-sm text-caption">页</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
/* 样式与之前版本保持一致 */
.custom-header {
  background-color: #006A6A !important;
}

.custom-header th {
  color: white !important;
  font-weight: bold;
  cursor: pointer;
}

.custom-header th:hover {
  background-color: #004D40;
}

.pagination-custom .q-btn,
.page-size-display,
.page-jump-input .q-field__control {
  border: 1px solid #3BB5A3 !important;
  border-radius: 4px !important;
  background: #E0F2F1 !important;
  color: #006A6A !important;
  min-height: 28px !important;
  height: 28px !important;
}

.pagination-custom .q-btn {
  min-width: 28px !important;
}

.pagination-custom .q-btn.q-btn--active {
  background: #006A6A !important;
  color: white !important;
}

.page-size-display {
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
}

.page-jump-input .q-field__control,
.page-jump-input .q-field__native {
  height: 28px !important;
  min-height: 28px !important;
  padding: 0 8px;
}
</style>