import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '~/utils/pscClient'
import type { GetMonitorObjectParams, GetMonitorObjectResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as GetMonitorObjectParams

    return new Promise<GetMonitorObjectResponse>((resolve, reject) => {
        pscClient.GetMonitorObject({ id: body.id }, (err: any, resp: any) => {
            if (err) {
                console.error('gRPC Error - GetMonitorObject:', err)
                return reject(err)
            }
            
            resolve(resp)
        })
    })
}) 