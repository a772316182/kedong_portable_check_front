<script setup lang="ts">
import { ref } from 'vue'
import type { CityApiParams, StationManageParams } from '~/types/api'
import { useCityApi, useStationManageApi } from '~/composables/useApi'

// 当前激活的选项卡
const activeTab = ref('city')

// 城市API
const { cityState, fetchCityData, resetCityState } = useCityApi()
const cityParams = ref<CityApiParams>({
  areaPid: '0'
})

// 厂站管理API
const { stationState, fetchStationData, resetStationState } = useStationManageApi()
const stationParams = ref<StationManageParams>({
  acceptSTime: "2025-06-01 00:00:00",
  acceptETime: "2025-06-30 23:59:59",
  province: "深圳",
  city: "",
  station_name: "厂站",
  station_type: "变电站",
  sort_by: "voltagelevel",
  sort_order: "DESC",
  pageNum: 1,
  pageSize: 10
})

// 调用城市API
function handleFetchCityData() {
  fetchCityData(cityParams.value)
}

// 调用厂站管理API
function handleFetchStationData() {
  fetchStationData(stationParams.value)
}
</script>

<template>
  <div class="q-pa-md">
    <h4 class="text-h4">API 测试页面</h4>
    <p class="text-subtitle1">用于测试各种后端 API 端点</p>

    <!-- 选项卡导航 -->
    <q-tabs
      v-model="activeTab"
      class="text-primary"
      active-color="primary"
      indicator-color="primary"
      align="left"
    >
      <q-tab name="city" label="城市 API" />
      <q-tab name="station" label="厂站管理 API" />
      <!-- 未来可在此处添加更多选项卡 -->
    </q-tabs>

    <q-separator />

    <!-- 选项卡内容 -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- 城市 API 测试面板 -->
      <q-tab-panel name="city">
        <h5 class="q-mt-none">城市 API 测试</h5>
        <p>测试 GET /api/city 端点</p>
        
        <!-- 参数表单 -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">请求参数</div>
            <q-form class="q-gutter-md" @submit.prevent="handleFetchCityData">
              <q-input 
                v-model="cityParams.areaPid" 
                label="areaPid" 
                hint="区域父ID，默认为 '0'" 
                outlined
              />
              <div>
                <q-btn 
                  label="发送请求" 
                  type="submit" 
                  color="primary" 
                  :loading="cityState.loading"
                />
                <q-btn 
                  label="重置" 
                  flat 
                  color="grey" 
                  class="q-ml-sm" 
                  @click="resetCityState"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        
        <!-- 响应展示 -->
        <q-card v-if="cityState.data || cityState.error" flat bordered>
          <q-card-section>
            <div class="text-h6">响应数据</div>
            <pre v-if="cityState.data" class="response-data">{{ JSON.stringify(cityState.data, null, 2) }}</pre>
            <pre v-if="cityState.error" class="error-data">{{ JSON.stringify(cityState.error, null, 2) }}</pre>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- 厂站管理 API 测试面板 -->
      <q-tab-panel name="station">
        <h5 class="q-mt-none">厂站管理 API 测试</h5>
        <p>测试 POST /api/station/manage 端点</p>
        
        <!-- 参数表单 -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6">请求参数</div>
            <q-form class="q-gutter-sm row" @submit.prevent="handleFetchStationData">
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="stationParams.acceptSTime" 
                  label="开始时间 (acceptSTime)" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="stationParams.acceptETime" 
                  label="结束时间 (acceptETime)" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="stationParams.province" 
                  label="省份 (province)" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="stationParams.city" 
                  label="城市 (city)" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="stationParams.station_name" 
                  label="厂站名称 (station_name)" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="stationParams.station_type" 
                  label="厂站类型 (station_type)" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model="stationParams.sort_by" 
                  label="排序字段 (sort_by)" 
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-select
                  v-model="stationParams.sort_order"
                  :options="['ASC', 'DESC']"
                  label="排序方式 (sort_order)"
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model.number="stationParams.pageNum" 
                  label="页码 (pageNum)" 
                  type="number"
                  outlined
                  dense
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input 
                  v-model.number="stationParams.pageSize" 
                  label="页大小 (pageSize)" 
                  type="number"
                  outlined
                  dense
                />
              </div>
              
              <div class="col-12 q-mt-md">
                <q-btn 
                  label="发送请求" 
                  type="submit" 
                  color="secondary" 
                  :loading="stationState.loading"
                />
                <q-btn 
                  label="重置" 
                  flat 
                  color="grey" 
                  class="q-ml-sm" 
                  @click="resetStationState"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        
        <!-- 响应展示 -->
        <q-card v-if="stationState.data || stationState.error" flat bordered>
          <q-card-section>
            <div class="text-h6">响应数据</div>
            <pre v-if="stationState.data" class="response-data">{{ JSON.stringify(stationState.data, null, 2) }}</pre>
            <pre v-if="stationState.error" class="error-data">{{ JSON.stringify(stationState.error, null, 2) }}</pre>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- 这里可以添加更多API测试面板 -->
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