---
sidebar: auto
---

#  node中的鉴权

## 1.新建node项目

- 安装express

```bash
# 新建文件夹
mkdir node-auth
# cd到文件夹
cd node-auth
# 初始化node项目
npm init -y
# 安装express
npm install express --save
```



- 安装basic-auth

```bash
npm install basic-auth --save
```



/node-auth

```json
{
  "name": "node-auth",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "basic-auth": "^2.0.1",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1"
  }
}
```





## 2. 鉴权

### 1. basic

/node-auth/index.js

```js
const express = require('express')
const app = express()
const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

app.get('/basic', function(req, res) {
    let user = basicAuth(req)
    console.log(user)
  	//这里写死，正常需要查询数据库
    if (user && user.name === 'admin' && user.pass === 'admin') {
        res.send('认证成功')
    } else {
        res.sendStatus(401)
    }
})
```

> 优点：
>
> 1.不需要存储，节省内存和cpu资源
>
> 2.对分布式项目友好，不需要特别处理（分布式中session就需要处理）
>
> 缺点：
>
> 每次都需要请求数据库，对数据库资源消耗较多



### 2. JWT

- 安装jsonwebtoken

```bash
npm install jsonwebtoken --save
```



/node-auth/index.js

```js
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const secret = '123456'
app.get('/bearer-login', function(req, res) {
    let token = jwt.sign({ username: 'admin' }, secret);
    let username = req.query.username
    let password = req.query.password
    if (username === 'admin' && password === 'admin') {
        res.status(200).json({ code: 200, msg: '认证成功', token: token })
    } else {
        res.status(401).json({ code: 401, msg: '您无权访问' })
    }
})

app.get('/bearer', function(req, res) {
    let token = req.headers.authorization.split(' ')[1]

    try {
        let decoded = jwt.verify(token, secret);
        if (decoded) {
            res.status(200).json({ code: 200, msg: '请求接口成功' })
        }
    } catch (e) {
        res.status(401).json({ code: 401, msg: '您无权访问' })
    }

})

app.listen(3000)
console.log('服务器启动了。。。')
```

> 优点：
>
> 1.不需要存储，节省内存和cpu
>
> 2.对分布式项目友好，不需要特殊处理（分布式中session就需要处理）
>
> 3.不用每次都去查数据库，节省数据库资源

