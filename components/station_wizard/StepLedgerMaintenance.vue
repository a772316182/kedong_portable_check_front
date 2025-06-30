<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import {
  useQueryMonitorObjectsApi,
  useCreateMonitorObjectApi,
  useUpdateMonitorObjectApi,
  useDeleteMonitorObjectApi,
  useGetMonitorObjectApi
} from '~/composables/useApi';
import type { QueryMonitorObjectsParams } from '~/types/api';
import { rowClassFn } from '~/utils/tableStyle';

// 本地定义 MonitorObject 接口，与 basic_info.vue 中的定义保持一致
interface MonitorObject {
  id?: string;
  guid: string;
  devname: string;
  ip: string;
  mac: string;
  devtype: number | null;
  bay_level_device: boolean;
  subsystype: string;
  securityarea: number | null;
  ip2?: string;
  mac2?: string;
  factory?: string;
  systype?: string;
  devversion?: string;
  businesssys?: string;
  hostname?: string;
  username?: string;
  passwd?: string;
  draw_topology?: boolean;
  remark?: string;
  asset_flag?: string;
  snmp_read_pwd?: string;
  snmp_write_pwd?: string;
  index?: number;
}

// 自定义列类型以支持搜索等属性
interface CustomColumn {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  format?: (val: any, row: any) => any;
  style?: string;
  // custom props
  searchable?: boolean;
  hasOptions?: boolean;
  options?: { label: string; value: any }[];
}

const props = defineProps<{
  stationId: string;
}>();

const $q = useQuasar();

// --- API and State Management ---
const { queryMonitorObjects } = useQueryMonitorObjectsApi();
const { createMonitorObject } = useCreateMonitorObjectApi();
const { updateMonitorObject } = useUpdateMonitorObjectApi();
const { deleteMonitorObject } = useDeleteMonitorObjectApi();
const { getMonitorObject } = useGetMonitorObjectApi();

const loading = ref(false);
const editorLoading = ref(false);
const rows = ref<MonitorObject[]>([]);
const editorVisible = ref(false);
const editingAsset = ref<Partial<MonitorObject>>({});

const searchFilters = reactive<{ [key: string]: any }>({
  devname: '',
  ip: '',
  devtype: null,
  securityarea: null,
  // Add other filterable fields here if needed
});

const pagination = ref({
  sortBy: 'devname',
  descending: false,
  page: 1,
  rowsPerPage: 10, // Can be changed by user
  rowsNumber: 0
});

// --- Options for Selects ---
const deviceTypeOptions = [
  { label: '网络设备', value: 1 },
  { label: '安全设备', value: 2 },
  { label: '主机设备', value: 3 },
  { label: '路由器', value: 13 },
  { label: '其它设备', value: 4 },
];
const subSystemTypeOptions = [
  { label: '交换机', value: '交换机' },
  { label: '防火墙', value: '防火墙' },
  { label: '服务器', value: '服务器' },
];
const securityAreaOptions = [
  { label: 'I区', value: 1001 },
  { label: 'II区', value: 1002 },
  { label: 'III区', value: 1003 },
];
const osTypeOptions = [
  { label: 'Windows', value: 'Windows' },
  { label: 'Linux', value: 'Linux' },
  { label: 'Other', value: 'Other' },
];

