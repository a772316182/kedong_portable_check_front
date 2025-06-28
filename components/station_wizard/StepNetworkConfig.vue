<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableProps } from 'quasar';
import { useNetConfigApi, useListNetworkConfigsApi } from '~/composables/useApi';
import type { NetItem } from '~/types/api';
import { rowClassFn } from "~/utils/tableStyle";

const props = defineProps<{
  stationId: string;
}>();

const $q = useQuasar();
const { addNetworkConfig, updateNetworkConfig, deleteNetworkConfig } = useNetConfigApi();
const { listNetworkConfigsState, listNetworkConfigs } = useListNetworkConfigsApi();

const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const allRows = ref<any[]>([]);

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

const searchFilters = reactive({
  secArea: '',
  network_type_id: '',
});

const currentConfig = reactive<Partial<NetItem> & { config_id?: string, secAreaCode?: string, network_type_id?: string, stationId?: string }>({
  config_id: '',
  devIp: '',
  secAreaCode: '',
  network_type_id: '',
  subnetMask: '',
  stationId: props.stationId,
});

const secAreaOptions = [
    { label: 'Ⅰ区', value: '1001' },
    { label: 'Ⅱ区', value: '1002' },
    { label: 'Ⅲ区', value: '1003' },
    { label: 'Ⅳ区', value: '1004' },
    { label: 'Ⅴ区', value: '1005' },
    { label: 'NPS', value: '1006' },
];

const networkTypeOptions = [
    { label: 'A网', value: '1' },
    { label: 'B网', value: '2' },
    // 根据需要可以添加更多
];

const columns: QTableProps['columns'] = [
  { name: 'devIp', label: '设备IP', field: 'devIp', align: 'center', sortable: true },
  { name: 'secAreaValue', label: '安全区', field: 'secAreaValue', align: 'center', sortable: true },
  { name: 'network_type_name', label: '网络类型', field: 'network_type_name', align: 'center', sortable: true },
  { name: 'subnetMask', label: '网段区间', field: 'subnetMask', align: 'left', sortable: true },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' },
];

async function loadData() {
  loading.value = true;
  try {
    await listNetworkConfigs({
      stationId: props.stationId,
      secArea: searchFilters.secArea || undefined,
      network_type_id: searchFilters.network_type_id || undefined,
    });
    if (listNetworkConfigsState.value.data?.messageContent) {
      allRows.value = listNetworkConfigsState.value.data.messageContent.map((row: any, index: number) => ({...row, index: index + 1}));
    } else {
      allRows.value = [];
    }
  } catch (e) {
    console.error("加载网段配置失败:", e);
    $q.notify({ type: 'negative', message: '加载网段配置失败' });
  } finally {
    loading.value = false;
  }
}

function openAddDialog() {
  isEdit.value = false;
  Object.assign(currentConfig, {
    config_id: '',
    devIp: '',
    secAreaCode: '',
    network_type_id: '',
    subnetMask: '',
    stationId: props.stationId,
  });
  dialogVisible.value = true;
}

function openEditDialog(row: any) {
  isEdit.value = true;
  Object.assign(currentConfig, { ...row });
  dialogVisible.value = true;
}

async function handleDelete(row: any) {
  $q.dialog({
    title: '确认删除',
    message: `确定要删除设备IP为 ${row.devIp} 的这条配置吗？`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    loading.value = true;
    try {
      // 删除操作，需要将config_id等信息包装成NetItem[]
      const netToDelete: NetItem = {
        indexId: row.config_id, // 假设config_id就是indexId
        devIp: row.devIp,
        netItemId: row.network_type_id, // 假设
        netItemRe: '', // 假设
        subnetMask: row.subnetMask,
      };
      const response = await deleteNetworkConfig({ stationId: props.stationId, nets: [netToDelete] });
      if (response && response.retNum === 0) {
        $q.notify({ type: 'positive', message: '删除成功' });
        await loadData();
      } else {
        throw new Error(response?.errMessage || '删除失败');
      }
    } catch (e: any) {
      console.error("删除失败:", e);
      $q.notify({ type: 'negative', message: e.message || '删除失败' });
    } finally {
      loading.value = false;
    }
  });
}

// 校验网段区间的格式
function validateSubnetMask(mask: string): boolean | string {
  if (!mask) return '网段区间不能为空';
  const regex = /^((\d{1,3}\.){3}\d{1,3})-(\d{1,3})$/;
  const match = mask.match(regex);
  if (!match) {
    return '格式错误，应为 "IP-范围"，例如 "192.168.79.1-254"';
  }

  const ipParts = match[1].split('.').map(Number);
  const startIpLastOctet = ipParts[3];
  const endRange = Number(match[3]);

  // 检查每个IP段是否在0-255之间
  if (ipParts.some(part => part < 0 || part > 255)) {
    return 'IP地址无效，每个段必须在0-255之间';
  }

  if (endRange <= startIpLastOctet) {
    return '结束范围必须大于起始IP的最后一位';
  }

  if (endRange > 255) {
      return '结束范围不能大于255';
  }

  return true;
}

