const dotEnv = require('dotEnv')
dotEnv.config('./env')
const dig = require('../src/api/dig')

dig
  .getUser()
  .then((data) => {
    console.log('daya', data.user_id)
  })
  .catch((e) => {
    console.log('e', e)
  })
