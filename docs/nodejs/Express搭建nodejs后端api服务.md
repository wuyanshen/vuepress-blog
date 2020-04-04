---
sidebar: auto
---

# Express搭建nodejs后端api服务

## 1. 初始化项目

- 创建项目文件夹

```bash
mkdir node_back
```

- cd到node_back使用npm初始化项目

```bash
cd node_back

npm init

# ...根据自己需求添写，也可以一路回车
```

- 安装express

```bash
npm install -D express
```

- 创建/src/main.js

```js
const app = require('express')()
const router = require('./api/user.js')
const port = 3000

app.listen(port)
app.use(router)

console.log(`node后端服务器启动成功，监听端口:${port}`)
```

- 在package.json中，将scripts中加入一条`"dev": "node ./src/main.js"`

```json
{
    "name": "node_back",
    "version": "1.0.0",
    "description": "node_back后端api服务",
    "main": "main.js",
    "scripts": {
        "dev": "node ./src/main.js"
    },
    "author": "wys",
    "license": "ISC",
    "dependencies": {
        "express": "^4.17.1"
    }
}
```



## 2. 创建api接口

- 新建/src/api/user.js

```js
const router = require('express').Router()

//返回用户信息
router.get('/userInfo', (req, res) => {
    res.json({
        code: 200,
        msg: '请求成功',
        data: {
            username: 'jack',
            password: '123456'
        }
    })
})
module.exports = router
```



## 3. 启动项目

在node_back根目录执行启动命令

```bash
npm run dev
```



## 4. 访问api接口

http://localhost:3000/userInfo

结果：

```json
{
	"code": 200,
	"msg": "请求成功",
	"data": {
		"username": "jack",
		"password": "123456"
	}
}
```

