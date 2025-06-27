<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { rowClassFn } from "~/utils/tableStyle";
import { useStationManageApi, useBasicConfigApi, useCityApi } from "~/composables/useApi";
import type { StationManageParams } from "~/types/api";
import type { QTableProps } from "quasar";

// 直接定义列类型，避免复杂的类型体操
interface CustomColumn {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: any, rowB: any) => number;
  format?: (val: any, row: any) => any;
  style?: string | ((row: any) => string);
  classes?: string | ((row: any) => string);
  headerStyle?: string;
  headerClasses?: string;
  // 自定义属性
  searchable?: boolean;
  hasOptions?: boolean;
  options?: { label: string; value: any }[];
  isDateRange?: boolean;
}

// 对话框可见性
const dialogVisible = ref(false);
const editDialogVisible = ref(false);
const stationDetailVisible = ref(false);

// API 状态
const loading = ref(false);
const { stationState, fetchStationData } = useStationManageApi();
const { addStation, getStation, updateStation, deleteStation } =
  useBasicConfigApi();
const { fetchCityData } = useCityApi();

// 数据
const allRows = ref<any[]>([]);
const stationDetail = ref<any | null>(null);
const provinces = ref<any[]>([]);
const cities = ref<any[]>([]);
const provincesLoading = ref(false);
const citiesLoading = ref(false);
const newStation = reactive({
  stationId: "", // 保留该字段但不再显示在表单中给用户填写，后端会自动生成
  stationName: "",
  stationType: "",
  province: null as string | null,
  city: null as string | null,
  voltagelevel: null as number | null,
  manufactor: "",
  drawTuoPu: true,
});
const editStation = reactive({
  stationId: "",
  stationName: "",
  stationType: "",
  province: null as string | null,
  city: null as string | null,
  voltagelevel: null as number | null,
  manufactor: "",
  drawTuoPu: true,
});

// 筛选参数对象，作为唯一的数据源
const searchFilters = reactive<{ [key: string]: any }>({
  station_name: "",
  station_type: null,
  province: "",
  city: "",
  acceptSTime: "",
  acceptETime: "",
});

// 仅用于UI的日期范围模型
const dateRangeUI = ref({
  from: "",
  to: "",
});

// 排序状态 (前端处理)
const sortState = reactive<{ column: string | null; direction: "asc" | "desc" }>({
  column: "last_check_time",
  direction: "desc",
});

// 分页状态 (前端处理)
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
});

// 下拉框选项
const stationTypeOptions = [
  { label: "变电站", value: "变电站" },
  { label: "水电站", value: "水电站" },
  { label: "换流站", value: "换流站" },
  { label: "风电站", value: "风电站" },
  { label: "光伏站", value: "光伏站" },
];
const voltageLevelOptions = [
  { label: "1000kV", value: 1000 },
  { label: "750kV", value: 750 },
  { label: "500kV", value: 500 },
  { label: "330kV", value: 330 },
  { label: "220kV", value: 220 },
  { label: "110kV", value: 110 },
  { label: "35kV", value: 35 },
  { label: "10kV", value: 10 },
];

// 表格列定义
const columns: CustomColumn[] = [
  {
    name: "station_id",
    label: "厂站ID",
    field: "station_id",
    sortable: true,
    align: "center",
  },
  {
    name: "station_name",
    label: "厂站名称",
    field: "station_name",
    sortable: true,
    align: "left",
    searchable: true,
  },
  {
    name: "station_type",
    label: "厂站类型",
    field: "station_type",
    sortable: true,
    align: "center",
    searchable: true,
    hasOptions: true,
    options: stationTypeOptions,
  },
  {
    name: "province",
    label: "省份",
    field: "province",
    sortable: true,
    align: "center",
    searchable: true,
  },
  {
    name: "city",
    label: "城市",
    field: "city",
    sortable: true,
    align: "center",
    searchable: true,
  },
  {
    name: "voltage_level",
    label: "电压等级",
    field: "voltage_level",
    sortable: true,
    align: "center",
  },
  {
    name: "assets_num",
    label: "资产数量",
    field: "assets_num",
    sortable: true,
    align: "center",
  },
  {
    name: "reports_num",
    label: "报告数量",
    field: "reports_num",
    sortable: true,
    align: "center",
  },
  {
    name: "last_check_time",
    label: "最近检查时间",
    field: "last_check_time",
    sortable: true,
    align: "center",
    isDateRange: true,
  },
  {
    name: "actions",
    label: "操作",
    field: "actions",
    align: "center",
  },
];

