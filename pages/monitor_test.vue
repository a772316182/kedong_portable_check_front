<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { 
  CreateMonitorObjectParams,
  GetMonitorObjectParams,
  DeleteMonitorObjectParams,
  QueryMonitorObjectsParams,
  QueryMonitorObjectsSearchParams
} from '~/types/api'
// 自定义更新参数类型，确保updates中的值是字符串
interface LocalUpdateMonitorObjectParams {
  guid: string;
  updates: Record<string, string>;
}

import { 
  useCreateMonitorObjectApi,
  useGetMonitorObjectApi,
  useUpdateMonitorObjectApi,
  useDeleteMonitorObjectApi,
  useQueryMonitorObjectsApi
} from '~/composables/useApi'

// 当前激活的选项卡
const activeTab = ref('create')

// CreateMonitorObject API
const { createState, createMonitorObject, resetCreateState } = useCreateMonitorObjectApi()
const createParams = reactive<CreateMonitorObjectParams>({
  guid: "test_guid_123",
  ip: "192.168.136.1",
  devname: "TestDevice1",
  devtype: 1,
  subsystype: "Router",
  securityarea: 1002,
  mac: "00-50-56-C0-00-08",
  username: "admin",
  passwd: "password123",
  draw_topology: true
})

// GetMonitorObject API
const { getState, getMonitorObject, resetGetState } = useGetMonitorObjectApi()
const getParams = reactive<GetMonitorObjectParams>({
  guid: "test_guid_123"
})

// UpdateMonitorObject API
const { updateState, updateMonitorObject, resetUpdateState } = useUpdateMonitorObjectApi()
// 使用自定义类型确保updates中的值都是字符串
const updateParams = reactive<LocalUpdateMonitorObjectParams>({
  guid: "test_guid_123",
  updates: {
    devname: "UpdatedDevice1",
    ip2: "192.168.136.2",
    passwd: "newpassword456"
  }
})

// DeleteMonitorObject API
const { deleteState, deleteMonitorObject, resetDeleteState } = useDeleteMonitorObjectApi()
const deleteParams = reactive<DeleteMonitorObjectParams>({
  guid: "test_guid_123"
})

// QueryMonitorObjects API
const { queryState, queryMonitorObjects, resetQueryState } = useQueryMonitorObjectsApi()
const querySearchParams = reactive<QueryMonitorObjectsSearchParams>({
  devname: "upda",
  devtype: 1,
  subsystype: "Router",
  securityarea: 1002
})
const queryParams = reactive<QueryMonitorObjectsParams>({
  search_params: querySearchParams,
  page: 1,
  page_size: 10
})

// 处理绘制拓扑开关的值
const drawTopology = ref(createParams.draw_topology || false)
// 监听开关状态变化并更新参数
function updateDrawTopology(value: boolean) {
  createParams.draw_topology = value
}

// 调用各个API的函数
function handleCreateMonitorObject() {
  createMonitorObject(createParams)
}

function handleGetMonitorObject() {
  getMonitorObject(getParams)
}

function handleUpdateMonitorObject() {
  // 调用API时确保类型匹配
  updateMonitorObject({
    guid: updateParams.guid,
    updates: updateParams.updates
  })
}

function handleDeleteMonitorObject() {
  deleteMonitorObject(deleteParams)
}

function handleQueryMonitorObjects() {
  queryMonitorObjects(queryParams)
}
</script>

