
<script setup>
// 对话框状态
const dialog = ref(false);

// 原始数据保持不变
const rows = ref([
  { index: 1, username: 'user001', name: '张三', institution: '技术部', createTime: '2023-04-01T12:00:00' },
  { index: 2, username: 'user002', name: '李四', institution: '市场部', createTime: '2023-04-02T13:30:00' },
  { index: 3, username: 'user003', name: '王五', institution: '销售部', createTime: '2023-04-03T14:45:00' },
  { index: 4, username: 'user004', name: '赵六', institution: '财务部', createTime: '2023-04-04T16:15:00' },
  { index: 5, username: 'user005', name: '孙七', institution: '人力资源部', createTime: '2023-04-05T17:30:00' },
]);

// 不再需要 columns 数组，而是使用 labels 对象来定义列标题
// GenericTable 会自动从 rows 数据中推断出列名
const labels = {
  index: '序号',
  username: '用户名',
  name: '姓名',
  institution: '所属机构',
  createTime: '创建时间',
  actions: '操作',
};

// --- 操作方法 ---
function editUser(user) {
  alert(`编辑用户: ${user.name}`);
  // 这里可以打开一个编辑对话框，并将 user 数据传入
}

function deleteUser(user) {
  if (confirm(`确定要删除用户 "${user.name}" 吗？`)) {
    rows.value = rows.value.filter(item => item.index !== user.index);
    alert('删除成功');
  }
}
</script>

<template>
  <div>
    <q-page class="q-pa-md">
      <q-card flat>
        <q-card-section>
          <common-enhanced-table
              title="用户列表"
              :rows="rows"
              row-key="index"
              :column-labels="labels"
              :non-sortable-columns="['index', 'institution', 'actions']"
              :non-searchable-columns="['index', 'actions']"
          >
            <template #top-right>
              <q-btn
                  label="添加用户"
                  color="primary"
                  @click="dialog = true"
              />
            </template>

            <template #cell-actions="{ row }">
              <q-btn flat dense color="primary" @click="editUser(row)">编辑</q-btn>
              <q-btn flat dense color="red-10" @click="deleteUser(row)">删除</q-btn>
            </template>

          </common-enhanced-table>
        </q-card-section>
      </q-card>

    </q-page>

    <q-dialog v-model="dialog">
      <q-card style="width: 400px;">
        <q-card-section>
          <div class="text-h6">添加新用户</div>
        </q-card-section>
        <q-card-section>
          <p>这里是添加用户的表单内容...</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup dense flat label="取消" color="primary" />
          <q-btn v-close-popup dense flat label="确认添加" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>