const dotEnv = require('dotEnv')
dotEnv.config('./env')

const juejin = require('../src/api/juejin')

juejin
  .dipLucky({ lottery_history_id: '7057392414754865156' })
  .then((data) => {
    console.log('daya', data)
  })
  .catch((e) => {
    console.log('e', e)
  })
