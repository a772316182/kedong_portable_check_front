<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useNetConfigApi } from '~/composables/useApi';
import CommonEnhancedTable from '~/components/common_enhanced_table.vue';

// --- 类型定义 ---
interface ScanResultRow {
  securityArea: string;
  associatedNetwork: string;
  subnet: string;
}

// --- 组件通信 ---
const props = defineProps<{
  stationId: string;
}>();
const emit = defineEmits(['next', 'back', 'skip']);

// --- 状态与响应式变量 ---
const $q = useQuasar();
const loading = ref(false);
const rows = ref<ScanResultRow[]>([]);

// 使用组合式API
const { addSubnetsFromScan } = useNetConfigApi();

// --- 表格列定义 ---
const columnLabels = computed(() => ({
  securityArea: '安全区',
  associatedNetwork: '所属网络',
  subnet: '网段',
}));

// --- 方法 ---
async function startScan() {
  loading.value = true;
  rows.value = []; // 清空上次结果
  $q.notify({ type: 'info', message: '正在开始网络探测，请稍候...' });

  try {
    const response = await addSubnetsFromScan({ stationId: props.stationId });

    if (response && response.retNum === 0) {
      // 此处的 response.messageContent 已经是数组了
      const allScannedSubnets: string[] = response.messageContent || [];

      rows.value = allScannedSubnets.map(subnetStr => ({
        securityArea: '',
        associatedNetwork: '',
        subnet: subnetStr,
      }));

      if (allScannedSubnets.length > 0) {
        $q.notify({ type: 'positive', message: `探测完成，共发现 ${allScannedSubnets.length} 个活动网段。` });
      } else {
        $q.notify({ type: 'info', message: '探测完成，未发现任何活动网段。' });
      }
    } else {
      throw new Error(response?.errMessage || '探测失败');
    }
  } catch (error: any) {
    $q.notify({ type: 'negative', message: `发生错误: ${error.message}` });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">网段探测</div>
    <p class="text-body2 text-grey-8">
      点击下方"开始探测"按钮。系统将扫描网络，并将新发现的网段添加至配置列表。下方表格将显示本次扫描发现的所有活动网段。
    </p>

    <div class="q-my-md">
      <q-btn
          label="开始探测"
          color="primary"
          @click="startScan"
          :loading="loading"
          icon="search"
      />
    </div>

    <!-- 探测结果表格 -->
    <common-enhanced-table
        title="探测结果 (本次扫描发现的所有网段)"
        :rows="rows"
        :column-labels="columnLabels"
        row-key="subnet"
        :loading="loading"
    >
    </common-enhanced-table>

    <!-- 页面导航 -->
    <div class="row justify-start q-mt-lg">
      <q-btn @click="$emit('back')" flat color="primary" label="上一步"/>
      <q-btn @click="$emit('skip')" color="secondary" flat label="跳过此步骤" class="q-ml-sm"/>
      <q-btn @click="$emit('next')" color="primary" label="下一步" class="q-ml-sm"/>
    </div>
  </div>
</template> 