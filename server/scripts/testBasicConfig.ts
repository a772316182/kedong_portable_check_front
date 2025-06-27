import { pscClient } from '../../utils/pscClient'

// 测试添加厂站
function testAddStation() {
  return new Promise((resolve, reject) => {
    pscClient.BasicMessage({
      sendType: 0x01,
      province: "云南省",
      city: "昆明",
      manufactor: "hhhhh",
      stationName: "220kv云南省",
      stationId: "e9dfgdf2sdf",
      stationType: "发电厂",
      voltagelevel: "110kv",
      drawTuoPu: true
    }, (err: any, resp: any) => {
      if (err) {
        console.error('添加厂站失败:', err)
        return reject(err)
      }
      console.log('添加厂站成功:', resp)
      resolve(resp)
    })
  })
}

// 测试获取厂站信息
function testGetStation(stationId: string) {
  return new Promise((resolve, reject) => {
    pscClient.BasicMessage({
      sendType: 0x02,
      stationId
    }, (err: any, resp: any) => {
      if (err) {
        console.error('获取厂站信息失败:', err)
        return reject(err)
      }
      console.log('获取厂站信息成功:', resp)
      resolve(resp)
    })
  })
}

// 测试更新厂站信息
function testUpdateStation(stationInfo: any) {
  return new Promise((resolve, reject) => {
    pscClient.BasicMessage({
      sendType: 0x03,
      ...stationInfo
    }, (err: any, resp: any) => {
      if (err) {
        console.error('更新厂站信息失败:', err)
        return reject(err)
      }
      console.log('更新厂站信息成功:', resp)
      resolve(resp)
    })
  })
}

// 测试删除厂站
function testDeleteStation(stationId: string) {
  return new Promise((resolve, reject) => {
    pscClient.BasicMessage({
      sendType: 0x04,
      stationId
    }, (err: any, resp: any) => {
      if (err) {
        console.error('删除厂站失败:', err)
        return reject(err)
      }
      console.log('删除厂站成功:', resp)
      resolve(resp)
    })
  })
}

// 执行测试
async function runTests() {
  try {
    // 1. 添加厂站
    console.log('=== 测试添加厂站 ===')
    const addResult: any = await testAddStation()
    
    if (addResult && addResult.retNum === 0) {
      const stationId = 'e9dfgdf2sdf' // 这里使用添加时的stationId
      
      // 2. 获取厂站信息
      console.log('\n=== 测试获取厂站信息 ===')
      const getResult: any = await testGetStation(stationId)
      
      if (getResult && getResult.retNum === 0) {
        // 3. 更新厂站信息
        console.log('\n=== 测试更新厂站信息 ===')
        const updateInfo = {
          stationId,
          stationName: '220kv云南省(已更新)',
          manufactor: 'updated-manufactor'
        }
        await testUpdateStation(updateInfo)
      }
      
      // 4. 删除厂站
      console.log('\n=== 测试删除厂站 ===')
      await testDeleteStation(stationId)
    }
    
    console.log('\n所有测试完成')
  } catch (error) {
    console.error('测试过程中出现错误:', error)
  }
}

// 导出测试函数，可以在需要时单独调用
export {
  testAddStation,
  testGetStation,
  testUpdateStation,
  testDeleteStation,
  runTests
}

// 直接运行所有测试
runTests(); 