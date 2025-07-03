<script setup lang="ts">

const props = defineProps<{
  modelValue: boolean,
  currentDevice: any
}>();

const emit = defineEmits(['update:modelValue']);

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

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

const networkColumns = {
  index: '编号',
  protocol: '协议',
  address: '地址',
  port: '端口'
};


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

const serviceColumns = {
  index: '编号',
  protocol: '协议',
  port: '端口'
};

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

const fileColumns = {
  index: '编号',
  path: '关键文件/目录'
};

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

const commandColumns = {
  index: '编号',
  command: '危险操作指令'
};

function handleSearch() {
  const match = policyTypes.find(pt => pt.label.includes(searchKeyword.value.trim()))
  if (match) {
    selectedPolicyType.value = match
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


function closeDialog() {
  showDialog.value = false
}

// onMounted(() => {
//   pagination.value.rowsNumber = currentRows.value.length
// })
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
        <!-- @update:model-value="pagination.page = 1" -->
        <div class="row items-center q-mb-md">
          <div class="text-subtitle1 q-mr-sm" style="line-height: 40px;">策略类型：</div>
          <q-select
              v-model="selectedPolicyType"
              :options="policyTypes"
              style="max-width: 200px;"
              outlined
              dense
              
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

      <q-card-section class="q-pt-none" style="height: 750px; overflow: auto;">
        <!-- 网络连接白名单表格 -->
        <common-enhanced-table
            v-if="selectedPolicyType.value === 'network'"
            :rows="networkWhitelist"
            :column-labels="networkColumns"
            row-key="index"
            virtual-scroll
            
        />


        <!-- 服务端口白名单表格 -->
        <common-enhanced-table
            v-else-if="selectedPolicyType.value === 'service'"
            :rows="serviceWhitelist"
            :column-labels="serviceColumns"
            row-key="index"
            virtual-scroll
            
        />

        <!-- 关键文件/目录表格 -->
        <common-enhanced-table
            v-else-if="selectedPolicyType.value === 'files'"
            :rows="criticalFiles"
            :column-labels="fileColumns"
            row-key="index"
            virtual-scroll
            
        />

        <!-- 危险操作指令表格 -->
        <common-enhanced-table
            v-else-if="selectedPolicyType.value === 'commands'"
            :rows="dangerousCommands"
            :column-labels="commandColumns"
            row-key="index"
            virtual-scroll
            
        />
      </q-card-section>

      
      <q-separator/>

    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>