// 用于表格显示的计算属性 (仅处理前端排序)
const sortedRows = computed(() => {
  let data = [...allRows.value];
  if (sortState.column) {
    const col = sortState.column;
    data.sort((a, b) => {
      // Custom sort for last_check_time to handle nulls/invalids
      if (col === "last_check_time") {
        const hasDateA = a[col] && !isNaN(new Date(a[col]).getTime());
        const hasDateB = b[col] && !isNaN(new Date(b[col]).getTime());

        if (hasDateA && !hasDateB) return -1; // a has date, b doesn't. a comes first.
        if (!hasDateA && hasDateB) return 1;  // b has date, a doesn't. b comes first.
        if (!hasDateA && !hasDateB) return 0; // a and b are equal in sort order.

        // Both have valid dates, so compare them
        const dateA = new Date(a[col]).getTime();
        const dateB = new Date(b[col]).getTime();
        
        return sortState.direction === 'desc' ? dateB - dateA : dateA - dateB;
      }

      // Generic sort for other columns
      let valA = a[col], valB = b[col];
      if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = String(valA ?? ''); // Treat null/undefined as empty string for consistent sorting
        valB = String(valB ?? '');
      }

      const sortOrder = sortState.direction === "asc" ? 1 : -1;
      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;
      return 0;
    });
  }
  return data;
});

// 辅助函数：加载省份列表，防止重复加载
const loadProvinces = async () => {
  if (provinces.value.length > 0 || provincesLoading.value) return;
  provincesLoading.value = true;
  try {
    const provinceData = await $fetch('/api/city', { query: { areaPid: 0 } });
    if (provinceData && provinceData.retNum === 0) {
      provinces.value = provinceData.messageContent;
    }
  } catch (e) {
    console.error("加载省份失败:", e);
  } finally {
    provincesLoading.value = false;
  }
};

// 辅助函数：根据省份名称加载城市列表
const loadCities = async (provinceName: string | null) => {
  cities.value = [];
  if (!provinceName) return;

  await loadProvinces(); // 确保省份数据已加载

  const selectedProvince = provinces.value.find(p => p.area_name === provinceName);
  if (selectedProvince) {
    citiesLoading.value = true;
    try {
      const cityData = await $fetch('/api/city', { query: { areaPid: selectedProvince.area_code } });
      if (cityData && cityData.retNum === 0) {
        cities.value = cityData.messageContent;
      }
    } catch (e) {
      console.error("加载城市失败:", e);
    } finally {
      citiesLoading.value = false;
    }
  }
};

// 从服务器加载数据 (后端筛选)
async function loadDataFromServer() {
  loading.value = true;
  try {
    const apiParams: Partial<StationManageParams> = { ...searchFilters };
    await fetchStationData(apiParams as StationManageParams);
    if (stationState.value.data && Array.isArray(stationState.value.data.messageContent)) {
      // Add a sequential index to each row for styling and row-key
      allRows.value = stationState.value.data.messageContent.map((row, index) => ({
        ...row,
        index: index + 1,
      }));
    } else {
      allRows.value = [];
    }
    pagination.value.page = 1;
  } catch (error) {
    console.error("加载厂站数据失败:", error);
    allRows.value = [];
  } finally {
    loading.value = false;
  }
}

// 应用所有筛选条件并从服务器重新加载数据
function applyFiltersAndReload() {
  // Only add time filters if a date is actually selected
  searchFilters.acceptSTime = dateRangeUI.value.from
    ? `${dateRangeUI.value.from} 00:00:00`
    : "";
  searchFilters.acceptETime = dateRangeUI.value.to
    ? `${dateRangeUI.value.to} 23:59:59`
    : "";
  loadDataFromServer();
}

function clearDateFilterAndReload() {
    dateRangeUI.value.from = "";
    dateRangeUI.value.to = "";
    applyFiltersAndReload();
}

// 处理排序点击 (前端)
function handleSortClick(columnName: string) {
  if (sortState.column === columnName) {
    sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
  } else {
    sortState.column = columnName;
    sortState.direction = "asc";
  }
}

// 获取排序图标
function getSortIcon(colName: string) {
  if (sortState.column !== colName) return "unfold_more";
  return sortState.direction === "asc" ? "arrow_upward" : "arrow_downward";
}

