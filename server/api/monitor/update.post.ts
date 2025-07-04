import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '~/server/api/pscClient'
import type { UpdateMonitorObjectParams, UpdateMonitorObjectResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as UpdateMonitorObjectParams

    return new Promise<UpdateMonitorObjectResponse>((resolve, reject) => {
        pscClient.UpdateMonitorObject(body, (err: any, resp: any) => {
            if (err) {
                console.error('gRPC Error - UpdateMonitorObject:', err)
                return reject(err)
            }
            
            resolve({
                status_code: resp.status_code,
                message: resp.message,
                id: resp.id
            })
        })
    })
}) 