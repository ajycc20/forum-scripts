const superagent = require('superagent') // 引入superagent
const dayjs = require('dayjs') // 引入dayjs

let cookie = '' // 这里填写NY的cookie
let bingApiUrl = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1' // Bing 官方api

let bodyText = ''

/**
 * @description 构造发布的bodyText
 * @returns 
 */
function setBodyText() {
  return superagent
  .get(bingApiUrl)
  .then(res => {
    let bingJson = eval('(' + res.text + ')')
    let bingUrl = `cn.bing.com${bingJson.images[0].url}`
    let copyright = bingJson.images[0].copyright

    bodyText = `[quote=${copyright}]${bingUrl}[/quote][img]https://${bingUrl}[/img]`
  })
}

/**
 * @description 触发提交，进行签到发布
 * @param {string} bodyText
 * @returns 
 */
function newPost(bodyText) {
  const jsonstr = {
    id: '6971',
    type: 'reply',
    body: bodyText
  }

  return superagent
    .post('https://nanyangpt.com/forums.php?action=post')
    .set({
      'Cookie': cookie
    })
    .type('form')
    .send(jsonstr)
}

/**
 * @description running func
 */
var running = function() {
  var datetime = dayjs().format('YYYY-MM-DD HH:mm:ss')

  setBodyText().then( _ =>{
  }).then( _ => {
    console.log('==========================程序开始执行==========================\n')
    console.log('--------------------------开始发布必应--------------------------')
    console.log(bodyText)
    
    newPost(bodyText)
    .then(res => {
      console.log('statusCode: ', res.statusCode)
      console.log('当前时间', datetime)
      console.log('--------------------------必应发布完毕--------------------------')
      console.log('==========================程序执行完毕==========================\n')
    })
    .catch(err => {
      console.log(err)
    })
  })
}

module.exports = running