// Helper function to clear a specific filter
function clearFilter(colName: string) {
    if (colName in searchFilters) {
        searchFilters[colName] = colName === 'station_type' ? null : '';
        applyFiltersAndReload();
    }
}

// Helper function to get display text for filter chips
function getFilterDisplay(col: CustomColumn, value: any): string {
  if (col.hasOptions && col.options) {
    const option = col.options.find(opt => opt.value === value);
    return option ? option.label : String(value);
  }
  return String(value);
}

// 添加新厂站
async function addNewStation() {
  loading.value = true;
  try {
    // 确保stationId传空字符串给后端，由后端自动生成ID
    const stationData = { ...newStation, stationId: "" };
    await addStation(stationData);
    dialogVisible.value = false;
    Object.assign(newStation, { // 重置表单
      stationId: "", stationName: "", stationType: "", province: null,
      city: null, voltagelevel: null, manufactor: "", drawTuoPu: true,
    });
    await loadDataFromServer(); // 重新加载数据
  } catch (error) {
    console.error("添加厂站失败:", error);
  } finally {
    loading.value = false;
  }
}

// 查看厂站详情
async function viewStationDetail(stationId: string) {
  loading.value = true;
  try {
    const response = await getStation(stationId);
    if (response && response.retNum === 0) {
      stationDetail.value = response.messageContent;
      stationDetailVisible.value = true;
    }
  } catch (error) {
    console.error("获取厂站详情失败:", error);
  } finally {
    loading.value = false;
  }
}

// 打开编辑对话框
async function openEditDialog(stationId: string) {
  loading.value = true;
  try {
    const response = await getStation(stationId);
    if (response && response.retNum === 0) {
      const data = response.messageContent;

      // 1. 先重置并赋值除城市外的所有字段
      Object.assign(editStation, {
        ...data,
        city: null, // 先将城市设置为空
        stationId: stationId
      });

      // 2. 根据省份加载对应的城市列表，并等待其完成
      await loadCities(data.province);

      // 3. 城市列表加载完毕后，再设置城市的值以确保正确回显
      editStation.city = data.city;

      if (data.voltagelevel && typeof data.voltagelevel === "string") {
        editStation.voltagelevel = parseInt(data.voltagelevel, 10);
      }
      
      editDialogVisible.value = true;
    }
  } catch (error) {
    console.error("加载待编辑的厂站失败:", error);
  } finally {
    loading.value = false;
  }
}

// 更新厂站信息
async function updateStationInfo() {
  loading.value = true;
  try {
    await updateStation(editStation);
    editDialogVisible.value = false;
    await loadDataFromServer(); // 重新加载数据
  } catch (error) {
    console.error("更新厂站失败:", error);
  } finally {
    loading.value = false;
  }
}

// 删除厂站
async function removeStation(stationId: string) {
  // 在Quasar环境中使用Dialog插件更友好，但window.confirm也能工作
  if (window.confirm("确定要删除该厂站吗？此操作不可恢复。")) {
    loading.value = true;
    try {
      await deleteStation(stationId);
      await loadDataFromServer(); // 重新加载数据
    } catch (error) {
      console.error("删除厂站失败:", error);
    } finally {
      loading.value = false;
    }
  }
}

// --- Watchers for cascading selects ---
watch(() => newStation.province, async (newProvinceName) => {
    newStation.city = null; // 省份改变时重置城市
    await loadCities(newProvinceName);
});

watch(() => editStation.province, async (newProvinceName, oldProvinceName) => {
    // 仅当省份发生真实改变时（即非首次加载）才重置城市
    if (newProvinceName !== oldProvinceName && editDialogVisible.value) {
        editStation.city = null;
        await loadCities(newProvinceName);
    }
});

// 组件挂载时加载初始数据
onMounted(async () => {
  await loadDataFromServer();
  // 预加载省份数据
  await loadProvinces();
});
</script>

