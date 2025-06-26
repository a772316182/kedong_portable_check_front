import { defineEventHandler, getQuery } from 'h3'
import { pscClient } from '../../utils/pscClient'

export default defineEventHandler(async (event) => {
    const { areaPid = '0' } = getQuery(event)

    // 用 Promise + await 拿到 RPC 返回值
    const resp: any = await new Promise((resolve, reject) => {
        pscClient.City({ areaPid: Number(areaPid) }, (err: any, response: any) => {
            if (err) return reject(err)
            resolve(response)
        })
    })

    // 如果后端把 messageContent 当 string 返回，就 parse 一下
    if (typeof resp.messageContent === 'string') {
        try {
            resp.messageContent = JSON.parse(resp.messageContent)
        } catch (e) {
            console.warn('解析 messageContent 失败，保留原始字符串:', e)
        }
    }

    return resp
})
