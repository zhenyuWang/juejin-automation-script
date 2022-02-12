const request = require('../utils/request')
const { TOKEN, COOKIE } = require('../utils/config.js')
const authorization = TOKEN,
  cookie = COOKIE
module.exports = {
  getUser() {
    return request({
      url: 'https://api.juejin.cn/user_api/v1/user/get',
      method: 'get',
      headers: {
        cookie
      }
    })
  },
  /**
   * 开始
   */
  start(params, uid, time) {
    return request({
      url: `https://juejin-game.bytedance.com/game/sea-gold/game/start?uid=${uid}&time=${time}`,
      method: 'post',
      data: params,
      headers: {
        authorization
      }
    })
  },
  /**
   * 获取游戏info
   */
  getInfo(uid, time) {
    console.log(uid, time)
    return request({
      url: `https://juejin-game.bytedance.com/game/sea-gold/home/info?uid=${uid}&time=${time}`,
      method: 'get',
      headers: {
        authorization
      }
    })
  },
  /**
   * 结束
   */
  over(params, uid, time) {
    return request({
      url: `https://juejin-game.bytedance.com/game/sea-gold/game/over?uid=${uid}&time=${time}`,
      method: 'post',
      data: params,
      headers: {
        authorization
      }
    })
  },
  /**
   * 换图重来
   */
  freshMap(params, uid, time) {
    return request({
      url: `https://juejin-game.bytedance.com/game/sea-gold/game/fresh_map?uid=${uid}&time=${time}`,
      method: 'post',
      data: params,
      headers: {
        authorization
      }
    })
  },
  /**
   * 发布指令
   * @param params
   * @param uid
   * @param time
   * @param xGameId
   * @returns {Promise<unknown>}
   */
  command(params, uid, time, xGameId) {
    return request({
      url: `https://juejin-game.bytedance.com/game/sea-gold/game/command?uid=${uid}&time=${time}`,
      method: 'post',
      data: params,
      headers: {
        authorization,
        'Content-Type': 'application/json;charset=UTF-8',
        'x-tt-gameid': xGameId
      }
    })
  },
  /* 彩蛋 */
  pico(params, uid, time) {
    return request({
      url: `https://juejin-game.bytedance.com/game/sea-gold/game/pico?uid=${uid}&time=${time}`,
      method: 'post',
      data: params,
      headers: {
        authorization,
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  },
  /**
   * 获取记录
   * @param uid
   * @param time
   * @returns {Promise<unknown>}
   */
  recordgetRecord(uid, time) {
    return request({
      url: `https://juejin-game.bytedance.com/game/sea-gold/user/record?uid=${uid}&time=${time}`,
      method: 'get',
      headers: {
        authorization
      }
    })
  }
}
