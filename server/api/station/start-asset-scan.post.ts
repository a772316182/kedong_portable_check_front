import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '../../../utils/pscClient'
import type { StartAssetScanParams, StartAssetScanResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as StartAssetScanParams

    return new Promise<StartAssetScanResponse>((resolve, reject) => {
        pscClient.StartAssetScan(body, (err: any, resp: any) => {
            if (err) {
                console.error('gRPC Error - StartAssetScan:', err)
                return reject(err)
            }
            
            resolve({
                retNum: resp.retNum,
                errMessage: resp.errMessage,
            })
        })
    })
}) 