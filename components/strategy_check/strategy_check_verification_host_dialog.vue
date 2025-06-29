<script setup lang="ts">

const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true
  },
  currentDevice: {
    type: Object,
    default: null
  }
})

const customPage = ref(null)
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const rows = ref([])
const totalRows = ref(0)

const emit = defineEmits(['update:showDialog'])

const showDialog = computed({
  get: () => props.showDialog,
  set: (value) => emit('update:showDialog', value)
})

const currentDeviceName = computed(() => props.currentDevice?.name || '未知设备')

// 策略类型选项
const policyTypes = [
  {label: '网络连接白名单', value: 'network'},
  {label: '服务端口白名单', value: 'service'},
  {label: '关键文件/目录', value: 'files'},
  {label: '危险操作指令', value: 'commands'}
]

const selectedPolicyType = ref(policyTypes[0])

const searchKeyword = ref('')


// 网络连接白名单数据
const networkWhitelist = ref([
  {index: 1, protocol: 'TCP', address: '10.200.114.23', port: '8080'},
  {index: 2, protocol: 'UDP', address: '10.200.114.24', port: '9090'},
  {index: 3, protocol: 'TCP', address: '10.200.114.25', port: '3306'},
  {index: 4, protocol: 'TCP', address: '10.200.114.23', port: '8080'},
  {index: 5, protocol: 'UDP', address: '10.200.114.24', port: '9090'},
  {index: 6, protocol: 'TCP', address: '10.200.114.25', port: '3306'},
  {index: 7, protocol: 'TCP', address: '10.200.114.23', port: '8080'},
  {index: 8, protocol: 'UDP', address: '10.200.114.24', port: '9090'},
  {index: 9, protocol: 'TCP', address: '10.200.114.25', port: '3306'},
  {index: 10, protocol: 'TCP', address: '10.200.114.23', port: '8080'},
  {index: 11, protocol: 'UDP', address: '10.200.114.24', port: '9090'},
  {index: 12, protocol: 'TCP', address: '10.200.114.25', port: '3306'}
])

const networkColumns = [
  {name: 'index', label: '编号', field: 'index', align: 'left', style: 'width: 80px'},
  {name: 'protocol', label: '协议', field: 'protocol', align: 'left', style: 'width: 100px'},
  {name: 'address', label: '地址', field: 'address', align: 'left'},
  {name: 'port', label: '端口', field: 'port', align: 'left', style: 'width: 100px'}
]

// 服务端口白名单数据
const serviceWhitelist = ref([
  {index: 1, protocol: 'TCP', port: '80'},
  {index: 2, protocol: 'TCP', port: '443'},
  {index: 3, protocol: 'UDP', port: '53'},
  {index: 4, protocol: 'TCP', port: '80'},
  {index: 5, protocol: 'TCP', port: '443'},
  {index: 6, protocol: 'UDP', port: '53'},
  {index: 7, protocol: 'TCP', port: '80'},
  {index: 8, protocol: 'TCP', port: '443'},
  {index: 9, protocol: 'UDP', port: '53'},
  {index: 10, protocol: 'TCP', port: '80'},
  {index: 11, protocol: 'TCP', port: '443'},
  {index: 12, protocol: 'UDP', port: '53'}
])

const serviceColumns = [
  {name: 'index', label: '编号', field: 'index', align: 'left', style: 'width: 80px'},
  {name: 'protocol', label: '协议', field: 'protocol', align: 'left', style: 'width: 100px'},
  {name: 'port', label: '端口', field: 'port', align: 'left', style: 'width: 100px'}
]

// 关键文件/目录数据
const criticalFiles = ref([
  {index: 1, path: '/etc/passwd'},
  {index: 2, path: '/etc/shadow'},
  {index: 3, path: '/var/log/messages'},
  {index: 4, path: '/etc/passwd'},
  {index: 5, path: '/etc/shadow'},
  {index: 6, path: '/var/log/messages'},
  {index: 7, path: '/etc/passwd'},
  {index: 8, path: '/etc/shadow'},
  {index: 9, path: '/var/log/messages'},
  {index: 10, path: '/etc/passwd'},
  {index: 11, path: '/etc/shadow'},
  {index: 12, path: '/var/log/messages'}
])

