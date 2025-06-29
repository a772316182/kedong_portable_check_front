import { ref } from 'vue'
import type { ApiState, CityApiParams, CityApiResponse, StationManageParams, StationManageResponse, ExampleApiParams, ExampleApiResponse } from '~/types/api'
import type { 
  CreateMonitorObjectParams, CreateMonitorObjectResponse,
  GetMonitorObjectParams, GetMonitorObjectResponse,
  UpdateMonitorObjectParams, UpdateMonitorObjectResponse,
  DeleteMonitorObjectParams, DeleteMonitorObjectResponse,
  QueryMonitorObjectsParams, QueryMonitorObjectsResponse,
  BasicConfigParams, BasicConfigResponse,
  NetConfigParams, NetConfigResponse,
  ListNetworkConfigsByAreaParams, ListNetworkConfigsByAreaResponse,
  StartAssetScanParams,
  StartAssetScanResponse,
  QueryAssetScanResultsParams, QueryAssetScanResultsResponse
} from '~/types/api'

/**
 * 通用的API调用组合式函数
 * @param initialState 初始状态
 * @returns 包含状态和操作方法的对象
 */
export function useApiState<T = any>(initialState: Partial<ApiState<T>> = {}) {
  const state = ref<ApiState<T>>({
    loading: false,
    data: null,
    error: null,
    ...initialState
  })

  // 重置API状态
  function reset() {
    state.value.data = null
    state.value.error = null
    state.value.loading = false
  }

  return {
    state,
    reset
  }
}

/**
 * 城市API调用
 */
export function useCityApi() {
  const { state, reset } = useApiState<CityApiResponse>()
  
  // 获取城市数据
  async function fetchCityData(params: CityApiParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      state.value.data = await $fetch<CityApiResponse>('/api/city', {
        method: 'GET',
        query: params
      })
      console.log(state.value.data)
    } catch (error) {
      console.error('Error fetching city data:', error)
      state.value.error = error
    } finally {
      state.value.loading = false
    }
  }
  
  return {
    cityState: state,
    fetchCityData,
    resetCityState: reset
  }
}

/**
 * 厂站管理API调用
 */
export function useStationManageApi() {
  const { state, reset } = useApiState<StationManageResponse>()
  
  // 获取厂站管理数据
  async function fetchStationData(params: StationManageParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      state.value.data = await $fetch<StationManageResponse>('/api/station/manage', {
        method: 'POST',
        body: params
      })
      console.log(state.value.data)

    } catch (error) {
      console.error('Error fetching station data:', error)
      state.value.error = error
    } finally {
      state.value.loading = false
    }
  }
  
  return {
    stationState: state,
    fetchStationData,
    resetStationState: reset
  }
}

/**
 * 厂站基本信息配置API调用
 */
export function useBasicConfigApi() {
  const { state, reset } = useApiState<BasicConfigResponse>()
  
  /**
   * 调用厂站基本信息配置API
   * @param params 请求参数
   * @param sendType 操作类型：1=添加，2=查看，3=编辑基本信息，4=删除厂站
   */
  async function callBasicConfig(params: Omit<BasicConfigParams, 'sendType'>, sendType: number) {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await $fetch<BasicConfigResponse>('/api/station/basic', {
        method: 'POST',
        body: {
          ...params,
          sendType
        }
      })
      state.value.data = response;
      return response;
    } catch (error) {
      console.error(`Error calling BasicMessage with sendType ${sendType}:`, error)
      state.value.error = error
      throw error;
    } finally {
      state.value.loading = false
    }
  }
  
  // 添加厂站
  async function addStation(params: Omit<BasicConfigParams, 'sendType'>) {
    return callBasicConfig(params, 0x01)
  }
  
  // 查看厂站信息
  async function getStation(stationId: string) {
    return callBasicConfig({ stationId }, 0x02)
  }
  
  // 编辑厂站基本信息
  async function updateStation(params: Omit<BasicConfigParams, 'sendType'>) {
    return callBasicConfig(params, 0x03)
  }
  
  // 删除厂站
  async function deleteStation(stationId: string) {
    return callBasicConfig({ stationId }, 0x04)
  }
  
  return {
    basicState: state,
    addStation,
    getStation,
    updateStation,
    deleteStation,
    resetBasicState: reset
  }
}

