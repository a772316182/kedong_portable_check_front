import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '../pscClient'
import type { QueryAssetScanResultsParams, QueryAssetScanResultsResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as QueryAssetScanResultsParams

    return new Promise<QueryAssetScanResultsResponse>((resolve, reject) => {
        // This RPC method needs to be implemented in the Python gRPC server
        pscClient.QueryAssetScanResults(body, (err: any, resp: any) => {
            if (err) {
                console.error('gRPC Error - QueryAssetScanResults:', err)
                return reject(err)
            }
            
            resolve({
                retNum: resp.retNum,
                errMessage: resp.errMessage,
                results: resp.results || []
            })
        })
    })
}) 