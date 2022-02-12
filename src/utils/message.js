const axios = require('axios')

module.exports = function sendMessage({ sendKey, title = '掘金自动脚本', content }) {
  return new Promise((resolve, reject) => {
    const option = {
      url: `https://sctapi.ftqq.com/${sendKey}.send`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        title,
        content
      }
    }
    axios(option).then(
      () => {
        resolve()
        console.log('发送成功')
      },
      (err) => {
        reject(err)
      }
    )
  })
}
