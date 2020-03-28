const superagent = require('superagent')
const dayjs = require('dayjs')

let cookie = ''

// 这里action 为viewforum
let forumUrl = 'https://nanyangpt.com/forums.php?action=viewforum&forumid=8' // 正确的分区url

let topicId = '' // 帖子编号 全局变量
/**
 * @description 通过superagent获取该分区所有帖子链接，通过正则获取到最终的帖子url 最终获取到帖子id
 * @param {string} forumUrl
 * @returns 
 */
function getTopicId(forumUrl) {
  return superagent
    .get(forumUrl) // 这里需要基于发布获取链接分析url
    .set({
      'Cookie': cookie
    })
    .then(res => {
      // console.log(res.status)
      let rePage = /<a href="\?.+?(\d+).+?(\d+).+?>\[.+(\d{4}-\d{2}-\d{2}\])/gm // 这里是抓取全文匹配到该页面所有签到帖
      let arrCheckinLink = res.text.match(rePage) // 存放所有签到帖的数组

      let datetime = dayjs().format('YYYY-MM-DD') // 当天的日期 用以匹配帖子标题

      let patt = new RegExp(datetime) // reg化
      let arrPatt = arrCheckinLink.map(val => patt.test(val)) // 模式匹配后的数组

      let d = arrPatt.indexOf(true) // 找到正确的url索引

      let reUrl = /<a href="\?.+?(\d+).+?(\d+).+?>\[.+(\d{4}-\d{2}-\d{2}\])/
      topicId = arrCheckinLink[d].match(reUrl)[2] // 取出正确的帖子id
    })
    .catch(err => {
      console.log(err)
    })
}

function setHighlight(topicId) {
  const jsonstr = {
    color: '7',
    returnto: '/forums.php?action=viewtopic&topicid=' + topicId
  }

  return superagent
    .post('https://nanyangpt.com/forums.php?action=hltopic&topicid=' + topicId)
    .set({
      'Cookie': cookie
    })
    .type('form')
    .send(jsonstr)
}

var running = function() {
  let endtime = dayjs().format('YYYY-MM-DD HH:mm:ss') // 高亮执行时间

  getTopicId(forumUrl).then( _ => {
    console.log('==========================程序开始执行==========================\n')
    console.log('--------------------------开始执行高亮--------------------------')
    console.log('帖子id：', topicId)
    setHighlight(topicId)
      .then(res => {
        console.log('statusCode: ', res.statusCode)
        console.log('当前时间', endtime)
        console.log('--------------------------高亮执行完毕--------------------------')
        console.log('==========================程序执行完毕==========================\n')
    })
    .catch(err => {
      console.log(err)
    })
  })
  .catch(err => {
    console.log(err)
  })
}

module.exports = running
