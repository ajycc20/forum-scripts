const superagent = require('superagent')

let cookie = '' // 用户cookie
let forumUrl = '' // 论坛页面url

let arrTopicId = null
/**
 * @description
 * @param {string} forumUrl
 * @returns 
 */
function getIdList(forumUrl) {
  return superagent
    .get(forumUrl) // 这里需要基于发布获取链接分析url
    .set({
      'Cookie': cookie
    })
    .then(res => {
      let regPage = /(unlocked).+\s.*?(\d{4})/gm
      let arr = res.text.match(regPage) // 找到所有未锁定的帖子链接
      let reid = /(\d{4})/ 
      arrTopicId = arr.map(val => val.match(reid)[0]) // 存放所有id
    })
    .catch(err => {
      console.log(err)
    })
}


function newPost(topicId) {
  const jsonstr = {
    topicid: topicId,
    returnto: '/forums.php?action=viewtopic&forumid=33&topicid=' + topicId,
    locked: 'yes'
  }
  
  return superagent
    .post('https://nanyangpt.com/forums.php?action=setlocked')
    .set({
      'Cookie': cookie
    })
    .type('form')
    .send(jsonstr)
}

getIdList(forumUrl)
  .then( () => {
    console.log(arrTopicId)
    arrTopicId.map(val => {
      newPost(val)
        .then(res => {
          console.log(res.statusCode)
        })
    })
  })