const fileColumns = [
  {name: 'index', label: '编号', field: 'index', align: 'left', style: 'width: 80px'},
  {name: 'path', label: '关键文件/目录', field: 'path', align: 'left'}
]

// 危险操作指令数据
const dangerousCommands = ref([
  {index: 1, command: 'rm -rf /'},
  {index: 2, command: 'chmod 777 /etc/passwd'},
  {index: 3, command: 'useradd hacker'},
  {index: 4, command: 'rm -rf /'},
  {index: 5, command: 'chmod 777 /etc/passwd'},
  {index: 6, command: 'useradd hacker'},
  {index: 7, command: 'rm -rf /'},
  {index: 8, command: 'chmod 777 /etc/passwd'},
  {index: 9, command: 'useradd hacker'},
  {index: 10, command: 'rm -rf /'},
  {index: 11, command: 'chmod 777 /etc/passwd'},
  {index: 12, command: 'useradd hacker'}
])

const commandColumns = [
  {name: 'index', label: '编号', field: 'index', align: 'left', style: 'width: 80px'},
  {name: 'command', label: '危险操作指令', field: 'command', align: 'left'}
]

function handleSearch() {
  const match = policyTypes.find(pt => pt.label.includes(searchKeyword.value.trim()))
  if (match) {
    selectedPolicyType.value = match
    pagination.value.page = 1
  }
  searchKeyword.value = ''
}


const currentRows = computed(() => {
  if (selectedPolicyType.value.value === 'network') {
    return networkWhitelist.value
  } else if (selectedPolicyType.value.value === 'service') {
    return serviceWhitelist.value
  } else if (selectedPolicyType.value.value === 'files') {
    return criticalFiles.value
  } else if (selectedPolicyType.value.value === 'commands') {
    return dangerousCommands.value
  }
  return []
})

const currentPageRange = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage + 1
  const end = Math.min(pagination.value.page * pagination.value.rowsPerPage, currentRows.value.length)
  return {start, end}
})

function goToPage() {
  if (!customPage.value) return
  const pageNum = parseInt(customPage.value)
  const maxPage = Math.ceil(currentRows.value.length / pagination.value.rowsPerPage)
  if (pageNum >= 1 && pageNum <= maxPage) {
    pagination.value.page = pageNum
    customPage.value = null
  }
}

function closeDialog() {
  showDialog.value = false
}

onMounted(() => {
  pagination.value.rowsNumber = currentRows.value.length
})
</script>

<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 1200px; max-width: 90vw; max-height: 90vh; overflow-y: auto;">

      <!-- 顶部标题行 -->
      <q-card-section class="q-py-sm row items-center" style="background-color: #3BB5A3; position: relative;">
        <q-icon
            name="description"
            size="30px"
            class="q-mr-sm text-white"
        />
        <div class="text-h6 text-white" style="flex: 1; text-align: center;">
          主机策略- {{ currentDeviceName }}
        </div>
        <q-btn