// --- Table Columns ---
const columns: CustomColumn[] = [
  { name: 'index', label: '编号', field: 'index', align: 'center', style: 'width: 60px' },
  { name: 'devname', label: '设备名称', field: 'devname', align: 'left', sortable: true, searchable: true },
  { name: 'ip', label: '设备IP1', field: 'ip', align: 'left', sortable: true, searchable: true },
  { name: 'ip2', label: '设备IP2', field: 'ip2', align: 'left', sortable: true, searchable: true },
  { name: 'devtype', label: '设备类型', field: 'devtype', format: (val: number) => deviceTypeOptions.find(o => o.value === val)?.label || '未知', align: 'center', sortable: true, searchable: true, hasOptions: true, options: deviceTypeOptions },
  { name: 'subsystype', label: '站内设备类型', field: 'subsystype', align: 'center', sortable: true },
  { name: 'securityarea', label: '安全区', field: 'securityarea', format: (val: number) => securityAreaOptions.find(o => o.value === val)?.label || '未知', align: 'center', sortable: true, searchable: true, hasOptions: true, options: securityAreaOptions },
  { name: 'systype', label: '操作系统', field: 'systype', align: 'center', sortable: true },
  { name: 'username', label: '用户名', field: 'username', align: 'center', sortable: true },
  { name: 'mac', label: 'MAC地址', field: 'mac', align: 'center', sortable: true },
  { name: 'mac2', label: 'MAC地址2', field: 'mac2', align: 'center', sortable: true },
  { name: 'businesssys', label: '业务系统', field: 'businesssys', align: 'center', sortable: true },
  { name: 'devversion', label: '设备型号', field: 'devversion', align: 'center', sortable: true },
  { name: 'bay_level_device', label: '是否间隔层设备', field: 'bay_level_device', format: (val: boolean) => (val ? '是' : '否'), align: 'center', sortable: true },
  { name: 'factory', label: '设备厂商', field: 'factory', align: 'center', sortable: true },
  { name: 'actions', label: '操作', field: 'actions', align: 'center', style: 'width: 100px' },
];

const title = computed(() => editingAsset.value.id ? '编辑设备' : '添加新设备');

// --- CRUD Functions ---
async function fetchAssets() {
  loading.value = true;
  try {
    const search_params: { [key: string]: any } = {
      guid: props.stationId,
    };
    // Build search_params dynamically
    Object.keys(searchFilters).forEach(key => {
      if (searchFilters[key]) {
        search_params[key] = searchFilters[key];
      }
    });

    const params: QueryMonitorObjectsParams = {
      search_params,
      page: pagination.value.page,
      page_size: pagination.value.rowsPerPage,
    };

    const response = await queryMonitorObjects(params);
    if (response && response.status_code === 0 && response.data) {
      rows.value = response.data.records.map((record, index) => ({
        ...record,
        index: (pagination.value.page - 1) * pagination.value.rowsPerPage + index + 1,
      })) as MonitorObject[];
      pagination.value.rowsNumber = response.data.total;
    } else {
      throw new Error(response?.message || "加载资产列表失败");
    }
  } catch (error: any) {
    $q.notify({ type: 'negative', message: error.message });
  } finally {
    loading.value = false;
  }
}

function handleRequest(requestProps: { pagination: QTableProps['pagination'] }) {
  const { page, rowsPerPage, sortBy, descending } = requestProps.pagination || pagination.value;
  pagination.value.page = page || 1;
  pagination.value.rowsPerPage = rowsPerPage || 10;
  pagination.value.sortBy = sortBy || 'devname';
  pagination.value.descending = descending || false;
  fetchAssets();
}

function clearFilter(colName: string) {
  if (colName in searchFilters) {
    searchFilters[colName] = colName === 'devtype' || colName === 'securityarea' ? null : '';
    fetchAssets();
  }
}

function getFilterDisplay(col: CustomColumn, value: any): string {
  if (col.hasOptions && col.options) {
    const option = col.options.find(opt => opt.value === value);
    return option ? option.label : String(value);
  }
  return String(value);
}

function initNewAsset(): Partial<MonitorObject> {
  return {
    guid: props.stationId,
    devname: '',
    ip: '',
    mac: '',
    devtype: null,
    bay_level_device: false,
    subsystype: '',
    securityarea: null,
    mac2: '000000000000',
    draw_topology: false,
    // Initialize other fields to avoid undefined errors
    ip2: '', factory: '', systype: '', devversion: '', businesssys: '',
    hostname: '', username: '', passwd: '', remark: '', asset_flag: '',
    snmp_read_pwd: '', snmp_write_pwd: '',
  };
}

async function openEditor(asset: MonitorObject | null) {
  editorLoading.value = true;
  if (asset?.id) {
    try {
      const response = await getMonitorObject({ id: asset.id });
      if (response && response.status_code === 0 && response.data) {
        editingAsset.value = { ...response.data };
        editorVisible.value = true;
      } else {
        throw new Error(response?.message || '获取资产详情失败');
      }
    } catch (error: any) {
      $q.notify({ type: 'negative', message: error.message });
    }
  } else {
    editingAsset.value = initNewAsset();
    editorVisible.value = true;
  }
  editorLoading.value = false;
}

