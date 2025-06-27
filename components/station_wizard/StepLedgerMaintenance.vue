<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import {
  useQueryMonitorObjectsApi,
  useCreateMonitorObjectApi,
  useUpdateMonitorObjectApi,
  useDeleteMonitorObjectApi,
  useGetMonitorObjectApi
} from '~/composables/useApi';
import type { MonitorObjectData, QueryMonitorObjectsSearchParams, CreateMonitorObjectParams, UpdateMonitorObjectParams } from '~/types/api';
import { rowClassFn } from '~/utils/tableStyle';

const props = defineProps<{
  stationId: string;
}>();

const $q = useQuasar();
const { queryState, queryMonitorObjects } = useQueryMonitorObjectsApi();
const { createState, createMonitorObject } = useCreateMonitorObjectApi();
const { updateState, updateMonitorObject } = useUpdateMonitorObjectApi();
const { deleteState, deleteMonitorObject } = useDeleteMonitorObjectApi();
const { getState, getMonitorObject } = useGetMonitorObjectApi();

const dialogVisible = ref(false);
const isEdit = ref(false);
const rows = ref<MonitorObjectData[]>([]);

const currentAsset = reactive<Partial<MonitorObjectData>>({});

const searchFilters = reactive<{
  devname?: string;
  ip?: string;
  devtype?: number | null;
  securityarea?: number | null;
}>({
  devname: '',
  ip: '',
  devtype: null,
  securityarea: null,
});

