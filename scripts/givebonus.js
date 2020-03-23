const superagent = require('superagent')
const dayjs = require('dayjs')

let cookie = '' // 这里填写NY的cookie

// 这里action 为viewforum
let forumUrl = 'https://nanyangpt.com/forums.php?action=viewforum&forumid=8' // 正确的分区url

let count = '' // 楼层数 全局变量
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

/**
 * @description 获取发豆机所需楼层个数
 * @param {string} idUrl 6点发帖后的帖子url
 * @returns 
 */
function getNumOfRe(idUrl) {
  return superagent
  .get(idUrl) // 这里需要基于发布获取链接分析url
  .set({
    'Cookie': cookie
  })
  .then(res => {
    let reCount = /(document.getElementById\(\"numofpost\"\)\.value.{4})(\d+)/
    count = res.text.match(reCount)[2] // 这里基于正则从全文获取到 应该发豆的楼层个数
  })
  .catch(err => {
    console.log(err)
  })
}

/**
 * @description 在固定的时间执行用于给所确定的帖子发豆
 * @returns 
 */
function setBonus(count, topicId) {
  const jsonstr = {
    geshu: count, // 发豆楼层   待获取 done
    unrepeat: 'on',
    jine: '100', // 发豆个数  一般100  发豆机
    rewardtype: 'normal',
    topicid: topicId
  }

  return superagent
    .post('https://nanyangpt.com/easyreward.php')
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
  let endtime = dayjs().format('YYYY-MM-DD HH:mm:ss') // 发豆执行时间

  getTopicId(forumUrl).then( _ => {
    console.log('==========================程序开始执行==========================\n')
    console.log('--------------------------开始执行发豆--------------------------')
    // topicUrl   这里action 为viewtopic  
    let topicUrl = 'https://nanyangpt.com/forums.php?action=viewtopic&forumid=8&topicid=' + topicId
    getNumOfRe(topicUrl).then( _ => {
      console.log(count, '楼层数')
      console.log(topicId, '帖子id')
      setBonus(count, topicId)
        .then(res => {
          console.log('statusCode: ', res.statusCode)
          console.log('当前时间', endtime)
          console.log('--------------------------发豆执行完毕--------------------------')
          console.log('==========================程序执行完毕==========================\n')
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
  })
}

module.exports = running
