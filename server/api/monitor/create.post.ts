import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '~/utils/pscClient'
import type { CreateMonitorObjectParams, CreateMonitorObjectResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as CreateMonitorObjectParams

    return new Promise<CreateMonitorObjectResponse>((resolve, reject) => {
        pscClient.CreateMonitorObject(body, (err: any, resp: any) => {
            if (err) {
                console.error('gRPC Error - CreateMonitorObject:', err)
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