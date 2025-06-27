<script setup lang="ts">
import {rowClassFn} from "~/utils/tableStyle";

const model = ref('主机策略')

const columns = [
  {name: 'index', label: '序号', field: 'index', sortable: true},
  {name: 'isEnabled', label: '是否启用', field: 'isEnabled', sortable: true, align: 'left'},
  {name: 'itemNameForVerify', label: '核查项目', field: 'itemNameForVerify', sortable: true, align: 'left'},
  {name: 'systemVersion', label: '系统版本', field: 'systemVersion', sortable: true, align: 'center'},
  {name: 'ruleDesc', label: '规则说明', field: 'ruleDesc', sortable: true, align: 'left'},
  {name: 'actions', label: '操作', field: 'actions', align: 'center'}
]
const rows = [
  {index: 1, itemNameForVerify: '检测项1', systemVersion: 'Windows Server 2025', ruleDesc: '主机配置的关键文件/目录不得缺失', isEnabled: true},
  {index: 2, itemNameForVerify: '检测项2', systemVersion: 'Windows Server 2025', ruleDesc: '规则说明2', isEnabled: false},
  {index: 3, itemNameForVerify: '检测项3', systemVersion: 'RHEL 9', ruleDesc: '主机网络连接白名单内不得包含高危端口；目的端口和目的IP固定一个；主机源IP为一个IP地址或者少于20个IP地址段，服务端主机端口为1024-65535.', isEnabled: true},
  {index: 4, itemNameForVerify: '检测项4', systemVersion: 'Ubuntu 24 LTS', ruleDesc: '规则说明4', isEnabled: false},
]
const options = ref([
  {label: '主机策略', value: '主机策略'},
  {label: '纵向策略', value: '纵向策略'},
  {label: '隔离策略', value: '隔离策略'},
  {label: '防火墙策略', value: '防火墙策略'},
])
</script>

<template>
  <div class="q-gutter-y-md">
    <div class="row">
      <q-select v-model="model" filled :options="options" label="策略类型" class="col-4" />
    </div>
    <q-table
        square
        no-data-label="暂无数据"
        flat bordered
        title="告警验证配置"
        :rows="rows"
        :columns="columns"
        row-key="index"
        :table-row-class-fn="rowClassFn"
        :rows-per-page-options="[5, 10, 20, 50, 0]"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="index" :props="props">
            {{ props.row.index }}
          </q-td>
          <q-td key="isEnabled" :props="props">
            <q-toggle v-model="props.row.isEnabled"/>
          </q-td>
          <q-td key="itemNameForVerify" :props="props">
            {{ props.row.itemNameForVerify }}
          </q-td>
          <q-td key="systemVersion" :props="props">
            {{ props.row.systemVersion }}
          </q-td>
          <q-td key="ruleDesc" :props="props">
            {{ props.row.ruleDesc }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn flat color="primary">编辑</q-btn>
            <q-btn flat color="red-10">删除</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<style scoped>

</style>