/**
 * 网络配置API调用
 */
export function useNetConfigApi() {
  const { state, reset } = useApiState<NetConfigResponse>()
  
  /**
   * 调用网络配置API
   * @param params 请求参数，包括sendType
   */
  async function callNetConfig(params: NetConfigParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await $fetch<NetConfigResponse>('/api/network/net-config', {
        method: 'POST',
        body: params
      })
      
      // 检查 messageContent 是否为字符串，如果是，则尝试解析
      // 这可以兼容后端返回字符串或数组两种情况
      if (response && typeof response.messageContent === 'string') {
        try {
          response.messageContent = JSON.parse(response.messageContent || '[]')
        } catch(e) {
          console.error("Failed to parse messageContent from net-config api", e);
          // 解析失败时，将其置为空数组或根据业务决定如何处理
          response.messageContent = [];
        }
      }

      state.value.data = response;
      return response;
    } catch (error) {
      console.error(`Error calling NetConfig with sendType ${params.sendType}:`, error)
      state.value.error = error
      throw error;
    } finally {
      state.value.loading = false
    }
  }
  
  // 添加网络配置
  async function addNetworkConfig(params: Omit<NetConfigParams, 'sendType'>) {
    return callNetConfig({ ...params, sendType: 0x01 })
  }
  
  // 删除网络配置
  async function deleteNetworkConfig(params: Omit<NetConfigParams, 'sendType'>) {
    return callNetConfig({ ...params, sendType: 0x02 })
  }
  
  // 修改网络配置
  async function updateNetworkConfig(params: Omit<NetConfigParams, 'sendType'>) {
    return callNetConfig({ ...params, sendType: 0x03 })
  }
  
  // 从扫描结果添加子网
  async function addSubnetsFromScan(params: Omit<NetConfigParams, 'sendType'>) {
    return callNetConfig({ ...params, sendType: 0x08 })
  }
  
  return {
    netConfigState: state,
    callNetConfig,
    addNetworkConfig,
    deleteNetworkConfig,
    updateNetworkConfig,
    addSubnetsFromScan,
    resetNetConfigState: reset
  }
}

/**
 * 列出网络配置API调用
 */
export function useListNetworkConfigsApi() {
  const { state, reset } = useApiState<ListNetworkConfigsByAreaResponse>()
  
  /**
   * 列出指定厂站、安全区、网络类型下的网络配置
   * @param params 请求参数
   */
  async function listNetworkConfigs(params: ListNetworkConfigsByAreaParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await $fetch<ListNetworkConfigsByAreaResponse>('/api/network/list-network-configs', {
        method: 'POST',
        body: params
      })
      state.value.data = response;
      return response;
    } catch (error) {
      console.error('Error listing network configs:', error)
      state.value.error = error
      throw error;
    } finally {
      state.value.loading = false
    }
  }
  
  return {
    listNetworkConfigsState: state,
    listNetworkConfigs,
    resetListNetworkConfigsState: reset
  }
}

/**
 * MonitorObject API - Create
 */
export function useCreateMonitorObjectApi() {
  const { state, reset } = useApiState<CreateMonitorObjectResponse>()
  
  async function createMonitorObject(params: CreateMonitorObjectParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await $fetch<CreateMonitorObjectResponse>('/api/monitor/create', {
        method: 'POST',
        body: params
      })
      state.value.data = response;
      return response;
    } catch (error) {
      console.error('Error creating monitor object:', error)
      state.value.error = error
      throw error;
    } finally {
      state.value.loading = false
    }
  }
  
  return {
    createState: state,
    createMonitorObject,
    resetCreateState: reset
  }
}

/**
 * MonitorObject API - Get
 */
export function useGetMonitorObjectApi() {
  const { state, reset } = useApiState<GetMonitorObjectResponse>()
  
  async function getMonitorObject(params: GetMonitorObjectParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await $fetch<GetMonitorObjectResponse>('/api/monitor/get', {
        method: 'POST',
        body: params
      })
      state.value.data = response;
      return response;
    } catch (error) {
      console.error('Error getting monitor object:', error)
      state.value.error = error
      throw error;
    } finally {
      state.value.loading = false
    }
  }
  
  return {
    getState: state,
    getMonitorObject,
    resetGetState: reset
  }
}

