import { exampleClient } from '~/server/api/pscClient'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return new Promise((resolve, reject) => {
    exampleClient.UnaryCall(body, (err: any, response: any) => {
      if (err) {
        console.error('gRPC Error:', err)
        // 增强错误响应以便于客户端处理
        return reject(createError({
          statusCode: 500,
          statusMessage: 'gRPC Error',
          data: {
            code: err.code,
            details: err.details,
          },
        }))
      }
      resolve(response)
    })
  })
}) 