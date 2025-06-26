import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '../../../utils/pscClient'
import type { DeleteMonitorObjectParams, DeleteMonitorObjectResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as DeleteMonitorObjectParams

    return new Promise<DeleteMonitorObjectResponse>((resolve, reject) => {
        pscClient.DeleteMonitorObject({ guid: body.guid }, (err: any, resp: any) => {
            if (err) {
                console.error('Error from gRPC call DeleteMonitorObject:', err)
                return reject(err)
            }
            
            resolve({
                status_code: resp.status_code,
                message: resp.message
            })
        })
    })
}) 