/**
 * MonitorObject API - Update
 */
export function useUpdateMonitorObjectApi() {
  const { state, reset } = useApiState<UpdateMonitorObjectResponse>()
  
  async function updateMonitorObject(params: UpdateMonitorObjectParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await $fetch<UpdateMonitorObjectResponse>('/api/monitor/update', {
        method: 'POST',
        body: params
      })
      state.value.data = response;
      return response;
    } catch (error) {
      console.error('Error updating monitor object:', error)
      state.value.error = error
      throw error;
    } finally {
      state.value.loading = false
    }
  }
  
  return {
    updateState: state,
    updateMonitorObject,
    resetUpdateState: reset
  }
}

/**
 * MonitorObject API - Delete
 */
export function useDeleteMonitorObjectApi() {
  const { state, reset } = useApiState<DeleteMonitorObjectResponse>()
  
  async function deleteMonitorObject(params: DeleteMonitorObjectParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await $fetch<DeleteMonitorObjectResponse>('/api/monitor/delete', {
        method: 'POST',
        body: params
      })
      state.value.data = response;
      return response;
    } catch (error) {
      console.error('Error deleting monitor object:', error)
      state.value.error = error
      throw error;
    } finally {
      state.value.loading = false
    }
  }
  
  return {
    deleteState: state,
    deleteMonitorObject,
    resetDeleteState: reset
  }
}

/**
 * MonitorObject API - Query
 */
export function useQueryMonitorObjectsApi() {
  const { state, reset } = useApiState<QueryMonitorObjectsResponse>()
  
  async function queryMonitorObjects(params: QueryMonitorObjectsParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await $fetch<QueryMonitorObjectsResponse>('/api/monitor/query', {
        method: 'POST',
        body: params
      })
      state.value.data = response;
      return response;
    } catch (error) {
      console.error('Error querying monitor objects:', error)
      state.value.error = error
      throw error;
    } finally {
      state.value.loading = false
    }
  }
  
  return {
    queryState: state,
    queryMonitorObjects,
    resetQueryState: reset
  }
}

/**
 * Start Asset Scan API
 */
export function useStartAssetScanApi() {
  const { state, reset } = useApiState<StartAssetScanResponse>()
  
  async function startAssetScan(params: StartAssetScanParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await $fetch<StartAssetScanResponse>('/api/station/start-asset-scan', {
        method: 'POST',
        body: params
      })
      state.value.data = response;
      return response;
    } catch (error) {
      console.error('Error starting asset scan:', error)
      state.value.error = error
      throw error;
    } finally {
      state.value.loading = false
    }
  }
  
  return {
    scanState: state,
    startAssetScan,
    resetScanState: reset
  }
}

/**
 * Query Asset Scan Results API
 */
export function useQueryAssetScanResultsApi() {
  const { state, reset } = useApiState<QueryAssetScanResultsResponse>()
  
  async function queryAssetScanResults(params: QueryAssetScanResultsParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await $fetch<QueryAssetScanResultsResponse>('/api/station/asset-scan-results', {
        method: 'POST',
        body: params
      })
      state.value.data = response;
      return response;
    } catch (error) {
      console.error('Error querying asset scan results:', error)
      state.value.error = error
      throw error;
    } finally {
      state.value.loading = false
    }
  }
  
  return {
    resultsState: state,
    queryAssetScanResults,
    resetResultsState: reset
  }
}

/**
 * Example Service API
 */
export function useExampleApi() {
  const { state, reset } = useApiState<ExampleApiResponse>()
  
  async function callUnary(params: ExampleApiParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await $fetch<ExampleApiResponse>('/api/example/unary', {
        method: 'POST',
        body: params
      })
      state.value.data = response;
      return response;
    } catch (error) {
      console.error('Error calling unary:', error)
      state.value.error = error
      throw error;
    } finally {
      state.value.loading = false
    }
  }
  
  return {
    exampleState: state,
    callUnary,
    resetExampleState: reset
  }
}

// 可以根据需要添加更多的API调用函数 