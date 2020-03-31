# forum-scripts


## autoscripts
> 这里是四个脚本，主要用于自动发帖，自动高亮，自动回复，自动发豆
> 
> 事实上只是为了简化平时手动的操作才写的

* `checkin.js` 自动发帖(签到帖)
* `highlight.js` 自动高亮(签到帖)
* `getbingurl.js` 自动回帖(我个人置顶的论坛必应壁纸贴)
* `givebonus.js` 自动发豆(对签到帖在每天固定时刻发送魔力豆)

> 其余详细代码介绍写在注释

### 运行

```bash
# Clone
git clone https://github.com/ajycc20/forum-scripts.git

# Install
npm install or yarn

# Setting
填写 cookie 

# Start
node index.js
```

## scripts

> 用于存放部分需要手动执行的脚本

### locktopic.js
> 对当前页面所有未锁定的帖子进行锁帖操作

#### 运行
```bash
# Setting
填写 cookie
填写 forumurl

#Start
node locktopic
```