const pagination = ref({
  sortBy: 'devname',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const devTypeOptions = [
  { label: '防火墙', value: 1 }, { label: '交换机', value: 2 }, { label: '路由器', value: 3 }, { label: '主机', value: 4 }
];
const securityAreaOptions = [
  { label: 'Ⅰ区', value: 1001 }, { label: 'Ⅱ区', value: 1002 }, { label: 'Ⅲ区', value: 1003 },
];

const columns: QTableProps['columns'] = [
  { name: 'devname', label: '设备名称', field: 'devname', align: 'left', sortable: true },
  { name: 'ip', label: 'IP地址', field: 'ip', align: 'left', sortable: true },
  { name: 'devtype', label: '设备类型', field: 'devtype', format: val => devTypeOptions.find(o => o.value === val)?.label || val, align: 'center', sortable: true },
  { name: 'securityarea', label: '安全区', field: 'securityarea', format: val => securityAreaOptions.find(o => o.value === val)?.label || val, align: 'center', sortable: true },
  { name: 'factory', label: '厂商', field: 'factory', align: 'center', sortable: true },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' },
];

async function onRequest(requestProps: { pagination?: QTableProps['pagination'] }) {
  const { page, rowsPerPage, sortBy, descending } = requestProps.pagination || pagination.value;

  const apiSearchParams: QueryMonitorObjectsSearchParams = {
    guid: props.stationId
  };
  if (searchFilters.devname) apiSearchParams.devname = searchFilters.devname;
  if (searchFilters.ip) apiSearchParams.ip = searchFilters.ip;
  if (searchFilters.devtype) apiSearchParams.devtype = searchFilters.devtype;
  if (searchFilters.securityarea) apiSearchParams.securityarea = searchFilters.securityarea;
  
  await queryMonitorObjects({
    search_params: apiSearchParams,
    page: page || 1,
    page_size: rowsPerPage || 10,
  });

  pagination.value.page = page || 1;
  pagination.value.rowsPerPage = rowsPerPage || 10;
  pagination.value.sortBy = sortBy || 'devname';
  pagination.value.descending = descending || false;
}

watch(queryState, (newState) => {
    if (newState.data?.data) {
        rows.value = newState.data.data.records;
        pagination.value.rowsNumber = newState.data.data.total;
    }
    if(newState.error) {
        $q.notify({ type: 'negative', message: '加载资产列表失败' });
    }
}, { deep: true });

function openAddDialog() {
  isEdit.value = false;
  Object.keys(currentAsset).forEach(key => delete (currentAsset as any)[key]);
  currentAsset.guid = props.stationId;
  dialogVisible.value = true;
}

async function openEditDialog(asset: MonitorObjectData) {
  isEdit.value = true;
  Object.keys(currentAsset).forEach(key => delete (currentAsset as any)[key]);
  await getMonitorObject({ id: asset.id });
}

watch(getState, (newState) => {
    if (isEdit.value && newState.data) {
        if(newState.data.status_code === 200) {
            Object.assign(currentAsset, newState.data.data);
            dialogVisible.value = true;
        } else {
            $q.notify({ type: 'negative', message: `获取资产详情失败: ${newState.data.message}` });
        }
    }
}, { deep: true });


async function handleDelete(asset: MonitorObjectData) {
  $q.dialog({
    title: '确认删除',
    message: `确定要删除资产 "${asset.devname}" 吗？`,
    cancel: true,
  }).onOk(async () => {
    await deleteMonitorObject({ id: asset.id });
  });
}

watch(deleteState, (newState) => {
    if(newState.data) {
        if (newState.data.status_code === 200) {
            $q.notify({ type: 'positive', message: '删除成功' });
            onRequest({ pagination: pagination.value });
        } else {
            $q.notify({ type: 'negative', message: `删除失败: ${newState.data.message}` });
        }
    }
}, { deep: true });

async function handleSubmit() {
  if (isEdit.value) {
    await updateMonitorObject({ id: currentAsset.id!, updates: currentAsset });
  } else {
    await createMonitorObject(currentAsset as CreateMonitorObjectParams);
  }
}

watch([createState, updateState], ([newCreateState, newUpdateState]) => {
    const state = isEdit.value ? newUpdateState : newCreateState;
    if (state.data) {
        if (state.data.status_code === 200) {
            $q.notify({ type: 'positive', message: isEdit.value ? '更新成功' : '创建成功' });
            dialogVisible.value = false;
            onRequest({ pagination: pagination.value });
        } else {
            $q.notify({ type: 'negative', message: `操作失败: ${state.data.message}` });
        }
    }
}, { deep: true });


onMounted(() => {
  onRequest({ pagination: pagination.value });
});
</script>

<template>
  <div>
    <q-table
      flat
      bordered
      title="台账列表"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="queryState.loading || createState.loading || updateState.loading || deleteState.loading"
      v-model:pagination="pagination"
      @request="onRequest"
      :table-row-class="rowClassFn"
    >
      <template #top>
        <q-btn color="primary" icon="add" label="新增资产" @click="openAddDialog" />
        <q-space />
        <q-input dense debounce="300" v-model="searchFilters.devname" placeholder="设备名称" @update:model-value="onRequest({ pagination })" clearable />
        <q-input dense debounce="300" v-model="searchFilters.ip" placeholder="IP地址" class="q-ml-sm" @update:model-value="onRequest({ pagination })" clearable />
        <q-select dense v-model="searchFilters.devtype" :options="devTypeOptions" label="设备类型" class="q-ml-sm" style="min-width: 120px;" emit-value map-options clearable @update:model-value="onRequest({ pagination })" />
        <q-select dense v-model="searchFilters.securityarea" :options="securityAreaOptions" label="安全区" class="q-ml-sm" style="min-width: 120px;" emit-value map-options clearable @update:model-value="onRequest({ pagination })" />
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn flat round color="primary" icon="edit" @click="openEditDialog(props.row)" />
          <q-btn flat round color="negative" icon="delete" @click="handleDelete(props.row)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? '编辑' : '新增' }}资产</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
            <q-input outlined v-model="currentAsset.devname" label="设备名称" :rules="[val => !!val || '必填']" />
            <q-input outlined v-model="currentAsset.ip" label="IP地址" :rules="[val => !!val || '必填']" />
            <q-select outlined v-model="currentAsset.devtype" :options="devTypeOptions" emit-value map-options label="设备类型" />
            <q-select outlined v-model="currentAsset.securityarea" :options="securityAreaOptions" emit-value map-options label="安全区" />
            <q-input outlined v-model="currentAsset.factory" label="厂商" />
            <q-input outlined v-model="currentAsset.systype" label="系统类型" />
            <q-input outlined v-model="currentAsset.devversion" label="设备/系统版本" />
            <q-input outlined v-model="currentAsset.remark" label="备注" type="textarea" />
             <q-card-actions align="right">
                <q-btn flat label="取消" v-close-popup />
                <q-btn type="submit" :label="isEdit ? '保存' : '创建'" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template> 