<template>
  <div class="q-pa-md">
    <h4 class="text-h4">监控对象 API 测试</h4>
    <p class="text-subtitle1">测试监控对象相关的 API 端点</p>

    <!-- 选项卡导航 -->
    <q-tabs
      v-model="activeTab"
      class="text-primary"
      active-color="primary"
      indicator-color="primary"
      align="left"
    >
      <q-tab name="create" label="创建" />
      <q-tab name="get" label="获取" />
      <q-tab name="update" label="更新" />
      <q-tab name="query" label="查询" />
      <q-tab name="delete" label="删除" />
    </q-tabs>

    <q-separator />

    <!-- 选项卡内容 -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- 创建 API 测试面板 -->
      <q-tab-panel name="create">
        <h5 class="q-mt-none">创建监控对象</h5>
        <p>测试 POST /api/monitor/create 端点</p>
        
        <!-- 参数表单 -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">请求参数</div>
            <q-form @submit.prevent="handleCreateMonitorObject" class="q-gutter-sm row">
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="createParams.guid" 
                  label="GUID" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="createParams.ip" 
                  label="IP" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="createParams.devname" 
                  label="设备名称" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model.number="createParams.devtype" 
                  label="设备类型" 
                  type="number"
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="createParams.subsystype" 
                  label="子系统类型" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model.number="createParams.securityarea" 
                  label="安全区域" 
                  type="number"
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="createParams.mac" 
                  label="MAC 地址" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="createParams.username" 
                  label="用户名" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="createParams.passwd" 
                  label="密码" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-toggle 
                  v-model="drawTopology" 
                  label="绘制拓扑" 
                  @update:model-value="updateDrawTopology"
                />
              </div>
              
              <div class="col-12 q-mt-md">
                <q-btn 
                  label="创建" 
                  type="submit" 
                  color="primary" 
                  :loading="createState.loading"
                />
                <q-btn 
                  label="重置" 
                  flat 
                  color="grey" 
                  class="q-ml-sm" 
                  @click="resetCreateState"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        
        <!-- 响应展示 -->
        <q-card flat bordered v-if="createState.data || createState.error">
          <q-card-section>
            <div class="text-h6">响应数据</div>
            <pre v-if="createState.data" class="response-data">{{ JSON.stringify(createState.data, null, 2) }}</pre>
            <pre v-if="createState.error" class="error-data">{{ JSON.stringify(createState.error, null, 2) }}</pre>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- 获取 API 测试面板 -->
      <q-tab-panel name="get">
        <h5 class="q-mt-none">获取监控对象</h5>
        <p>测试 POST /api/monitor/get 端点</p>
        
        <!-- 参数表单 -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">请求参数</div>
            <q-form @submit.prevent="handleGetMonitorObject" class="q-gutter-sm row">
              <div class="col-12">
                <q-input 
                  v-model="getParams.guid" 
                  label="GUID" 
                  outlined
                  dense
                  required
                />
              </div>
              
              <div class="col-12 q-mt-md">
                <q-btn 
                  label="获取" 
                  type="submit" 
                  color="primary" 
                  :loading="getState.loading"
                />
                <q-btn 
                  label="重置" 
                  flat 
                  color="grey" 
                  class="q-ml-sm" 
                  @click="resetGetState"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        
        <!-- 响应展示 -->
        <q-card flat bordered v-if="getState.data || getState.error">
          <q-card-section>
            <div class="text-h6">响应数据</div>
            <pre v-if="getState.data" class="response-data">{{ JSON.stringify(getState.data, null, 2) }}</pre>
            <pre v-if="getState.error" class="error-data">{{ JSON.stringify(getState.error, null, 2) }}</pre>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- 更新 API 测试面板 -->
      <q-tab-panel name="update">
        <h5 class="q-mt-none">更新监控对象</h5>
        <p>测试 POST /api/monitor/update 端点</p>
        
        <!-- 参数表单 -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">请求参数</div>
            <q-form @submit.prevent="handleUpdateMonitorObject" class="q-gutter-sm row">
              <div class="col-12">
                <q-input 
                  v-model="updateParams.guid" 
                  label="GUID" 
                  outlined
                  dense
                  required
                />
              </div>

              <div class="col-12">
                <q-input 
                  v-model="updateParams.updates.devname" 
                  label="设备名称" 
                  outlined
                  dense
                />
              </div>

              <div class="col-12">
                <q-input 
                  v-model="updateParams.updates.ip2" 
                  label="IP2" 
                  outlined
                  dense
                />
              </div>

              <div class="col-12">
                <q-input 
                  v-model="updateParams.updates.passwd" 
                  label="密码" 
                  outlined
                  dense
                />
              </div>
              
              <div class="col-12 q-mt-md">
                <q-btn 
                  label="更新" 
                  type="submit" 
                  color="primary" 
                  :loading="updateState.loading"
                />
                <q-btn 
                  label="重置" 
                  flat 
                  color="grey" 
                  class="q-ml-sm" 
                  @click="resetUpdateState"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        
        <!-- 响应展示 -->
        <q-card flat bordered v-if="updateState.data || updateState.error">
          <q-card-section>
            <div class="text-h6">响应数据</div>
            <pre v-if="updateState.data" class="response-data">{{ JSON.stringify(updateState.data, null, 2) }}</pre>
            <pre v-if="updateState.error" class="error-data">{{ JSON.stringify(updateState.error, null, 2) }}</pre>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- 查询 API 测试面板 -->
      <q-tab-panel name="query">
        <h5 class="q-mt-none">查询监控对象</h5>
        <p>测试 POST /api/monitor/query 端点</p>
        
        <!-- 参数表单 -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">请求参数</div>
            <q-form @submit.prevent="handleQueryMonitorObjects" class="q-gutter-sm row">
              <div class="col-xs-12">
                <q-card bordered flat class="q-mb-md">
                  <q-card-section>
                    <div class="text-subtitle1">搜索条件</div>
                    
                    <div class="row q-col-gutter-sm">
                      <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-input 
                          v-model="querySearchParams.devname" 
                          label="设备名称" 
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-input 
                          v-model.number="querySearchParams.devtype" 
                          label="设备类型" 
                          type="number"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-input 
                          v-model="querySearchParams.subsystype" 
                          label="子系统类型" 
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-input 
                          v-model.number="querySearchParams.securityarea" 
                          label="安全区域" 
                          type="number"
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-input 
                          v-model="querySearchParams.ip" 
                          label="IP" 
                          outlined
                          dense
                        />
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-input 
                          v-model="querySearchParams.ip2" 
                          label="IP2" 
                          outlined
                          dense
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input 
                  v-model.number="queryParams.page" 
                  label="页码" 
                  type="number"
                  outlined
                  dense
                />
              </div>

              <div class="col-xs-12 col-sm-6">
                <q-input 
                  v-model.number="queryParams.page_size" 
                  label="每页数量" 
                  type="number"
                  outlined
                  dense
                />
              </div>
              
              <div class="col-12 q-mt-md">
                <q-btn 
                  label="查询" 
                  type="submit" 
                  color="primary" 
                  :loading="queryState.loading"
                />
                <q-btn 
                  label="重置" 
                  flat 
                  color="grey" 
                  class="q-ml-sm" 
                  @click="resetQueryState"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        
        <!-- 响应展示 -->
        <q-card flat bordered v-if="queryState.data || queryState.error">
          <q-card-section>
            <div class="text-h6">响应数据</div>
            <pre v-if="queryState.data" class="response-data">{{ JSON.stringify(queryState.data, null, 2) }}</pre>
            <pre v-if="queryState.error" class="error-data">{{ JSON.stringify(queryState.error, null, 2) }}</pre>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- 删除 API 测试面板 -->
      <q-tab-panel name="delete">
        <h5 class="q-mt-none">删除监控对象</h5>
        <p>测试 POST /api/monitor/delete 端点</p>
        
        <!-- 参数表单 -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">请求参数</div>
            <q-form @submit.prevent="handleDeleteMonitorObject" class="q-gutter-sm row">
              <div class="col-12">
                <q-input 
                  v-model="deleteParams.guid" 
                  label="GUID" 
                  outlined
                  dense
                  required
                />
              </div>
              
              <div class="col-12 q-mt-md">
                <q-btn 
                  label="删除" 
                  type="submit" 
                  color="negative" 
                  :loading="deleteState.loading"
                />
                <q-btn 
                  label="重置" 
                  flat 
                  color="grey" 
                  class="q-ml-sm" 
                  @click="resetDeleteState"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        
        <!-- 响应展示 -->
        <q-card flat bordered v-if="deleteState.data || deleteState.error">
          <q-card-section>
            <div class="text-h6">响应数据</div>
            <pre v-if="deleteState.data" class="response-data">{{ JSON.stringify(deleteState.data, null, 2) }}</pre>
            <pre v-if="deleteState.error" class="error-data">{{ JSON.stringify(deleteState.error, null, 2) }}</pre>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style scoped>
.response-data, .error-data {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  max-height: 500px;
  white-space: pre-wrap;
}

.error-data {
  background-color: #fff0f0;
  color: #c10015;
}
</style> 