import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '../../../utils/pscClient'
import type { NetConfigParams, NetConfigResponse, NetItem } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as NetConfigParams
    
    // 准备gRPC请求
    const request: any = {
        sendType: body.sendType,
        stationId: body.stationId,
    }
    
    // 添加可选参数
    if (body.secArea) {
        request.secArea = body.secArea
    }
    
    // 处理网络配置项数组
    if (body.nets && body.nets.length > 0) {
        request.nets = body.nets.map((net: NetItem) => ({
            indexId: net.indexId,
            devIp: net.devIp,
            netItemId: net.netItemId,
            netItemRe: net.netItemRe,
            subnetMask: net.subnetMask
        }))
    } else {
        request.nets = []
    }
    
    return new Promise<NetConfigResponse>((resolve, reject) => {
        pscClient.NetConfig(request, (err: any, resp: any) => {
            if (err) {
                console.error('Error from gRPC call NetConfig:', err)
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
                console.error('Failed to process NetConfig response:', processError)
                resolve(resp)
            }
        })
    })
}) 