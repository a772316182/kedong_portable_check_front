import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '../../../utils/pscClient'
import type { QueryMonitorObjectsParams, QueryMonitorObjectsResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as QueryMonitorObjectsParams

    return new Promise<QueryMonitorObjectsResponse>((resolve, reject) => {
        pscClient.QueryMonitorObjects({
            search_params: body.search_params || {},
            page: body.page || 1,
            page_size: body.page_size || 10,
            sort_by: body.pagination?.sortBy,
            sort_desc: body.pagination?.descending,
        }, (err: any, resp: any) => {
            if (err) {
                console.error('Error from gRPC call QueryMonitorObjects:', err)
                return reject(err)
            }
            
            resolve({
                status_code: resp.status_code,
                message: resp.message,
                data: resp.data || { total: 0, page: body.page || 1, page_size: body.page_size || 10, records: [] }
            })
        })
    })
}) 