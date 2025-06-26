import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '../../../utils/pscClient'
import type { GetMonitorObjectParams, GetMonitorObjectResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as GetMonitorObjectParams

    return new Promise<GetMonitorObjectResponse>((resolve, reject) => {
        pscClient.GetMonitorObject({ guid: body.guid }, (err: any, resp: any) => {
            if (err) {
                console.error('Error from gRPC call GetMonitorObject:', err)
                return reject(err)
            }
            
            resolve({
                status_code: resp.status_code,
                message: resp.message,
                data: resp.data || {}
            })
        })
    })
}) 