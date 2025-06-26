import { ref } from 'vue'
import type { ApiState, CityApiParams, CityApiResponse, StationManageParams, StationManageResponse } from '~/types/api'
import type { 
  CreateMonitorObjectParams, CreateMonitorObjectResponse,
  GetMonitorObjectParams, GetMonitorObjectResponse,
  UpdateMonitorObjectParams, UpdateMonitorObjectResponse,
  DeleteMonitorObjectParams, DeleteMonitorObjectResponse,
  QueryMonitorObjectsParams, QueryMonitorObjectsResponse
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
 * MonitorObject API - Create
 */
export function useCreateMonitorObjectApi() {
  const { state, reset } = useApiState<CreateMonitorObjectResponse>()
  
  async function createMonitorObject(params: CreateMonitorObjectParams) {
    state.value.loading = true
    state.value.error = null
    
    try {
      state.value.data = await $fetch<CreateMonitorObjectResponse>('/api/monitor/create', {
        method: 'POST',
        body: params
      })
    } catch (error) {
      console.error('Error creating monitor object:', error)
      state.value.error = error
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
      state.value.data = await $fetch<GetMonitorObjectResponse>('/api/monitor/get', {
        method: 'POST',
        body: params
      })
    } catch (error) {
      console.error('Error getting monitor object:', error)
      state.value.error = error
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
      state.value.data = await $fetch<UpdateMonitorObjectResponse>('/api/monitor/update', {
        method: 'POST',
        body: params
      })
    } catch (error) {
      console.error('Error updating monitor object:', error)
      state.value.error = error
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
      state.value.data = await $fetch<DeleteMonitorObjectResponse>('/api/monitor/delete', {
        method: 'POST',
        body: params
      })
    } catch (error) {
      console.error('Error deleting monitor object:', error)
      state.value.error = error
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
      state.value.data = await $fetch<QueryMonitorObjectsResponse>('/api/monitor/query', {
        method: 'POST',
        body: params
      })
    } catch (error) {
      console.error('Error querying monitor objects:', error)
      state.value.error = error
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

// 可以根据需要添加更多的API调用函数 