async function saveAsset() {
  editorLoading.value = true;
  try {
    let response;
    const assetData = editingAsset.value;
    if (assetData.id) { // Update
      response = await updateMonitorObject(assetData as any);
    } else { // Create
      response = await createMonitorObject(assetData as any);
    }

    if (response && response.status_code === 0) {
      $q.notify({ type: 'positive', message: '保存成功！' });
      editorVisible.value = false;
      fetchAssets(); // Refresh list
    } else {
      throw new Error(response?.message || '保存失败');
    }
  } catch (error: any) {
    $q.notify({ type: 'negative', message: error.message });
  } finally {
    editorLoading.value = false;
  }
}

function removeAsset(asset: MonitorObject) {
  $q.dialog({
    title: '确认删除',
    message: `确定要删除资产 "${asset.devname}" 吗？`,
    cancel: true,
  }).onOk(async () => {
    loading.value = true;
    try {
      const response = await deleteMonitorObject({ id: asset.id! });
      if (response && response.status_code === 0) {
        $q.notify({ type: 'positive', message: '删除成功！' });
        fetchAssets(); // Refresh list
      } else {
        throw new Error(response?.message || '删除失败');
      }
    } catch (error: any) {
      $q.notify({ type: 'negative', message: error.message });
    } finally {
      loading.value = false;
    }
  });
}

onMounted(fetchAssets);

</script>

