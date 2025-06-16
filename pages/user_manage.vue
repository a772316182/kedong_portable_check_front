<script setup>

import {rowClassFn} from "~/utils/tableStyle.js";

const dialog = ref(false)

const columns = [
  {name: 'index', label: '序号', field: 'index'},
  {name: 'username', label: '用户名', field: 'username', sortable: true},
  {name: 'name', label: '姓名', field: 'name', sortable: true},
  {name: 'institution', label: '所属机构', field: 'institution'},
  {name: 'createTime', label: '创建时间', field: 'createTime', sortable: true},
  {name: 'actions', label: '操作', field: 'actions', align: 'center'}
]


const rows = ref([
  {
    index: 1,
    username: 'user001',
    name: '张三',
    institution: '技术部',
    createTime: '2023-04-01T12:00:00',
    actions: ''
  },
  {
    index: 2,
    username: 'user002',
    name: '李四',
    institution: '市场部',
    createTime: '2023-04-02T13:30:00',
    actions: ''
  },
  {
    index: 3,
    username: 'user003',
    name: '王五',
    institution: '销售部',
    createTime: '2023-04-03T14:45:00',
    actions: ''
  },
  {
    index: 4,
    username: 'user004',
    name: '赵六',
    institution: '财务部',
    createTime: '2023-04-04T16:15:00',
    actions: ''
  },
  {
    index: 5,
    username: 'user005',
    name: '孙七',
    institution: '人力资源部',
    createTime: '2023-04-05T17:30:00',
    actions: ''
  }
])

</script>

<template>
  <div>
    <q-page class="q-pa-md">
      <q-card flat>
        <q-card-section>
          <div class="row">
            <q-btn label="添加用户" class="col-2" color="primary" @click="dialog = true"/>
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
              square
              no-data-label="暂无数据"
              flat bordered
              title="用户列表"
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
                <q-td key="username" :props="props">
                  {{ props.row.username }}
                </q-td>
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="institution" :props="props">
                  {{ props.row.institution }}
                </q-td>
                <q-td key="createTime" :props="props">
                  {{ props.row.createTime }}
                </q-td>
                <q-td key="actions" :props="props">
                  <q-btn flat color="primary">编辑</q-btn>
                  <q-btn flat color="red-10">删除</q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<style scoped>

</style>