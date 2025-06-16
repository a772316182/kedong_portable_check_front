<script setup lang="ts">
import {rowClassFn} from "~/utils/tableStyle";

const columns = [
  {name: 'index', label: '序号', field: 'index', sortable: true, align: 'center'},
  {name: 'name', label: '模板名称', field: 'name', sortable: true, align: 'left'},
  {name: 'filePath', label: '文件路径', field: 'filePath', sortable: true, align: 'left'},
  {name: 'note', label: '备注', field: 'note', sortable: true, align: 'center'},
  {name: 'actions', label: '操作', field: 'actions', align: 'center'}
]
const rows = [
  {index: 1, name: '主机策略1', filePath: 'D:/host_policy.xml', note: '备注1：测试1：测试2：测试3：测试4：测试5'},
  {index: 2, name: '主机策略2', filePath: 'D:/host_policy.xml', note: '备注1：测试1：测试2：测试3：测试4：测试5'},
  {index: 3, name: '主机策略3', filePath: 'D:/host_policy.xml', note: '备注1：测试1：测试2：测试3：测试4：测试5'},
  {index: 4, name: '主机策略4', filePath: 'D:/host_policy.xml', note: '备注1：测试1：测试2：测试3：测试4：测试5'}
]
</script>

<template>
  <div class="q-gutter-y-md">
    <div class="row">
      <q-btn color="primary" class="col-md-2 col-lg-1 col-sm-2">添加模板</q-btn>
    </div>
    <q-table
        square
        no-data-label="暂无数据"
        flat bordered
        title="导入模板配置"
        :rows="rows"
        :columns="columns"
        row-key="index"
        :table-row-class-fn="rowClassFn"
        :rows-per-page-options="[0]"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="index" :props="props">
            {{ props.row.index }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="filePath" :props="props">
            {{ props.row.filePath }}
          </q-td>
          <q-td key="note" :props="props">
            {{ props.row.note }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn flat color="primary">下载</q-btn>
            <q-btn flat color="red-10">删除</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<style scoped>

</style>