icon="close" flat round dense style="position: absolute; top: 4px; right: 4px; color: white;"
               @click="closeDialog"/>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <!-- <div class="row items-center q-mb-md">
            <div class="text-subtitle1 q-mr-sm" style="line-height: 40px;">策略类型：</div>
            <q-select
                v-model="selectedPolicyType"
                :options="policyTypes"
                style="max-width: 200px;"
                outlined
                dense
                @update:model-value="pagination.page = 1"
            />
        </div>        -->
        <div class="row items-center q-mb-md">
          <div class="text-subtitle1 q-mr-sm" style="line-height: 40px;">策略类型：</div>
          <q-select
              v-model="selectedPolicyType"
              :options="policyTypes"
              style="max-width: 200px;"
              outlined
              dense
              @update:model-value="pagination.page = 1"
          />
          <q-input
              v-model="searchKeyword"
              outlined
              dense
              placeholder="搜索策略类型"
              class="q-ml-md"
              style="width: 200px;"
              @keyup.enter="handleSearch"
          >
            <template #append>
              <q-icon name="search" class="cursor-pointer" @click="handleSearch"/>
            </template>
          </q-input>
        </div>

      </q-card-section>

      <q-card-section class="q-pt-none" style="height: 300px; overflow: auto;">
        <!-- 网络连接白名单表格 -->
        <q-table
            v-if="selectedPolicyType.value === 'network'"
            v-model:pagination="pagination"
            flat
            bordered
            :rows="networkWhitelist.slice(
            (pagination.page - 1) * pagination.rowsPerPage,
            pagination.page * pagination.rowsPerPage
          )"
            :columns="networkColumns"
            row-key="index"
            hide-pagination
            virtual-scroll
            :header-class="'custom-header'"
            dense
            :table-row-class-fn="rowClassFn"
        />

        <!-- 服务端口白名单表格 -->
        <q-table
            v-else-if="selectedPolicyType.value === 'service'"
            v-model:pagination="pagination"
            flat
            bordered
            :rows="serviceWhitelist.slice(
            (pagination.page - 1) * pagination.rowsPerPage,
            pagination.page * pagination.rowsPerPage
          )"
            :columns="serviceColumns"
            row-key="index"
            hide-pagination
            virtual-scroll
            :header-class="'custom-header'"
            dense
            :table-row-class-fn="rowClassFn"
        />

        <!-- 关键文件/目录表格 -->
        <q-table
            v-else-if="selectedPolicyType.value === 'files'"
            v-model:pagination="pagination"
            flat
            bordered
            :rows="criticalFiles.slice(
            (pagination.page - 1) * pagination.rowsPerPage,
            pagination.page * pagination.rowsPerPage
          )"
            :columns="fileColumns"
            row-key="index"
            hide-pagination
            virtual-scroll
            :header-class="'custom-header'"
            dense
            :table-row-class-fn="rowClassFn"
        />

        <!-- 危险操作指令表格 -->
        <q-table
            v-else-if="selectedPolicyType.value === 'commands'"
            v-model:pagination="pagination"
            flat
            bordered
            :rows="dangerousCommands.slice(
            (pagination.page - 1) * pagination.rowsPerPage,
            pagination.page * pagination.rowsPerPage
          )"
            :columns="commandColumns"
            row-key="index"
            hide-pagination
            virtual-scroll
            :header-class="'custom-header'"
            dense
            :table-row-class-fn="rowClassFn"
        />
      </q-card-section>

      <q-card-section>
        <div class="row items-center justify-start q-mt-md">
          <div class="text-caption q-mr-md">
            第 {{ currentPageRange.start }}-{{ currentPageRange.end }} 条，共 {{ currentRows.length }} 条
          </div>

          <q-pagination
              v-model="pagination.page"
              :max="Math.ceil(currentRows.length / pagination.rowsPerPage)"
              :max-pages="6"
              direction-links
              boundary-links
              boundary-numbers
              size="sm"
              flat
              color="black"
              active-color="primary"
              class="my-pagination-custom q-mr-md"
          />

          <div class="text-caption custom-page-size q-mr-md">
            {{ pagination.rowsPerPage }} 条/页
          </div>

          <div class="row items-center">
            <span class="q-mr-sm">跳至</span>
            <q-input
                v-model.number="customPage"
                type="number"
                dense
                style="width: 60px;"
                class="custom-jump-input"
                @keyup.enter="goToPage"
            />
            <span class="q-ml-sm">页</span>
          </div>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="关闭" color="primary"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
:deep(.q-table th) {
  background-color: #006A6A !important;
  color: white !important;
  font-weight: bold !important;
  font-size: 14px !important;
}


::v-deep(.my-pagination-custom .q-pagination__content .q-btn[aria-label*="页"]),
.custom-page-size,
::v-deep(.custom-jump-input .q-field__control) {
  border: 1px solid #3BB5A3 !important;
  border-radius: 4px !important;
}

::v-deep(.my-pagination-custom .q-pagination__content .q-btn[aria-label*="页"]) {
  background: #E0F2F1 !important;
  color: #3BB5A3 !important;
  min-width: 28px !important;
  min-height: 28px !important;
}

.custom-page-size {
  padding: 4px 8px;
  background-color: #E0F2F1 !important;
  color: black !important;
  min-height: 28px;
  display: flex;
  align-items: center;
}

::v-deep(.custom-jump-input .q-field__control) {
  background-color: #E0F2F1 !important;
  height: 28px !important;
  min-height: unset !important;
}

::v-deep(.custom-jump-input .q-field__native) {
  color: black !important;
  padding: 0 8px;
  height: 26px !important;
}

::v-deep(.custom-jump-input) {
  height: 28px !important;
}
</style>