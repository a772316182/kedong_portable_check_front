<script setup lang="ts">
import {rowClassFn} from "~/utils/tableStyle";
import Rectification_notice_generate_notice_slip from "~/components/rectification_notice_generate_notice_slip.vue";

const dialogVisible = ref(false)

const columns = [
  {name: 'index', label: '序号', field: 'index', sortable: true, align: 'center'},
  {name: 'name', label: '通知单', field: 'name', sortable: true, align: 'left'},
  {name: 'plantName', label: '厂站名称', field: 'plantName', sortable: true, align: 'left'},
  {name: 'createTime', label: '创建时间', field: 'createTime', sortable: true, align: 'center'},
  {name: 'operator', label: '操作人', field: 'operator', sortable: true, align: 'center'},
  {name: 'actions', label: '操作', field: 'actions', align: 'center'}
]
const rows = [
  {index: 1, name: '通知单1', plantName: '厂站1', createTime: '2021-01-01 00:00:00', operator: 'admin'},
  {index: 2, name: '通知单2', plantName: '厂站2', createTime: '2021-01-01 00:00:00', operator: 'admin'},
  {index: 3, name: '通知单3', plantName: '厂站3', createTime: '2021-01-01 00:00:00', operator: 'admin'},
  {index: 4, name: '通知单4', plantName: '厂站4', createTime: '2021-01-01 00:00:00', operator: 'admin'}
]

function generateNoticeSlip() {
  dialogVisible.value = true
}

function saveRectificationNotice(data: unknown) {
  dialogVisible.value = false
  console.log(data)
}
</script>

<template>
  <div>
    <q-page class="q-pa-md q-gutter-y-md">
      <div class="q-gutter-y-md">
        <div class="row">
          <q-btn color="primary" class="col-md-2 col-lg-1 col-sm-2" @click="generateNoticeSlip">生成通知单</q-btn>
        </div>
        <q-table
            square
            no-data-label="暂无数据"
            flat bordered
            title="通知单列表"
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
              <q-td key="plantName" :props="props">
                {{ props.row.plantName }}
              </q-td>
              <q-td key="createTime" :props="props">
                {{ props.row.createTime }}
              </q-td>
              <q-td key="operator" :props="props">
                {{ props.row.operator }}
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn flat color="indigo-10">查看</q-btn>
                <q-btn flat color="primary">下载</q-btn>
                <q-btn flat color="red-10">删除</q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-page>
    <q-dialog v-model="dialogVisible">
      <rectification_notice_generate_notice_slip @cancel="dialogVisible=false" @save="saveRectificationNotice"/>
    </q-dialog>
  </div>
</template>

<style scoped>

</style>