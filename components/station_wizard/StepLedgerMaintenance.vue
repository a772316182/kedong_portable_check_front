<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import {
  useQueryMonitorObjectsApi,
  useCreateMonitorObjectApi,
  useUpdateMonitorObjectApi,
  useDeleteMonitorObjectApi,
  useGetMonitorObjectApi
} from '~/composables/useApi';
import type { QueryMonitorObjectsParams, QueryMonitorObjectsSearchParams, MonitorObjectData } from '~/types/api';
import CommonEnhancedTable from '~/components/common_enhanced_table.vue';

// 本地定义 MonitorObject 接口，与 types/api.ts 中的 MonitorObjectData 保持一致
// 并且额外添加一个可选的 index 字段用于前端编号
type MonitorObject = MonitorObjectData & { index?: number };

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
const totalRows = ref(0); // 用于服务端分页
const editorVisible = ref(false);
const editingAsset = ref<Partial<MonitorObject>>({});

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

// --- Table Columns Definition for CommonEnhancedTable ---
const columnLabels = computed(() => ({
  index: '编号',
  devname: '设备名称',
  ip: '设备IP1',
  ip2: '设备IP2',
  devtype: '设备类型',
  subsystype: '站内设备类型',
  securityarea: '安全区',
  systype: '操作系统',
  username: '用户名',
  mac: 'MAC地址',
  mac2: 'MAC地址2',
  businesssys: '业务系统',
  devversion: '设备型号',
  bay_level_device: '是否间隔层设备',
  factory: '设备厂商',
  actions: '操作',
}));

// 定义哪些列不可搜索和排序
const nonSearchableColumns = ['index', 'bay_level_device', 'actions'];
const nonSortableColumns = ['index', 'subsystype', 'mac', 'mac2', 'businesssys', 'devversion', 'factory', 'actions'];


const title = computed(() => editingAsset.value.id ? '编辑设备' : '添加新设备');

// --- CRUD Functions ---
async function fetchAssets(requestPayload: any) {
  loading.value = true;
  try {
    const { page, rowsPerPage, sortBy, descending } = requestPayload.pagination;
    
    // 清理 search 对象，移除空值
    const search_params: { [key: string]: any } = { guid: props.stationId };
    for (const key in requestPayload.search) {
      if (Object.prototype.hasOwnProperty.call(requestPayload.search, key)) {
        const value = requestPayload.search[key];
        if (value) {
          search_params[key] = value;
        }
      }
    }

    const params: QueryMonitorObjectsParams = {
      search_params,
      page,
      page_size: rowsPerPage,
      pagination: {
        sortBy,
        descending
      }
    };

    const response = await queryMonitorObjects(params);
    if (response && response.status_code === 0 && response.data) {
      // 添加前端编号
      rows.value = response.data.records.map((record, index) => ({
        ...record,
        index: (page - 1) * rowsPerPage + index + 1,
      }));
      totalRows.value = response.data.total;
    } else {
      throw new Error(response?.message || "加载资产列表失败");
    }
  } catch (error: any) {
    $q.notify({ type: 'negative', message: error.message });
  } finally {
    loading.value = false;
  }
}

// 这个函数现在是通用表格 @request 事件的处理器
function handleRequest(payload: any) {
  fetchAssets(payload);
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
      handleRequest({ pagination: { page: 1, rowsPerPage: 10, sortBy: null, descending: false }, search: {} });

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
        handleRequest({ pagination: { page: 1, rowsPerPage: 10, sortBy: null, descending: false }, search: {} });
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

onMounted(() => {
  // 首次加载数据
  handleRequest({ pagination: { page: 1, rowsPerPage: 10, sortBy: null, descending: false }, search: {} });
});

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
          <common-enhanced-table
              title="资产列表"
              :rows="rows"
              row-key="id"
              :loading="loading"
              server-side
              :rows-number="totalRows"
              :column-labels="columnLabels"
              :non-searchable-columns="nonSearchableColumns"
              :non-sortable-columns="nonSortableColumns"
              @request="handleRequest"
          >
            <template #top-right>
              <q-btn color="primary" icon="add" label="新增资产" @click="openEditor(null)"/>
            </template>
            
            <template #cell-devtype="{ value }">
              {{ deviceTypeOptions.find(o => o.value === value)?.label || '未知' }}
            </template>
            
            <template #cell-securityarea="{ value }">
               {{ securityAreaOptions.find(o => o.value === value)?.label || '未知' }}
            </template>
            
            <template #cell-bay_level_device="{ value }">
              {{ value ? '是' : '否' }}
            </template>

            <template #cell-actions="{ row }">
              <q-btn flat round color="primary" icon="edit" @click="openEditor(row)">
                <q-tooltip>编辑</q-tooltip>
              </q-btn>
              <q-btn flat round color="negative" icon="delete" @click="removeAsset(row)">
                <q-tooltip>删除</q-tooltip>
              </q-btn>
            </template>
            
          </common-enhanced-table>
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