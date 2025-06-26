import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '../../../utils/pscClient'
import type { ListNetworkConfigsByAreaParams, ListNetworkConfigsByAreaResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as ListNetworkConfigsByAreaParams
    
    // 准备gRPC请求
    const request: any = {
        stationId: body.stationId,
    }
    
    // 添加可选参数
    if (body.secArea) {
        request.secArea = body.secArea
    }
    
    if (body.network_type_id) {
        request.network_type_id = body.network_type_id
    }
    
    return new Promise<ListNetworkConfigsByAreaResponse>((resolve, reject) => {
        pscClient.ListNetworkConfigsByArea(request, (err: any, resp: any) => {
            if (err) {
                console.error('Error from gRPC call ListNetworkConfigsByArea:', err)
                return reject(err)
            }
            
            try {
                // 处理返回的数据
                let parsedContent = resp.messageContent
                if (typeof resp.messageContent === 'string' && resp.messageContent) {
                    try {
                        parsedContent = JSON.parse(resp.messageContent)
                    } catch (parseError) {
                        console.warn('Failed to parse messageContent:', parseError)
                        parsedContent = resp.messageContent
                    }
                }

                resolve({
                    retNum: resp.retNum,
                    errMessage: resp.errMessage,
                    messageContent: parsedContent
                })
            } catch (processError) {
                console.error('Failed to process ListNetworkConfigsByArea response:', processError)
                resolve(resp)
            }
        })
    })
}) 