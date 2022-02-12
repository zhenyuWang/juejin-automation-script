const dotEnv = require('dotEnv')
dotEnv.config('./env')

const { COOKIE, TOKEN, SendKey } = require('./utils/config.js')
const sendMessage = require('./utils/message')
const juejin = require('./api/juejin')
const dig = require('./api/dig')
const jwt = require('jsonwebtoken')
const digInitData = require('./data/digInitData.json')

if (!COOKIE) {
  sendMessage(SendKey, '掘金自动化脚本失败', '获取cookie失败，请检查设置')
} else {
  async function junJin() {
    try {
      // 签到
      await juejin.signIn()
      // 抽奖
      const lotteryDrawRes = await juejin.lotteryDraw(),
        dipParams = { lottery_history_id: '7057392414754865156' },
        // dipParams = { lottery_history_id: '7057551468475187203' },
        // 沾喜气
        dipResult = await juejin.dipLucky(dipParams)
      sendMessage(
        SendKey,
        '掘金签到+抽奖成功',
        `抽奖成功，获得：${lotteryDrawRes.lottery_name}; 获取幸运点${dipResult.dip_value}, 当前幸运点${dipResult.total_value}`
      )
    } catch (e) {
      message(SendKey, '掘金签到+抽奖失败', `有异常，请手动操作,${e.message}`)
    }
  }
  junJin()
}

let juejinUid = ''

if (!(COOKIE && TOKEN)) {
  message(SendKey, '掘金挖矿失败', '获取cookie或者token失败，请检查设置')
} else {
  // 初始化信息
  let gameId = '',
    deep = 0,
    todayDiamond = 0,
    todayLimitDiamond = 0
  async function getInfo() {
    const time = new Date().getTime()
    const userInfo = await dig.getUser()
    juejinUid = userInfo.user_id

    const resInfo = await dig.getInfo(juejinUid, time)
    deep = resInfo.gameInfo ? resInfo.gameInfo.deep : 0
    gameId = resInfo.gameInfo ? resInfo.gameInfo.gameId : 0
    todayDiamond = resInfo.userInfo.todayDiamond || 0
    todayLimitDiamond = resInfo.userInfo.todayLimitDiamond
    return Promise.resolve(resInfo)
  }
  getInfo().then(() => {
    if (todayDiamond < todayLimitDiamond) {
      playGame().then(() => {})
    }
  })

  // 暂停，避免快速请求以及频繁请求
  async function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }
  /**
   * 循环游戏
   */
  async function playGame() {
    try {
      // 开始
      const startTime = new Date().getTime()
      const startParams = {
        roleId: 3
      }
      const startData = await dig.start(startParams, juejinUid, startTime)
      await sleep(3000)
      console.log('startData', startData)
      gameId = startData.gameId
      // 发起指令
      const commandTime = +new Date().getTime()
      const xGameId = getXGameId(gameId)
      const commandData = await dig.command(digInitData, juejinUid, commandTime, xGameId)
      deep = commandData.curPos.y
      await sleep(3000)
      console.log('commandData', commandData)
      // 结束
      const overTime = +new Date().getTime()
      const overParams = {
        isButton: 1
      }
      const overData = await dig.over(overParams, juejinUid, overTime)
      await sleep(3000)
      console.log('overData', overData)
      deep = overData.deep
      // 更换地图
      const mapTime = +new Date().getTime()
      if (deep < 500) {
        await sleep(3000)
        await dig.freshMap({}, juejinUid, mapTime)
      }
      await sleep(3000)
      await getInfo().then((res) => {
        if (todayDiamond < todayLimitDiamond) {
          playGame()
        } else {
          message(
            `今日限制矿石${res.userInfo.todayLimitDiamond},已获取矿石${res.userInfo.todayDiamond}`
          )
        }
      })
    } catch (e) {
      console.log(e)
      await sleep(3000)
      // 结束
      const overTime = +new Date().getTime()
      const overParams = {
        isButton: 1
      }
      await dig.over(overParams, juejinUid, overTime)
      await sleep(3000)
      await getInfo().then((res) => {
        if (todayDiamond < todayLimitDiamond) {
          playGame()
        } else {
          message(
            `今日限制矿石${res.userInfo.todayLimitDiamond},已获取矿石${res.userInfo.todayDiamond}`
          )
        }
      })
    }
  }
  function getXGameId(id) {
    const time = +new Date().getTime()
    return jwt.sign(
      {
        gameId: id,
        time: time
        // eslint-disable-next-line max-len
      },
      '-----BEGIN EC PARAMETERS-----\nBggqhkjOPQMBBw==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIDB7KMVQd+eeKt7AwDMMUaT7DE3Sl0Mto3LEojnEkRiAoAoGCCqGSM49\nAwEHoUQDQgAEEkViJDU8lYJUenS6IxPlvFJtUCDNF0c/F/cX07KCweC4Q/nOKsoU\nnYJsb4O8lMqNXaI1j16OmXk9CkcQQXbzfg==\n-----END EC PRIVATE KEY-----\n',
      {
        algorithm: 'ES256',
        expiresIn: 2592e3,
        header: {
          alg: 'ES256',
          typ: 'JWT'
        }
      }
    )
  }
}