<template>
  <div>
    <q-page class="q-pa-md q-gutter-y-md">
      <!-- 顶部搜索框已移除 -->

      <div class="row">
        <q-btn
          color="primary"
          class="col-auto q-mb-md"
          @click="dialogVisible = true"
        >
          添加厂站
        </q-btn>
      </div>

      <!-- 厂站表格 -->
      <q-table
        square
        no-data-label="暂无数据"
        flat
        bordered
        title="厂站列表"
        :rows="sortedRows"
        :columns="columns"
        row-key="index"
        :table-row-class-fn="rowClassFn"
        :rows-per-page-options="[5, 10, 20, 50, 0]"
        v-model:pagination="pagination"
        :loading="loading"
      >
        <template #header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="q-pa-sm"
            >
              <div class="column items-center" style="width: 100%;">
                <div class="row items-center no-wrap justify-center" style="width: 100%;">
                  <span class="text-subtitle2">{{ col.label }}</span>
                  <div class="q-ml-sm">
                    <template v-if="col.searchable && !col.hasOptions">
                      <q-btn dense flat round icon="search" size="sm" @click.stop>
                        <q-popup-edit
                          v-model="searchFilters[col.name]"
                          v-slot="scope"
                          auto-save
                        >
                          <q-input
                            dense
                            autofocus
                            v-model="scope.value"
                            label="搜索"
                            @keyup.enter="() => { searchFilters[col.name] = scope.value; applyFiltersAndReload(); scope.set(); }"
                          />
                        </q-popup-edit>
                      </q-btn>
                    </template>
                    <template v-if="col.searchable && col.hasOptions">
                      <q-btn dense flat round icon="filter_list" size="sm" @click.stop>
                        <q-menu anchor="bottom right" self="top right">
                          <q-list style="min-width: 150px">
                            <q-item>
                              <q-item-section>
                                <q-select
                                  outlined
                                  dense
                                  v-model="searchFilters[col.name]"
                                  :options="col.options"
                                  option-label="label"
                                  option-value="value"
                                  map-options
                                  emit-value
                                  label="筛选"
                                  clearable
                                  @update:model-value="applyFiltersAndReload"
                                />
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </template>
                    <template v-if="col.isDateRange">
                      <q-btn dense flat round icon="event" size="sm" @click.stop>
                        <q-menu anchor="bottom right" self="top right">
                          <q-list style="min-width: 300px" class="q-pa-md">
                            <div class="text-caption q-mb-sm">日期范围</div>
                            <div class="row q-col-gutter-sm">
                              <div class="col-6">
                                <q-input outlined dense v-model="dateRangeUI.from" type="date" label="开始日期" />
                              </div>
                              <div class="col-6">
                                <q-input outlined dense v-model="dateRangeUI.to" type="date" label="结束日期" />
                              </div>
                            </div>
                            <div class="row justify-end q-gutter-sm q-mt-md">
                              <q-btn
                                flat
                                label="清除"
                                size="sm"
                                @click="clearDateFilterAndReload"
                                dense
                                v-close-popup
                              />
                              <q-btn
                                color="primary"
                                label="应用"
                                size="sm"
                                @click="applyFiltersAndReload"
                                dense
                                v-close-popup
                              />
                            </div>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </template>
                    <template v-if="col.sortable">
                      <q-btn dense flat round :icon="getSortIcon(col.name)" size="sm" @click="handleSortClick(col.name)" />
                    </template>
                  </div>
                </div>
                <div v-if="searchFilters[col.name]" class="q-mt-xs self-start">
                  <q-chip
                    dense
                    removable
                    @remove="clearFilter(col.name)"
                    :label="getFilterDisplay(col, searchFilters[col.name])"
                    color="primary"
                    text-color="white"
                    class="q-ma-none"
                  />
                </div>
              </div>
            </q-th>
          </q-tr>
        </template>

        <!-- 表格内容 -->
        <template #body="props">
          <q-tr :props="props">
            <q-td key="station_id" :props="props">{{
              props.row.station_id
            }}</q-td>
            <q-td key="station_name" :props="props">{{
              props.row.station_name
            }}</q-td>
            <q-td key="station_type" :props="props">{{
              props.row.station_type
            }}</q-td>
            <q-td key="province" :props="props">{{
              props.row.province
            }}</q-td>
            <q-td key="city" :props="props">{{ props.row.city }}</q-td>
            <q-td key="voltage_level" :props="props">{{
              props.row.voltage_level
            }}</q-td>
            <q-td key="assets_num" :props="props">{{
              props.row.assets_num
            }}</q-td>
            <q-td key="reports_num" :props="props">{{
              props.row.reports_num
            }}</q-td>
            <q-td key="last_check_time" :props="props">{{
              props.row.last_check_time
            }}</q-td>
            <q-td key="actions" :props="props" class="q-gutter-x-sm">
              <q-btn
                flat
                round
                color="info"
                icon="visibility"
                @click="viewStationDetail(props.row.station_id)"
              >
                <q-tooltip>查看详情</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                @click="openEditDialog(props.row.station_id)"
              >
                <q-tooltip>编辑</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                @click="removeStation(props.row.station_id)"
              >
                <q-tooltip>删除</q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-page>

    <!-- 添加厂站对话框 -->
    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">添加厂站</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit="addNewStation">
            <div class="row q-col-gutter-md">
              <!-- 厂站ID输入框已移除，由后端自动生成 -->
              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  v-model="newStation.stationName"
                  label="厂站名称 *"
                  :rules="[(val) => !!val || '厂站名称不能为空']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  v-model="newStation.stationType"
                  :options="stationTypeOptions"
                  emit-value
                  map-options
                  label="厂站类型 *"
                  :rules="[(val) => !!val || '厂站类型不能为空']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  v-model="newStation.province"
                  :options="provinces"
                  option-value="area_name"
                  option-label="area_name"
                  map-options
                  emit-value
                  label="省份 *"
                  :loading="provincesLoading"
                  :rules="[(val) => !!val || '必须选择一个省份']"
                  clearable
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  v-model="newStation.city"
                  :options="cities"
                  option-value="area_name"
                  option-label="area_name"
                  map-options
                  emit-value
                  label="城市 *"
                  :loading="citiesLoading"
                  :disable="!newStation.province"
                  :rules="[(val) => !!val || '必须选择一个城市']"
                  clearable
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  v-model="newStation.voltagelevel"
                  :options="voltageLevelOptions"
                  emit-value
                  map-options
                  label="电压等级 *"
                  :rules="[(val) => !!val || '电压等级不能为空']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input outlined v-model="newStation.manufactor" label="厂商" />
              </div>
              <div class="col-12">
                <q-toggle v-model="newStation.drawTuoPu" label="生成拓扑图" />
              </div>
            </div>
            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                label="取消"
                color="grey"
                v-close-popup
                class="q-ml-sm"
              />
              <q-btn
                type="submit"
                label="提交"
                color="primary"
                :loading="loading"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 编辑厂站对话框 -->
    <q-dialog v-model="editDialogVisible" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">编辑厂站</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit="updateStationInfo">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  v-model="editStation.stationId"
                  label="厂站ID *"
                  readonly
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  v-model="editStation.stationName"
                  label="厂站名称 *"
                  :rules="[(val) => !!val || '厂站名称不能为空']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  v-model="editStation.stationType"
                  :options="stationTypeOptions"
                  emit-value
                  map-options
                  label="厂站类型 *"
                  :rules="[(val) => !!val || '厂站类型不能为空']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  v-model="editStation.province"
                  :options="provinces"
                  option-value="area_name"
                  option-label="area_name"
                  map-options
                  emit-value
                  label="省份 *"
                  :loading="provincesLoading"
                  :rules="[(val) => !!val || '必须选择一个省份']"
                  clearable
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  v-model="editStation.city"
                  :options="cities"
                  option-value="area_name"
                  option-label="area_name"
                  map-options
                  emit-value
                  label="城市 *"
                  :loading="citiesLoading"
                  :disable="!editStation.province"
                  :rules="[(val) => !!val || '必须选择一个城市']"
                  clearable
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  v-model="editStation.voltagelevel"
                  :options="voltageLevelOptions"
                  emit-value
                  map-options
                  label="电压等级 *"
                  :rules="[(val) => !!val || '电压等级不能为空']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  v-model="editStation.manufactor"
                  label="厂商"
                />
              </div>
              <div class="col-12">
                <q-toggle v-model="editStation.drawTuoPu" label="生成拓扑图" />
              </div>
            </div>
            <div class="row justify-end q-mt-md">
              <q-btn
                flat
                label="取消"
                color="grey"
                v-close-popup
                class="q-ml-sm"
              />
              <q-btn
                type="submit"
                label="保存"
                color="primary"
                :loading="loading"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 厂站详情对话框 -->
    <q-dialog v-model="stationDetailVisible">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">厂站详情</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section v-if="stationDetail">
          <q-list bordered separator>
            <q-item v-for="(value, key) in stationDetail" :key="key">
              <q-item-section>
                <q-item-label caption>{{ key }}</q-item-label>
                <q-item-label>{{ value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="关闭" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
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
.q-table th:nth-child(n+3):nth-child(-n+9) > div > .row { justify-content: center !important; }
</style> 