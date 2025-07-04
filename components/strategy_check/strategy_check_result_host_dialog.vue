<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: boolean,
  currentDevice: any
}>()

const emit = defineEmits(['update:modelValue'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const currentDeviceName = computed(() => props.currentDevice?.name || '未知设备')

const expandedRows = ref<number[]>([]) // 当前展开的行id数组

function toggleExpand(id: number) {
  const index = expandedRows.value.indexOf(id)
  if (index === -1) expandedRows.value.push(id)
  else expandedRows.value.splice(index, 1)
}

const checkData = ref([
  { id: 1, item: '网络连接自名单配置是否合规', result: '不合格', description: '含有规定范围外的自名单配置；自名单中存在高危端口；缺少规定范围内的自名单配置' },
  { id: 2, item: '端口访问自名单配置是否合规', result: '不合格', description: '含有规定范围外的网络端口配置；存在高危端口；缺少规定范围内的端口配置' },
  { id: 3, item: '关键文件/目录配置是否合规', result: '不合格', description: '含有规定范围外的关键文件配置；缺少规定范围内的关键文件配置' },
  { id: 4, item: '未知操作操作命令配置是否合规', result: '合格', description: '合格' }
])

const labels = {
  id: '编号',
  item: '核查项',
  result: '核查结果',
  description: '结果说明'
}

// 各项子表格数据
const detailDataMap = {
  1: [
    { id: 1, protocol: 'TCP', address: '192.168.1.1', port: '80', result: '否', note: '高危端口' }
  ],
  2: [
    { id: 1, protocol: 'UDP', port: '161', result: '否', note: '不在规范内' }
  ],
  3: [
    { id: 1, path: '/etc/passwd', result: '否', note: '未配置访问控制' }
  ],
  4: [
    { id: 1, command: 'rm -rf /', result: '否', note: '不在规定范围内的' },
    { id: 2, command: 'shutdown -h now', result: '否', note: '不在规定范围内的' }
  ]
}
</script>

<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 1200px; max-width: 90vw; height: 750px; overflow-y: auto;">
      <q-card-section class="q-py-sm row items-center" style="background-color: #3BB5A3; position: relative;">
        <q-icon name="description" size="30px" class="q-mr-sm text-white" />
        <div class="text-h6 text-white" style="flex: 1; text-align: center;">核查结果 - {{ currentDeviceName }}</div>
        <q-btn icon="close" flat round dense @click="showDialog = false" style="position: absolute; top: 4px; right: 4px; color: white;" />
      </q-card-section>

      <q-table
        :rows="checkData"
        :columns="[
          { name: 'expand', label: '', field: 'expand', sortable: false },
          { name: 'id', label: labels.id, field: 'id' },
          { name: 'item', label: labels.item, field: 'item' },
          { name: 'result', label: labels.result, field: 'result' },
          { name: 'description', label: labels.description, field: 'description' }
        ]"
        row-key="id"
        hide-pagination
        flat
        separator="horizontal"
      >
        <template #body-cell-expand="{ row }">
          <q-td>
            <q-btn
              flat dense round icon="keyboard_arrow_down"
              :class="{ 'rotate-180': expandedRows.includes(row.id) }"
              @click="toggleExpand(row.id)"
            />
          </q-td>
        </template>

        <template #body="props">
          <tr>
            <td>
              <q-btn
                flat dense round icon="keyboard_arrow_down"
                :class="{ 'rotate-180': expandedRows.includes(props.row.id) }"
                @click="toggleExpand(props.row.id)"
              />
            </td>
            <td>{{ props.row.id }}</td>
            <td>{{ props.row.item }}</td>
            <td>{{ props.row.result }}</td>
            <td>{{ props.row.description }}</td>
          </tr>

          <!-- 展开附加行 -->
          <tr v-if="expandedRows.includes(props.row.id)">
            <td colspan="5">
              <q-markup-table dense flat bordered>
                <thead>
                  <tr v-if="props.row.id === 1">
                    <th>序号</th><th>协议</th><th>地址</th><th>端口</th><th>是否合规</th><th>不合规说明</th>
                  </tr>
                  <tr v-else-if="props.row.id === 2">
                    <th>序号</th><th>协议</th><th>端口</th><th>是否合规</th><th>不合规说明</th>
                  </tr>
                  <tr v-else-if="props.row.id === 3">
                    <th>序号</th><th>关键文件/目录</th><th>是否合规</th><th>不合规说明</th>
                  </tr>
                  <tr v-else-if="props.row.id === 4">
                    <th>序号</th><th>危险操作命令</th><th>是否合规</th><th>不合规说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="d in detailDataMap[props.row.id]" :key="d.id">
                    <td>{{ d.id }}</td>
                    <td v-if="d.protocol">{{ d.protocol }}</td>
                    <td v-if="d.address">{{ d.address }}</td>
                    <td v-if="d.port">{{ d.port }}</td>
                    <td v-if="d.path">{{ d.path }}</td>
                    <td v-if="d.command">{{ d.command }}</td>
                    <td>{{ d.result }}</td>
                    <td>{{ d.note }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </td>
          </tr>
        </template>
      </q-table>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>
