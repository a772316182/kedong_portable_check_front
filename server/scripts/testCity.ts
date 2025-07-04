import {pscClient} from '../api/pscClient'

// 构造请求参数：areaPid = 0 （中国）
const req = {areaPid: 0}

pscClient.City(req, (err: any, resp: any) => {
    if (err) {
        console.error('调用 City RPC 失败：', err)
        process.exit(1)
    }
    console.log('City RPC 返回：', resp)
    /**
     * resp 示例：
     * {
     *   retNum: 0,
     *   errMessage: '',
     *   messageContent: '[{"id":2100,"name":"辽宁省"}, …]'
     * }
     */
    process.exit(0)
})
// npm install -D tsx
// npx tsx server/scripts/testCity.ts 运行不了的时候安装这个
