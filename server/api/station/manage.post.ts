import {defineEventHandler, readBody} from 'h3'
import {pscClient} from '../pscClient'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const {
        acceptSTime = '',
        acceptETime = '',
        province = '',
        city = '',
        station_name = '',
        station_type = '',
        pageNum = 1,
        pageSize = 10,
        sort_by = '',
        sort_order = 'ASC',
    } = body

    return new Promise((resolve, reject) => {
        pscClient.StationManage({
            acceptSTime,
            acceptETime,
            province,
            city,
            station_name,
            station_type,
            pageNum,
            pageSize,
            sort_by,
            sort_order,
        }, (err: any, resp: any) => {
            if (err) {
                console.error('Error from gRPC call StationManage:', err)
                return reject(err)
            }

            // The proto file indicates `messageContent` is a JSON string.
            // It's better to parse it here before sending to the frontend.
            try {
                if (resp && resp.messageContent) {
                    const parsedContent = JSON.parse(resp.messageContent)
                    resolve({...resp, messageContent: parsedContent})
                } else {
                    resolve(resp)
                }
            } catch (parseError) {
                console.error('Failed to parse messageContent from StationManage response:', parseError)
                // If parsing fails, we can either reject or resolve with the original response.
                // Resolving with the original response is safer for the frontend.
                resolve(resp)
            }
        })
    })
}) 