<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col">
        <div class="text-h6 q-mb-md">台账维护</div>
        <p class="text-body2 text-grey-8">
          在此处管理与该厂站关联的所有设备资产。请确保所有关键设备都已录入并信息准确。
        </p>

        <div class="q-mt-lg" style="width: 1100px; min-width: 1100px; max-width: 1100px;">
          <q-table
              square
              no-data-label="暂无数据"
              flat
              bordered
              title="资产列表"
              :rows="rows"
              :columns="columns"
              row-key="id"
              :loading="loading"
              v-model:pagination="pagination"
              @request="handleRequest"
              :table-row-class-fn="rowClassFn"
              binary-state-sort
              :rows-per-page-options="[5, 10, 20, 50, 0]"
          >
            <template #top-left>
              <q-btn color="primary" icon="add" label="新增资产" @click="openEditor(null)" />
            </template>
            <template #top-right>
              <div class="text-caption text-grey">点击表头可进行筛选和排序</div>
            </template>

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
                                  @keyup.enter="() => { searchFilters[col.name] = scope.value; fetchAssets(); scope.set(); }"
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
                                        @update:model-value="fetchAssets"
                                    />
                                  </q-item-section>
                                </q-item>
                              </q-list>
                            </q-menu>
                          </q-btn>
                        </template>
                        <template v-if="col.sortable">
                          <q-btn dense flat round icon="unfold_more" size="sm" />
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

            <template #body="props">
              <q-tr :props="props">
                <q-td key="index" :props="props">{{ props.row.index }}</q-td>
                <q-td key="devname" :props="props">{{ props.row.devname }}</q-td>
                <q-td key="ip" :props="props">{{ props.row.ip }}</q-td>
                <q-td key="ip2" :props="props">{{ props.row.ip2 }}</q-td>
                <q-td key="devtype" :props="props">
                  {{ deviceTypeOptions.find(o => o.value === props.row.devtype)?.label || '未知' }}
                </q-td>
                <q-td key="subsystype" :props="props">{{ props.row.subsystype }}</q-td>
                <q-td key="securityarea" :props="props">
                  {{ securityAreaOptions.find(o => o.value === props.row.securityarea)?.label || '未知' }}
                </q-td>
                <q-td key="systype" :props="props">{{ props.row.systype }}</q-td>
                <q-td key="username" :props="props">{{ props.row.username }}</q-td>
                <q-td key="mac" :props="props">{{ props.row.mac }}</q-td>
                <q-td key="mac2" :props="props">{{ props.row.mac2 }}</q-td>
                <q-td key="businesssys" :props="props">{{ props.row.businesssys }}</q-td>
                <q-td key="devversion" :props="props">{{ props.row.devversion }}</q-td>
                <q-td key="bay_level_device" :props="props">{{ props.row.bay_level_device ? '是' : '否' }}</q-td>
                <q-td key="factory" :props="props">{{ props.row.factory }}</q-td>
                <q-td key="actions" :props="props" class="q-gutter-x-sm">
                  <q-btn flat round color="primary" icon="edit" @click="openEditor(props.row)">
                    <q-tooltip>编辑</q-tooltip>
                  </q-btn>
                  <q-btn flat round color="negative" icon="delete" @click="removeAsset(props.row)">
                    <q-tooltip>删除</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <q-dialog v-model="editorVisible" persistent>
      <q-card style="min-width: 80vw; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveAsset">
            <q-inner-loading :showing="editorLoading">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>

            <div class="row q-col-gutter-md">
              <!-- Row 1 -->
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.devname" label="设备名称 *" :rules="[val => !!val || '设备名称不能为空']" />
              </div>
              <div class="col-12 col-md-4">
                <q-select outlined dense v-model="editingAsset.securityarea" :options="securityAreaOptions" emit-value map-options label="安全区 *" :rules="[val => val !== null || '请选择安全区']" />
              </div>
              <div class="col-12 col-md-4 flex items-center">
                <q-toggle v-model="editingAsset.bay_level_device" label="是否为间隔层设备" />
              </div>

              <!-- Row 2 -->
              <div class="col-12 col-md-4">
                <q-select outlined dense v-model="editingAsset.devtype" :options="deviceTypeOptions" emit-value map-options label="设备类型 *" :rules="[val => val !== null || '请选择设备类型']" />
              </div>
              <div class="col-12 col-md-4">
                <q-select outlined dense v-model="editingAsset.subsystype" :options="subSystemTypeOptions" emit-value map-options use-input label="站内设备类型 *" :rules="[val => !!val || '站内设备类型不能为空']" @new-value="(val, done) => done(val, 'add-unique')" />
              </div>
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.factory" label="设备厂商" />
              </div>

              <!-- Row 3 -->
              <div class="col-12 col-md-4">
                <q-select outlined dense v-model="editingAsset.systype" :options="osTypeOptions" emit-value map-options label="操作系统" />
              </div>
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.devversion" label="设备型号" />
              </div>
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.businesssys" label="业务系统" />
              </div>

              <!-- Row 4 -->
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.ip" label="设备IP1 *" :rules="[val => !!val || '设备IP1不能为空']" />
              </div>
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.mac" label="MAC地址1 *" :rules="[val => !!val || 'MAC地址1不能为空']" />
              </div>
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.hostname" label="主机名" />
              </div>

              <!-- Row 5 -->
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.ip2" label="设备IP2" />
              </div>
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.mac2" label="MAC地址2 *" :rules="[val => !!val || 'MAC地址2不能为空']" />
              </div>
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.asset_flag" label="资产标识" />
              </div>

              <!-- Row 6 -->
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.username" label="用户名" :rules="[val => !(editingAsset.devtype === 1 && editingAsset.draw_topology && !val) || '网络设备绘制拓扑时用户名必填']" />
              </div>
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.passwd" label="用户密码" type="password" :rules="[val => !(editingAsset.devtype === 1 && editingAsset.draw_topology && !val) || '网络设备绘制拓扑时密码必填']"/>
              </div>
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.remark" label="备注" />
              </div>

              <!-- Row 7 -->
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.snmp_read_pwd" label="SNMP读密码" type="password" />
              </div>
              <div class="col-12 col-md-4">
                <q-input outlined dense v-model="editingAsset.snmp_write_pwd" label="SNMP写密码" type="password" />
              </div>
              <div class="col-12 col-md-4 flex items-center">
                <q-toggle v-model="editingAsset.draw_topology" label="是否绘制拓扑" />
              </div>
            </div>

            <div class="row justify-end q-mt-lg">
              <q-btn flat label="取消" color="grey" v-close-popup class="q-ml-sm" />
              <q-btn type="submit" :label="title" color="primary" :loading="editorLoading" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
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