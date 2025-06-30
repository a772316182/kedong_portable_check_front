<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useQueryAssetScanResultsApi } from '~/composables/useApi'
import CommonEnhancedTable from '~/components/common_enhanced_table.vue'

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

const columnLabels = computed(() => ({
  ip: 'IP地址',
  mac: 'MAC地址',
  port: '开放端口',
  services: '服务',
  devtype: '推测设备类型',
}))

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
        <common-enhanced-table
          :rows="resultsState.data?.results || []"
          :column-labels="columnLabels"
          row-key="ip"
          :loading="resultsState.loading"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="关闭" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template> 