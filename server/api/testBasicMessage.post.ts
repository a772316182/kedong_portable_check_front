import { defineEventHandler, readBody } from 'h3'
import { pscClient } from './pscClient'

/**
 * 用于直接测试 BasicMessage RPC 方法的端点
 * 此端点直接转发请求到 gRPC 服务并返回结果
 * 使用示例：
 * POST /api/testBasicMessage
 * {
 *   "sendType": 1,
 *   "province": "云南省",
 *   "city": "昆明",
 *   "manufactor": "hhhhh",
 *   "stationName": "220kv云南省",
 *   "stationId": "e9dfgdf2sdf",
 *   "stationType": "发电厂",
 *   "voltagelevel": "110kv",
 *   "drawTuoPu": true
 * }
 */
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return new Promise((resolve, reject) => {
        console.log('Calling BasicMessage with params:', body)
        
        pscClient.BasicMessage(body, (err: any, resp: any) => {
            if (err) {
                console.error('Error from gRPC call BasicMessage:', err)
                return reject(err)
            }
            
            console.log('BasicMessage response:', resp)
            
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
                console.error('Failed to process BasicMessage response:', processError)
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