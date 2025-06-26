import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '../../../utils/pscClient'
import type { UpdateMonitorObjectParams, UpdateMonitorObjectResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as UpdateMonitorObjectParams

    return new Promise<UpdateMonitorObjectResponse>((resolve, reject) => {
        pscClient.UpdateMonitorObject({
            guid: body.guid,
            updates: Object.entries(body.updates).reduce((acc, [key, value]) => {
                // gRPC 要求 updates 中的值是字符串
                acc[key] = String(value)
                return acc
            }, {} as Record<string, string>)
        }, (err: any, resp: any) => {
            if (err) {
                console.error('Error from gRPC call UpdateMonitorObject:', err)
                return reject(err)
            }
            
            resolve({
                status_code: resp.status_code,
                message: resp.message,
                guid: resp.guid
            })
        })
    })
}) 