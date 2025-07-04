import {loadSync, type PackageDefinition} from '@grpc/proto-loader'
import {credentials, loadPackageDefinition} from '@grpc/grpc-js'
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';
import {cwd} from 'process';

// Helper to build path relative to the current environment
const getProtoPath = (filename: string): string => {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    console.log("当前工作目录: " + cwd());
    console.log("当前执行文件所在的目录: " + __dirname);
    console.log("当前执行文件: " + __filename)
    console.log("文件路径: " + resolve("public/protos/"))

    return resolve(`protos/${filename}`)
}

// 1. proto 文件路径
const PROTO_PATH: string = getProtoPath('psc.proto')

// 2. 使用 proto-loader 同步加载
const packageDefinition: PackageDefinition = loadSync(PROTO_PATH, {
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
    '47.93.158.28:8092',
    // '192.168.136.129:50059',
    // '219.216.65.200:50059',
    credentials.createInsecure(),
)

// --- Example Service Client ---
// 1. example.proto 文件路径
const EXAMPLE_PROTO_PATH = getProtoPath('example.proto')

// 2. 使用 proto-loader 同步加载 example.proto
const examplePackageDefinition = loadSync(EXAMPLE_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

// 3. 根据定义生成包
const exampleGrpcObject: any = loadPackageDefinition(examplePackageDefinition)

// 4. 取出 ExampleService 服务 (package=example)
const ExampleService = exampleGrpcObject.example.ExampleService

// 5. 创建并导出另一个客户端实例，指向其服务地址
// 注意：这里的地址和端口 '192.168.136.129:50060' 是一个示例，你需要根据实际情况修改
export const exampleClient = new ExampleService(
    '192.168.136.129:50053',
    // '219.216.65.200:50053',
    credentials.createInsecure(),
)

