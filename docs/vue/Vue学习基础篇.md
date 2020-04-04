---
navbar: true
sidebar: auto
title: Vue基础篇
---

# 开始学习

::: warning
这是黄色的提示
:::

## 大版本

@vue/cli 脚手架版本 4.2.3

vue版本 2.6.10



## 关键词

`<keep-alive>`：它是vue内置的，用来保存页面缓存，也就是第一次页面加载后，再次来访问这个页面，不用再去重复加载了，这意味着父级路由下面的所有子路由页面都不需要反复加载

`v-if`：它是在标签中使用的，它在执行隐藏标签时，是不渲染这个标签

`v-show`：它也是在标签中使用，相对于`v-if`它在执行隐藏标签时，只是在标签里加上了display:none的style的样式属性，但是它还会渲染这个标签

`v-solt`：作用域插槽，主要作用是可以获取到插槽作用域的值，在element-UI中的table，每个table-column作用域的值是{ row, column, $index }，所以我们可以拿到row，也就是这一行的所有字段的值



## 网页样式

### 居中大法

```less
.login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
```

### 全屏大法

```less
/* 全局css样式 */
html,
body,
#app {
    height: 100%;
}

* {
    margin: 0;
    padding: 0;
}

.el-container {
  height: 100%;
}
```

### Element-UI左侧菜单优化

```less
.el-aside {
  .el-menu {
    // 修复左侧菜单栏右边框显示不平整
    border-right: none;
  }
}
```



## Vue生命周期

### beforeCreate

特点：

- 数据模型未加载

- 方法未加载

- html模板未加载



### created

特点：

- 数据模型已加载

- 方法已加载

- html模板已加载

- html模板未渲染



### beforeMount

特点：

- 数据模型已加载
- 方法已加载
- html模板已加载
- html模板未渲染



### mounted

特点：

- 数据模型已加载
- 方法已加载
- html模板已加载
- html模板已渲染



### beforeUpdate

特点：

- 数据模型已加载
- 方法已加载
- html模板已加载
- html模板已渲染
- 数据模型已更新
- html模板未更新



### updated

特点：

- 数据模型已加载
- 方法已加载
- html模板已加载
- html模板已渲染
- 数据模型已更新
- html模板已更新



### 例子演示

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.bootcss.com/vue/2.6.11/vue.min.js"></script>
    <title>index</title>
</head>

<body>
    <div id="app">
        <p id="num">电池价格：{{dc}} 数量：{{dcNum}} <button @click="dcAdd">电池++</button></p>
        <p>电视价格：{{ds}} 数量：{{dsNum}} <button @click="dsAdd">电视++</button></p>
        <p>总价：{{sumPrice}}</p>
    </div>
    <script>
        var vm = new Vue({
            el: '#app',
            data() {
                return {
                    dc: 5,
                    dcNum: 0,
                    ds: 2000,
                    dsNum: 0,
                }
            },
            beforeCreate() {
                console.log("===beforeCreate===")
                console.log('===vue实例创建前===')
                console.log("数据模型未加载", this.dcNum)
                console.log("方法未加载", this.show())
                console.log("html模板未加载", document.getElementById("num"))
            },
            created() {
                console.log("===created===")
                console.log('===vue实例创建成功===')
                console.log("数据模型已加载", this.dcNum)
                console.log("方法已加载", this.show())
                console.log("html模板已加载", document.getElementById("num"))
                console.log("html模板未渲染", document.getElementById("num").innerText)
            },
            beforeMount() {
                console.log("===beforeMount===")
                console.log('===vue实例挂载到文档前===')
                console.log("数据模型已加载", this.dcNum)
                console.log("方法已加载", this.show())
                console.log("html模板已加载", document.getElementById("num"))
                console.log("html模板未渲染", document.getElementById("num").innerText)
            },
            mounted() {
                console.log("===mounted===")
                console.log('===vue实例挂载到文档的元素上===')
                console.log("数据模型已加载", this.dcNum)
                console.log("方法已加载", this.show())
                console.log("html模板已加载", document.getElementById("num"))
                console.log("html模板已渲染", document.getElementById("num").innerText)
            },
            beforeUpdate() {
                console.log("===beforeUpdate===")
                console.log("数据模型已加载", this.dcNum)
                console.log("方法已加载", this.show())
                console.log("html模板已加载", document.getElementById("num"))
                console.log("html模板已渲染", document.getElementById("num").innerText)
                console.log("数据模型已更新", this.dcNum)
                console.log("html模板未更新", document.getElementById("num").innerText)
            },
            updated() {
                console.log("===updated===")
                console.log("数据模型已加载", this.dcNum)
                console.log("方法已加载", this.show())
                console.log("html模板已加载", document.getElementById("num"))
                console.log("html模板已渲染", document.getElementById("num").innerText)
                console.log("数据模型已更新", this.dcNum)
                console.log("html模板已更新", document.getElementById("num").innerText)
            },
            methods: {
                show() {
                    return this.dcNum
                },
                dcAdd() {
                    this.dcNum++
                },
                dsAdd() {
                    this.dsNum++
                }
            }
        })
    </script>
</body>
</html>
```





##  Vue使用axios

### axios拦截器

#### axios的粗暴用法

- 安装axios

```bash
npm install -S axios
```

- 在Vue入口文件main.js中加入

```js
import axios from 'axios'

