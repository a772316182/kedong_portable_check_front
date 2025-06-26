import { defineEventHandler, readBody } from 'h3'
import { pscClient } from '../../../utils/pscClient'
import type { BasicConfigParams, BasicConfigResponse } from '~/types/api'

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as BasicConfigParams

    return new Promise<BasicConfigResponse>((resolve, reject) => {
        pscClient.BasicMessage(body, (err: any, resp: any) => {
            if (err) {
                console.error('Error from gRPC call BasicMessage:', err)
                return reject(err)
            }
            
            try {
                // 处理返回的数据
                let parsedContent = resp.messageContent
                if (typeof resp.messageContent === 'string' && resp.messageContent) {
                    try {
                        parsedContent = JSON.parse(resp.messageContent)
                    } catch (parseError) {
                        console.warn('Failed to parse messageContent:', parseError)
                        parsedContent = resp.messageContent
                    }
                }

                resolve({
                    retNum: resp.retNum,
                    errMessage: resp.errMessage,
                    messageContent: parsedContent
                })
            } catch (processError) {
                console.error('Failed to process BasicMessage response:', processError)
                resolve(resp)
            }
        })
    })
}) 