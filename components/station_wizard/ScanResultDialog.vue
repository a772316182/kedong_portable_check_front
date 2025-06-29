<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import { useQueryAssetScanResultsApi } from '~/composables/useApi'
import type { AssetScanResult } from '~/types/api'

const props = defineProps<{
  modelValue: boolean
  stationId: string
  networkConfigId: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const $q = useQuasar()
const { resultsState, queryAssetScanResults } = useQueryAssetScanResultsApi()

const columns: QTableProps['columns'] = [
  { name: 'ip', label: 'IP地址', field: 'ip', align: 'left', sortable: true },
  { name: 'mac', label: 'MAC地址', field: 'mac', align: 'left' },
  { name: 'port', label: '开放端口', field: 'port', align: 'left' },
  { name: 'services', label: '服务', field: 'services', align: 'left' },
  { name: 'devtype', label: '推测设备类型', field: 'devtype', align: 'left' },
]

async function fetchResults() {
  if (!props.networkConfigId) return
  
  try {
    await queryAssetScanResults({ network_config_id: props.networkConfigId })
  } catch (error) {
    console.error('Failed to fetch scan results:', error)
    $q.notify({ type: 'negative', message: '获取扫描结果失败' })
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    fetchResults()
  }
})
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">资产扫描结果</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="resultsState.data?.results || []"
          :columns="columns"
          row-key="ip"
          :loading="resultsState.loading"
          flat
          bordered
          no-data-label="该网段下未发现任何资产。"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="关闭" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template> 