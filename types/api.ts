// API 响应与请求的通用类型定义

// API 通用状态接口
export interface ApiState<T = any> {
  loading: boolean;
  data: T | null;
  error: any;
}

// 城市 API
export interface CityApiParams {
  areaPid: string | number;
}

export interface CityApiResponse {
  retNum: number;
  errMessage: string;
  messageContent: any; // 实际返回的数据内容，可能是数组或对象
  // 如果知道具体结构，可以进一步定义
}

// 厂站管理 API
export interface StationManageParams {
  acceptSTime: string;
  acceptETime: string;
  province: string;
  city: string;
  station_name: string;
  station_type: string;
  sort_by: string;
  sort_order: "ASC" | "DESC";
  pageNum: number;
  pageSize: number;
}

export interface StationManageResponse {
  retNum: number;
  errMessage: string;
  messageContent: any; // 解析后的JSON数据
  total: number;
}

// BasicMessage API 类型定义
export interface BasicConfigParams {
  sendType: number;
  province?: string | null;
  city?: string | null;
  manufactor?: string;
  stationName?: string;
  stationId?: string;
  stationType?: string;
  voltagelevel?: number | string | null;
  drawTuoPu?: boolean;
}

export interface BasicConfigResponse {
  retNum: number;
  errMessage: string;
  messageContent: any;
}

// NetConfig API 类型定义
export interface NetItem {
  indexId: string;
  devIp: string;
  netItemId: string;
  netItemRe: string;
  subnetMask: string;
}

export interface NetConfigParams {
  sendType: number;
  stationId: string;
  secArea?: string;
  nets?: NetItem[];
}

export interface NetConfigResponse {
  retNum: number;
  errMessage: string;
  messageContent: any;
}

// ListNetworkConfigsByArea API 类型定义
export interface ListNetworkConfigsByAreaParams {
  stationId: string;
  secArea?: string;
  network_type_id?: string;
}

export interface ListNetworkConfigsByAreaResponse {
  retNum: number;
  errMessage: string;
  messageContent: any;
}

// MonitorObject API 类型定义

// CreateMonitorObject
export interface CreateMonitorObjectParams {
  guid?: string;
  id?: string;
  ip: string;
  ip2?: string;
  devname: string;
  devtype: number;
  systype?: string;
  subsystype: string;
  securityarea: number;
  mac?: string;
  mac2?: string;
  hostname?: string;
  username?: string;
  passwd?: string;
  factory?: string;
  devversion?: string;
  remark?: string;
  asset_flag?: string;
  snmp_read_pwd?: string;
  snmp_write_pwd?: string;
  businesssys?: string;
  bay_level_device?: boolean;
  draw_topology?: boolean;
}

export interface CreateMonitorObjectResponse {
  status_code: number;
  message: string;
  id: string;
}

// GetMonitorObject
export interface GetMonitorObjectParams {
  id: string;
}

export interface MonitorObjectData {
  guid: string; // This is the station ID
  id: string; // This is the monitor object's unique ID
  ip: string;
  ip2?: string;
  devname: string;
  devtype: number;
  systype?: string;
  subsystype: string;
  securityarea: number;
  mac?: string;
  mac2?: string;
  hostname?: string;
  username?: string;
  passwd?: string; // 返回时通常会被遮蔽为 ******
  factory?: string;
  devversion?: string;
  remark?: string;
  asset_flag?: string;
  snmp_read_pwd?: string;
  snmp_write_pwd?: string;
  businesssys?: string;
  bay_level_device?: boolean;
  ips?: boolean;
}

export interface GetMonitorObjectResponse {
  status_code: number;
  message: string;
  data: MonitorObjectData;
}

// UpdateMonitorObject
export interface UpdateMonitorObjectParams {
  id: string;
  updates: Record<string, string | number | boolean>;
}

export interface UpdateMonitorObjectResponse {
  status_code: number;
  message: string;
  id: string;
}

// DeleteMonitorObject
export interface DeleteMonitorObjectParams {
  id: string;
}

export interface DeleteMonitorObjectResponse {
  status_code: number;
  message: string;
}

// QueryMonitorObjects
export interface QueryMonitorObjectsSearchParams {
  devname?: string;
  devtype?: number;
  subsystype?: string;
  securityarea?: number;
  ip?: string;
  ip2?: string;
  guid?: string; // Station ID for filtering
}

export interface QueryMonitorObjectsParams {
  search_params?: QueryMonitorObjectsSearchParams;
  page: number;
  page_size: number;
}

export interface QueryMonitorObjectsData {
  total: number;
  page: number;
  page_size: number;
  records: MonitorObjectData[];
}

export interface QueryMonitorObjectsResponse {
  status_code: number;
  message: string;
  data: QueryMonitorObjectsData;
}

// 可以根据需要添加更多的API类型定义 