import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '../../utils/pscClient'

/**
 * 用于直接测试网络相关API的端点
 * 请求格式示例:
 * {
 *   "api": "NetConfig", // 或 "ListNetworkConfigsByArea"
 *   "params": {
 *     // API参数
 *     "sendType": 1, // NetConfig需要此参数
 *     "stationId": "ea4da72ca134",
 *     "secArea": "1002",
 *     "nets": [
 *       {
 *         "indexId": "1750587105589560",
 *         "devIp": "192.168.79.19",
 *         "netItemId": "1",
 *         "netItemRe": "A网",
 *         "subnetMask": "192.168.79.1-254"
 *       }
 *     ]
 *   }
 * }
 */
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { api, params } = body
    
    if (!api || !params) {
        return {
            success: false,
            message: "请求必须包含'api'和'params'字段"
        }
    }
    
    // 检查API类型
    if (api !== 'NetConfig' && api !== 'ListNetworkConfigsByArea') {
        return {
            success: false,
            message: "不支持的API类型，支持的类型: NetConfig, ListNetworkConfigsByArea"
        }
    }
    
    return new Promise((resolve, reject) => {
        console.log(`调用 ${api} API，参数:`, params)
        
        pscClient[api](params, (err: any, resp: any) => {
            if (err) {
                console.error(`Error from gRPC call ${api}:`, err)
                return reject(err)
            }
            
            console.log(`${api} API 响应:`, resp)
            
            try {
                // 解析消息内容
                if (typeof resp.messageContent === 'string' && resp.messageContent) {
                    try {
                        resp.messageContent = JSON.parse(resp.messageContent)
                    } catch (parseError) {
                        console.warn('Failed to parse messageContent, returning as is:', parseError)
                    }
                }
                
                resolve({
                    success: resp.retNum === 0,
                    message: resp.errMessage,
                    data: resp.messageContent,
                    raw: resp
                })
            } catch (processError) {
                console.error(`Failed to process ${api} response:`, processError)
                resolve({
                    success: false,
                    message: 'Failed to process response',
                    error: String(processError),
                    raw: resp
                })
            }
        })
    })
}) 