axios.interceptors.request.use(config => {
  //从sessionStorage中拿到token,在请求头上加入Authorization属性值为token，
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config;
})
Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
```

- 调用接口

```js
//只能用this.$http.get调用
methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res.data)
    }
  }
```



#### axios的推荐用法

> 说明：

结合vue-axios使用，vue-axios是将axios集成到Vue.js的小包装器，可以像插件一样进行安装，使用 Vue 的插件写法，更符合 Vue 整体生态环境。直接写原型链，感觉有些粗暴了，除非是很底层的实现，否则不太推荐这样写了

- 安装axios和vue-axios

```bash
npm install -S axios vue-axios
```

- 在Vue入口文件main.js中加入

```js
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
axios.interceptors.request.use(config => {
  //从sessionStorage中拿到token,在请求头上加入Authorization属性值为token，
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config;
})
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
```

- 调用接口

支持this.$http，同时还支持使用this.axios

```js
//方法一
methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res.data)
    }
  }

//方法二
methods: {
    async getUserList() {
      const { data: res } = await this.axios.get('users', {
        params: this.queryInfo
      })
      console.log(res.data)
    }
  }
```



## Vue使用vue-router路由

### 全局路由守卫

在将router导出之前，设置全局路由守卫

```js
// 挂载全局路由导航守卫
// to：将要访问的路径
// from: 代表从哪个路径跳转而来
// next: 是一个函数，表示放行
// next() 放行 next('/login') 强制跳转
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
        return next('/login')
    } else {
        next()
    }
})

export default router
```



### 路由中redirect用法

redirect有四种用法：

用法一：

redirect: '/weclome'

用法二：(命名路由)

redirect:  { name: 'welcome' }

用法三：(这种用法的使用场景是，可以通过在函数内判断，然后再跳转)

redirect: to => { return { name: 'welcome'} }

用法四：

redirect: to **=>** { return ‘/weclome’ }

es6语法，如果只有一个return，那么可以简写为下面写法

redirect: to **=>** '/welcome'

```js
const routes = [{
    path: '/home',
    name: 'home',
    redirect: to => '/welcome',
    component: Home,
    children: [{
        path: '/welcome',
        name: 'welcome',
        component: Welcome
    }]
```



### 路由别名用法

别名可以让我们访问别名的效果和访问原路径效果一样

例如：

我们访问http://localhost:9999/weclomeAlias和我们访问http://localhost:9999/weclome的效果一样

我们访问http://localhost:9999/homePage和我们访问http://localhost:9999/home的效果一样

```js
const routes = [{
    path: '/home',
    name: 'home',
    alias: '/homePage',
    redirect: to => '/weclomeAlias',
    component: Home,
    children: [{
        path: '/welcome',
        name: 'welcome',
        alias: '/weclomeAlias',
        component: Welcome
    }]
```



### 编程式路由导航

我们可以通过this.$router获取到注册到Vue中的路由实例对象

push进行跳转到指定路径

back可以回退到上一次打开的路径

replace将上次的打开路径替换为当前路径，也就是执行`this.$router.back()`还是会返回到当前路径

```vue
<template>
  <div>
    <h3>Welcome</h3>
    <el-button type="primary" @click="handleRedirect">跳转到user页面</el-button>
    <el-button type="primary" @click="handleBack">返回上一级</el-button>
    <el-button type="primary" @click="handleReplace">replace</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    handleRedirect() {
      this.$router.push('/users')
    },
    handleBack() {
      this.$router.back()
    },
    handleReplace() {
      this.$router.replace('/parent')
    }
  }
}
</script>
```





## vue使用Element-UI

- 使用npm安装Element-UI

```bash
npm install element-ui -S
```

- 在main.js中引入Element-UI和Element-UI样式

```js
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
```

- 使用Element-UI

```vue
<template>
    <div>
        <el-button type="primary">我是第一个按钮</el-button>
        <el-button type="warning">我是第二个按钮</el-button>
    </div>
</template>
```



### breadcrumb面包屑的使用

```vue
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
</template>
```

### card卡片的使用

```vue
<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索框和添加按钮 -->
      <!-- 用户表格 -->
    </el-card>
  </div>
</template>
```

### table表格的使用

```vue
<template>
  <div>
      <!-- 用户表格 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
```

> 说明：

`border`：有边框的table

`strip`：表格换行变色

`<el-table-column type="index" label="序号"></el-table-column>`：设置序号列，序号从1开始自增



### form表单使用

```vue
<template>
  <div>
<!-- 登录表单 -->
      <el-form :model="loginForm" :rules="rules" class="login_form" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginFormRef')" style="width:100%">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetForm('loginFormRef')" style="width:100%">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '后台管理系统',
      // 表单的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      console.log(this)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('login', this.loginForm)
          console.log(res)
          if (res.meta.status === 200) {
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          } else {
            this.$message({
              message: '登录失败',
              type: 'error'
            })
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
```

> 说明：

`:model="loginForm"`：是将表单绑定到了loginFrom对象

`prop`：对应rules对象中的字段

`:rules="rules"`：定义数据校验规则

`ref="loginFormRef"`：定义ref名称，可以通过this.$refs获取form表单

`window.sessionStorage.setItem('token', res.data.token)`：向sessionStorage存token



python server.py -p 2333 -k 225010wu -m aes-256-cfb -O origin -o plain