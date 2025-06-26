import { defineEventHandler, getQuery } from 'h3'
import { pscClient } from '../../utils/pscClient'

export default defineEventHandler(async (event) => {
    // 允许前端通过 ?areaPid=2100 来查询
    const { areaPid = '0' } = getQuery(event)
    return new Promise((resolve, reject) => {
        pscClient.City({ areaPid: Number(areaPid) }, (err: any, resp: any) => {
            if (err) return reject(err)
            resolve(resp)
        })
    })
})
