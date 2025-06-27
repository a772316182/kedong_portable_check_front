import { pscClient } from '../../utils/pscClient'

// 测试NetConfig - 添加网络配置
function testAddNetworkConfig() {
  return new Promise((resolve, reject) => {
    pscClient.NetConfig({
      sendType: 0x01,
      stationId: "ea4da72ca134",  // 厂站ID
      secArea: "1002",
      nets: [{
        indexId: "1750587105589560",
        devIp: "192.168.79.19",
        netItemId: '1',
        netItemRe: "A网",
        subnetMask: "192.168.79.1-254"
      }]
    }, (err: any, resp: any) => {
      if (err) {
        console.error('添加网络配置失败:', err)
        return reject(err)
      }
      console.log('添加网络配置成功:', resp)
      resolve(resp)
    })
  })
}

// 测试NetConfig - 删除网络配置
function testDeleteNetworkConfig() {
  return new Promise((resolve, reject) => {
    pscClient.NetConfig({
      sendType: 0x02,
      stationId: "ea4da72ca134",  // 厂站ID
      secArea: "1002",
      nets: [{
        indexId: "1750902869852416",
        devIp: "192.168.79.19",
        netItemId: '1',
        netItemRe: "A网",
        subnetMask: "192.168.79.1-254"
      }]
    }, (err: any, resp: any) => {
      if (err) {
        console.error('删除网络配置失败:', err)
        return reject(err)
      }
      console.log('删除网络配置成功:', resp)
      resolve(resp)
    })
  })
}

// 测试NetConfig - 修改网络配置
function testUpdateNetworkConfig() {
  return new Promise((resolve, reject) => {
    pscClient.NetConfig({
      sendType: 0x03,
      stationId: "ea4da72ca134",  // 厂站ID
      secArea: "1002",
      nets: [{
        indexId: "1750587105589560",
        devIp: "192.168.79.20", // 修改后的IP
        netItemId: '1',
        netItemRe: "A网(已修改)", // 修改后的描述
        subnetMask: "192.168.79.1-254"
      }]
    }, (err: any, resp: any) => {
      if (err) {
        console.error('修改网络配置失败:', err)
        return reject(err)
      }
      console.log('修改网络配置成功:', resp)
      resolve(resp)
    })
  })
}

// 测试NetConfig - 从扫描结果添加子网
function testAddSubnetsFromScan() {
  return new Promise((resolve, reject) => {
    pscClient.NetConfig({
      sendType: 0x08,
      stationId: "ea4da72ca134",  // 厂站ID
      secArea: "1002",
      nets: [{
        indexId: "",  // 新添加的可以不指定indexId
        devIp: "192.168.80.19",
        netItemId: '2',
        netItemRe: "B网",
        subnetMask: "192.168.80.1-254"
      }]
    }, (err: any, resp: any) => {
      if (err) {
        console.error('从扫描结果添加子网失败:', err)
        return reject(err)
      }
      console.log('从扫描结果添加子网成功:', resp)
      resolve(resp)
    })
  })
}

// 测试ListNetworkConfigsByArea - 列出网络配置
function testListNetworkConfigs() {
  return new Promise((resolve, reject) => {
    pscClient.ListNetworkConfigsByArea({
      stationId: "ea4da72ca134",  // 厂站ID
      secArea: "1002",
      network_type_id: "1"  // 网络类型ID
    }, (err: any, resp: any) => {
      if (err) {
        console.error('列出网络配置失败:', err)
        return reject(err)
      }
      console.log('列出网络配置成功:', resp)
      resolve(resp)
    })
  })
}

// 执行测试
async function runTests() {
  try {
    // 1. 列出当前网络配置
    console.log('=== 测试列出网络配置 ===')
    await testListNetworkConfigs()
    
    // 2. 添加网络配置
    console.log('\n=== 测试添加网络配置 ===')
    const addResult: any = await testAddNetworkConfig()
    
    if (addResult && addResult.retNum === 0) {
      // 3. 修改网络配置
      console.log('\n=== 测试修改网络配置 ===')
      await testUpdateNetworkConfig()
      
      // 4. 从扫描结果添加子网
      console.log('\n=== 测试从扫描结果添加子网 ===')
      await testAddSubnetsFromScan()
      
      // 5. 列出当前网络配置（查看修改结果）
      console.log('\n=== 测试列出修改后的网络配置 ===')
      await testListNetworkConfigs()
      
    //   // 6. 删除网络配置
    //   console.log('\n=== 测试删除网络配置 ===')
    //   await testDeleteNetworkConfig()
    //   await testDeleteNetworkConfig()
    }
    // await testDeleteNetworkConfig()
    
    console.log('\n所有测试完成')
  } catch (error) {
    console.error('测试过程中出现错误:', error)
  }
}

// 导出测试函数，可以在需要时单独调用
export {
  testAddNetworkConfig,
  testDeleteNetworkConfig,
  testUpdateNetworkConfig,
  testAddSubnetsFromScan,
  testListNetworkConfigs,
  runTests
}

// 直接运行所有测试
runTests(); 