async function handleSubmit() {
  const validationResult = validateSubnetMask(currentConfig.subnetMask || '');
  if (typeof validationResult === 'string') {
    $q.notify({ type: 'negative', message: validationResult });
    return; // 阻止提交
  }

  loading.value = true;
  try {
    const netToSubmit: NetItem = {
      indexId: currentConfig.config_id || '', // 编辑时有值
      devIp: currentConfig.devIp || '',
      netItemId: currentConfig.network_type_id || '',
      netItemRe: '', // gRPC中似乎不需要，留空
      subnetMask: currentConfig.subnetMask || '',
    };

    const apiCall = isEdit.value
        ? updateNetworkConfig({ stationId: props.stationId, secArea: currentConfig.secAreaCode, nets: [netToSubmit] })
        : addNetworkConfig({ stationId: props.stationId, secArea: currentConfig.secAreaCode, nets: [netToSubmit] });

    const response = await apiCall;

    if (response && response.retNum === 0) {
      $q.notify({ type: 'positive', message: isEdit.value ? '更新成功' : '添加成功' });
      dialogVisible.value = false;
      await loadData();
    } else {
      throw new Error(response?.errMessage || '操作失败');
    }
  } catch (e: any) {
    console.error("提交失败:", e);
    $q.notify({ type: 'negative', message: e.message || '操作失败' });
  } finally {
    loading.value = false;
  }
}

function getFilterDisplay(value: string, options: {label: string, value: string}[]) {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
}

onMounted(loadData);

</script>

<template>
  <div>
    <div class="row q-mb-md">
      <q-btn color="primary" icon="add" label="新增配置" @click="openAddDialog" />
    </div>
    <q-table
      flat
      bordered
      title="网段配置列表"
      :rows="allRows"
      :columns="columns"
      row-key="index"
      :loading="loading"
      :table-row-class="rowClassFn"
      v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 20, 0]"
    >
        <template #header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="q-pa-sm">
               <div class="column items-center" style="width: 100%;">
                <div class="row items-center no-wrap justify-center" style="width: 100%;">
                  <span class="text-subtitle2">{{ col.label }}</span>
                  <div class="q-ml-sm">
                    <template v-if="col.name === 'secAreaValue'">
                       <q-btn dense flat round icon="filter_list" size="sm" @click.stop>
                        <q-menu anchor="bottom right" self="top right">
                          <q-list style="min-width: 150px">
                            <q-item><q-item-section>
                              <q-select outlined dense v-model="searchFilters.secArea" :options="secAreaOptions" emit-value map-options
                                label="筛选安全区" clearable @update:model-value="loadData" />
                            </q-item-section></q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </template>
                     <template v-if="col.name === 'network_type_name'">
                       <q-btn dense flat round icon="filter_list" size="sm" @click.stop>
                        <q-menu anchor="bottom right" self="top right">
                          <q-list style="min-width: 150px">
                            <q-item><q-item-section>
                              <q-select outlined dense v-model="searchFilters.network_type_id" :options="networkTypeOptions" emit-value map-options
                                label="筛选网络类型" clearable @update:model-value="loadData" />
                            </q-item-section></q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </template>
                  </div>
                </div>
                 <div v-if="searchFilters.secArea && col.name === 'secAreaValue'" class="q-mt-xs self-start">
                  <q-chip dense removable @remove="() => { searchFilters.secArea = ''; loadData(); }" :label="getFilterDisplay(searchFilters.secArea, secAreaOptions)" color="primary" text-color="white" />
                </div>
                 <div v-if="searchFilters.network_type_id && col.name === 'network_type_name'" class="q-mt-xs self-start">
                  <q-chip dense removable @remove="() => { searchFilters.network_type_id = ''; loadData(); }" :label="getFilterDisplay(searchFilters.network_type_id, networkTypeOptions)" color="primary" text-color="white" />
                </div>
              </div>
            </q-th>
          </q-tr>
        </template>

        <template #body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
                <q-btn flat round color="primary" icon="edit" @click="openEditDialog(props.row)">
                    <q-tooltip>编辑</q-tooltip>
                </q-btn>
                <q-btn flat round color="negative" icon="delete" @click="handleDelete(props.row)">
                    <q-tooltip>删除</q-tooltip>
                </q-btn>
            </q-td>
        </template>
    </q-table>

    <q-dialog v-model="dialogVisible" persistent>
        <q-card style="min-width: 400px">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">{{ isEdit ? '编辑' : '新增' }}网段配置</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section>
                <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
                    <q-input outlined v-model="currentConfig.devIp" label="设备IP" :rules="[val => !!val || '设备IP不能为空']" />
                    <q-select outlined v-model="currentConfig.secAreaCode" :options="secAreaOptions" emit-value map-options label="安全区" :rules="[val => !!val || '必须选择安全区']" />
                    <q-select outlined v-model="currentConfig.network_type_id" :options="networkTypeOptions" emit-value map-options label="网络类型" :rules="[val => !!val || '必须选择网络类型']" />
                    <q-input
                      outlined
                      v-model="currentConfig.subnetMask"
                      label="网段区间"
                      placeholder="例: 192.168.79.1-254"
                      :rules="[validateSubnetMask]"
                      lazy-rules
                    />
                    <q-card-actions align="right">
                        <q-btn flat label="取消" v-close-popup />
                        <q-btn type="submit" :label="isEdit ? '保存' : '创建'" color="primary" :loading="loading" />
                    </q-card-actions>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
  </div>
</template>