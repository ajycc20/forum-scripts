const superagent = require('superagent')
const dayjs = require('dayjs')

let cookie = '' // 这里填写NY的cookie
let bingApiUrl = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1' // 必应api
let date = '' // 签到帖标题 时间 全局变量

let title = '' // 签到帖标题 全局变量
let bodyText = '' // 签到帖正文 全局变量


/**
 * @description 构造发布的title
 * @returns 
 */
function setTitle() {
  return superagent
  .get('https://v1.hitokoto.cn/') // 一言api
  .then(res => {
    let json = eval('(' + res.text + ')') // json对象化

    // 鉴于论坛要求每周五标题固定做的判断
    title = (dayjs().day() === 5) ? '[每周五固定主题 ' + date + '] 本周最开心的事情是什么？' : ('[每日签到 ' + date + '] ' + json.hitokoto)
  })
}
/**
 * @description 构造发布的bodyText
 * @returns 
 */
function setBodyText() {
  return superagent
  .get(bingApiUrl)
  .then(res => {
    let bingJson = eval('(' + res.text + ')')
    let bingUrl = 'cn.bing.com' + bingJson.images[0].url // 构造完整的必应壁纸url
    let copyright = bingJson.images[0].copyright // 获取到copyright参数

    // 拼接帖子主体信息
    let textBing = '[size=4][color=DarkOrange]' + date + '，今天的bing背景Url是[/color][/size][quote=' + copyright + ']' + bingUrl + '[/quote]'
    bodyText = textBing + '[img]https://' + bingUrl + '[/img]'
  })
}

/**
 * @description 触发提交，进行签到发布
 * @param {string} title
 * @param {string} bodyText
 * @returns 
 */
function newPost(title, bodyText) {

  /** id是帖子分区  签到帖分区url中  forumid为8
   *  type=new  表示新发布
   *  subject 这里填写获取到的title
   *  body  即主体信息
   */
  const jsonstr = {
    id: '8',
    type: 'new',
    subject: title,
    body: bodyText
  }

  return superagent
    .post('https://nanyangpt.com/forums.php?action=post')
    .set({
      'Cookie': cookie
    })
    .type('form') // 通过form格式提交
    .send(jsonstr)
}

/**
 * @description running func
 */
var running = function() {
  let datetime = dayjs().format('YYYY-MM-DD HH:mm:ss') // 发帖执行时间
  date = dayjs().format('YYYY-MM-DD')
  
  setTitle().then( _ =>{
    setBodyText().then( _ =>{
    }).then( _ => {
      
      // 网站限制标题长度
      if (title.length > 42) {
        running()
      } else {
        console.log('==========================程序开始执行==========================\n')
        console.log('--------------------------开始执行发帖--------------------------')
        console.log(title)
        console.log(bodyText)

        newPost(title, bodyText)
        .then(res => {
          console.log('statusCode: ', res.statusCode)
          console.log('当前时间', datetime)
          console.log('--------------------------发帖执行完毕--------------------------\n')
          console.log('==========================程序执行完毕==========================')
        })
        .catch(err => {
          console.log(err)
        })
      }
    })
  })
}

module.exports = running
