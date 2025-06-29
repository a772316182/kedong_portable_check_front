<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useListNetworkConfigsApi, useStartAssetScanApi } from '~/composables/useApi'
import type { NetItem } from '~/types/api'
import type { QTableProps } from 'quasar'
import { useQuasar } from 'quasar'
import ScanResultDialog from './ScanResultDialog.vue'

const props = defineProps<{
  stationId: string
}>()

const emit = defineEmits<{
  (e: 'next'): void,
  (e: 'back'): void,
  (e: 'skip'): void
}>()

const $q = useQuasar()

interface NetworkItemWithStatus {
  config_id: string
  devIp: string
  secAreaValue: string
  network_type_name: string
  subnetMask: string
  scanStatus: 'idle' | 'scanning' | 'completed' | 'failed'
  scanError?: string
}

const columns: QTableProps['columns'] = [
  { name: 'devIp', label: '关联设备IP', field: 'devIp', align: 'left' },
  { name: 'secAreaValue', label: '安全区', field: 'secAreaValue', align: 'left' },
  { name: 'network_type_name', label: '所属网络', field: 'network_type_name', align: 'left' },
  { name: 'subnetMask', label: '网段', field: 'subnetMask', align: 'left', style: 'width: 200px' },
  { name: 'scanStatus', label: '探测状态', field: 'scanStatus', align: 'center' },
  { name: 'actions', label: '查看结果', field: 'actions', align: 'center' }
]

const networkConfigs = ref<NetworkItemWithStatus[]>([])
const selected = ref<NetworkItemWithStatus[]>([])
const resultDialogVisible = ref(false)
const viewingConfigId = ref<string | null>(null)

const { listNetworkConfigsState, listNetworkConfigs } = useListNetworkConfigsApi()
const { startAssetScan } = useStartAssetScanApi()

async function fetchNetworkConfigs() {
  if (props.stationId) {
    const response = await listNetworkConfigs({ stationId: props.stationId })
    if (response && response.retNum === 0 && Array.isArray(response.messageContent)) {
      networkConfigs.value = response.messageContent.map((item: any) => ({
        ...item,
        scanStatus: 'idle'
      }))
    }
  }
}

async function handleStartScan() {
  if (selected.value.length === 0) {
    $q.notify({ type: 'warning', message: '请先选择一个要探测的网段' })
    return
  }

  const rowToScan = selected.value[0]
  const itemInRef = networkConfigs.value.find(item => item.config_id === rowToScan.config_id)
  if (!itemInRef) return

  itemInRef.scanStatus = 'scanning'
  itemInRef.scanError = undefined

  try {
    const response = await startAssetScan({
      station_id: props.stationId,
      network_config_id: rowToScan.config_id
    })

    if (response.retNum === 0) {
      itemInRef.scanStatus = 'completed'
      $q.notify({ type: 'positive', message: `网段 ${itemInRef.subnetMask} 探测完成` })
    } else {
      itemInRef.scanStatus = 'failed'
      itemInRef.scanError = response.errMessage
      $q.notify({ type: 'negative', message: `探测失败: ${response.errMessage}` })
    }
  } catch (error: any) {
    itemInRef.scanStatus = 'failed'
    itemInRef.scanError = error.message || '未知错误'
    console.error(`Failed to scan network ${itemInRef.subnetMask}:`, error)
  }
}

function handleViewResults(row: NetworkItemWithStatus) {
  viewingConfigId.value = row.config_id
  resultDialogVisible.value = true
  $q.notify({ type: 'info', message: `正在查看 ${row.subnetMask} 的扫描结果... (对话框功能待实现)` })
}

onMounted(fetchNetworkConfigs)

watch(() => props.stationId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchNetworkConfigs()
    selected.value = []
  }
}, { immediate: true })

const getStatusColor = (status: NetworkItemWithStatus['scanStatus']) => {
  switch (status) {
    case 'scanning': return 'blue'
    case 'completed': return 'green'
    case 'failed': return 'red'
    default: return 'grey'
  }
}

const getStatusText = (status: NetworkItemWithStatus['scanStatus']) => {
  switch (status) {
    case 'idle': return '未开始'
    case 'scanning': return '探测中...'
    case 'completed': return '探测完成'
    case 'failed': return '探测失败'
    default: return '未知'
  }
}
</script>

<template>
  <div class="column full-height">
    <div class="col">
      <div class="text-h6 q-mb-md">第四步：资产探测</div>
      <p class="text-grey-8">
        请在下方列表中选择一个网段，然后点击"开始探测"按钮。系统将扫描该网段内的存活主机、开放端口等信息。
      </p>
      
      <q-table
        :rows="networkConfigs"
        :columns="columns"
        row-key="config_id"
        selection="single"
        v-model:selected="selected"
        flat
        bordered
        :loading="listNetworkConfigsState.loading"
      >
        <template v-slot:top-left>
           <q-btn
              color="primary"
              label="开始探测"
              @click="handleStartScan"
              :disable="selected.length === 0"
              :loading="selected.length > 0 && selected[0].scanStatus === 'scanning'"
            />
        </template>

        <template #body-cell-scanStatus="props">
          <q-td :props="props" class="text-center">
            <q-badge :color="getStatusColor(props.row.scanStatus)" :label="getStatusText(props.row.scanStatus)" />
            <q-tooltip v-if="props.row.scanStatus === 'failed'">
              {{ props.row.scanError }}
            </q-tooltip>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-center">
            <q-btn
              flat
              round
              color="primary"
              icon="visibility"
              @click="handleViewResults(props.row)"
              :disable="props.row.scanStatus !== 'completed'"
            >
              <q-tooltip>查看结果</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width row flex-center text-grey q-gutter-sm">
            <span>
              {{ listNetworkConfigsState.error ? '加载失败' : '没有需要探测的网段，请先完成第三步。' }}
            </span>
          </div>
        </template>
      </q-table>
    </div>
    
    <!-- 页面导航 -->
    <div class="row q-mt-md justify-start">
      <q-btn @click="$emit('back')" flat color="primary" label="上一步" />
      <q-btn @click="$emit('skip')" color="secondary" flat label="跳过此步骤" class="q-ml-sm" />
      <q-btn @click="$emit('next')" color="primary" label="下一步" class="q-ml-sm" />
    </div>

    <ScanResultDialog 
      v-model="resultDialogVisible" 
      :station-id="stationId"
      :network-config-id="viewingConfigId" 
    />
  </div>
</template>

<style scoped>
.full-height {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style> 