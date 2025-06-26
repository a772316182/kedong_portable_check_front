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

// 可以根据需要添加更多的API类型定义 