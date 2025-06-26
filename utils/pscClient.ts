import path from 'path'
import { loadSync } from '@grpc/proto-loader'
import { credentials, loadPackageDefinition } from '@grpc/grpc-js'

// 1. proto 文件路径
const PROTO_PATH = path.resolve(process.cwd(), 'protos/psc.proto')

// 2. 使用 proto-loader 同步加载
const packageDefinition = loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

// 3. 根据定义生成包
const grpcObject: any = loadPackageDefinition(packageDefinition)

// 4. 取出 PSC 服务（package=plantStationControl）
const PSC = grpcObject.plantStationControl.PSC

// 5. 创建并导出一个客户端实例，指向远程服务器
export const pscClient = new PSC(
    '192.168.136.129:50059',
    // '219.216.65.200:50059',
    credentials.createInsecure(),
)

