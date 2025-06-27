<script setup lang="ts">
import {rowClassFn} from "~/utils/tableStyle";

const columns = [
  {name: "index", label: "序号", field: "index", sortable: true},
  {name: "isEnabled", label: "是否启用", field: "isEnabled", sortable: true},
  {
    name: "itemNameForTesting",
    label: "检测项名称",
    field: "itemNameForTesting",
    sortable: true,
  },
  {
    name: "itemTypeForTesting",
    label: "检测类型",
    field: "itemTypeForTesting",
    sortable: true,
  },
  {name: "ruleDesc", label: "规则说明", field: "ruleDesc", sortable: true},
  {name: "actions", label: "操作", field: "actions", align: "center"},
];
const rows = [
  {
    index: 1,
    itemNameForTesting: "检测项1",
    itemTypeForTesting: "类型1",
    ruleDesc: "规则说明1",
    isEnabled: true,
  },
  {
    index: 2,
    itemNameForTesting: "检测项2",
    itemTypeForTesting: "类型2",
    ruleDesc: "规则说明2",
    isEnabled: false,
  },
  {
    index: 3,
    itemNameForTesting: "检测项3",
    itemTypeForTesting: "类型3",
    ruleDesc: "规则说明3",
    isEnabled: true,
  },
  {
    index: 4,
    itemNameForTesting: "检测项4",
    itemTypeForTesting: "类型4",
    ruleDesc: "规则说明4",
    isEnabled: false,
  },
];
</script>

<template>
  <div>
    <q-table
        square
        no-data-label="暂无数据"
        flat
        bordered
        title="基线核查配置"
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
          <q-td key="itemNameForTesting" :props="props">
            {{ props.row.itemNameForTesting }}
          </q-td>
          <q-td key="itemTypeForTesting" :props="props">
            {{ props.row.itemTypeForTesting }}
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

<style scoped></style>
