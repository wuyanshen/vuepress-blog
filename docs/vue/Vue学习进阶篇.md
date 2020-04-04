---
navbar: true
sidebar: auto
title: 'Vue进阶篇'
---

# 开始学习

## 一. 杂项

## 1. 使用vue-cli脚手架创建项目

```bash
vue create vue-cource
```

## 2. 新建配置文件

在根目录创建.editorconfig

```bash
root = true
[*]
indent_style = tab
indent_size = 2
```

这个文件需要安装`EditorConfig for VS Code`插件生效

## 3.  安装mockjs

```bash
npm install -D mockjs 
```

在根目录新建mock文件夹，文件夹中新建index.js

```js
import Mock from 'mockjs'

export default Mock
```

## 4. module.default和import用法

module.default和import是es6语法

```js
//export.js
function test() {
    console.log('我是export.js')
}

let name = '小红'

module.exports = {
    test,
    name
}

//import.js
import my from './export.js'
my.test()
console.log(my.name)

//test.html
<script src="./import.js" type="module" />
  
//运行test.html
//在调试的console查看
```

vue.config.js中的module.exports是commonJs规范，nodejs使用的是commonJs规范

```js
//a.js
let name = '小红'

function test() {
    console.log('我是a')
}

module.exports = {
    test,
    name
}

//b.js
const a = require('./a')
a.test()
console.log(a.name)

//运行
node b.js
```



## 5. Vue中(vue.config.js)配置

```js
const path = require('path')
const BASE_URL = process.env.NODE_ENV === 'production' ? '' : '/'
console.log('=============================')
console.log(`项目模式：${process.env.NODE_ENV}`)
console.log(`BASE_URL：${BASE_URL}`)
console.log('=============================')
const resolve = dir => {
    return path.join(__dirname, dir)
}

module.exports = {
    devServer: {
        port: 8888,
        //跨域配置
        proxy: '',
    },
    //部署应用包时的基本 URL
    // publicPath: BASE_URL,
    //配置路径别名
    chainWebpack: config => {
        config.resolve.alias.set('_c', resolve('src/components'))
    },
    //打包时不生成.map文件
    productionSourceMap: false
}
```

## 6.Vue命名视图

router.js

```js
{
        path: '/named_view',
        components: {
            default: () => import('@/views/Child.vue'),
            email: () => import('@/views/Email.vue'),
            tel: () => import('@/views/Tel.vue')
        }
}
```

App.vue

```vue
<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{name:'Home'}">Home</router-link>|
      <router-link :to="{name:'About'}">About</router-link>
    </div>
    <!--命名视图-->
    <router-view />
    <router-view name="email" />
    <router-view name="tel" />
  </div>
</template>
```

## 7.v-model在父子组件中的使用

- 父组件

```vue
<template>
  <div>
    <a-input v-model="parentValue" />
    <a-input @input="handleInput" :value="parentValue" />
    <p>{{ parentValue }}</p>
  </div>
</template>

<script>
import AInput from "_c/AInput.vue";
export default {
  data() {
    return {
      parentValue: "我是父值"
    };
  },
  components: {
    AInput
  },
  methods: {
    handleInput(val) {
      this.parentValue = val;
    }
  }
};
</script>

<style>
</style>
```



- 子组件

```vue
<template>
  <div class="container">
    <input @input="handleInput" :value="value" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: ""
    };
  },
  props: {
    value: {
      type: [String, Number],
      default: ""
    }
  },
  components: {},
  methods: {
    handleInput(event) {
      const value = event.target.value;
      this.$emit("input", value);
    }
  }
};
</script>

<style scoped lang="scss">
</style>

```

> 说明：

`v-model`：实际上是一种语法糖，它等价于`@input="handleInput" :value="parentValue"`，也就是说既使用`:value="parentValue"`给子组件传了值，又使用`@input="handleInput"`调用子组件的函数修改了父组件的值

## 8. Promise对象的使用

我们在项目根目录新建api文件夹，新建user.js，我们来模拟一个api接口，接口方法是userInfo，我们使用setTimeout模拟接口的异步延时响应（3秒后返回结果），定义一个错误变量err赋值为null，如果没有错误就返回正确响应resolve，如果有错误就返回错误响应reject

api/user.js

```js
export const userInfo = () => {
    return new Promise((resolve, reject) => {
        const err = null
        setTimeout(() => {
            if (!err) resolve({ code: 200, data: { username: 'xiaoming' } })
            else reject('api error')
        }, 3000)
    })
}
```

## 9.$nextTick

$nextTick主要用来获取更新后的dom对象，因为在vue中dom的更新是异步的，它不会随着数据同时更新dom，所以在数据变化后，想要立即拿到数据变化后的dom，就需要用到$nextTick了

`用法`：在数据变化后，立即调用$nextTick，在$nextTick中的回调函数获取更新后的dom

例子：

demo.vue

```vue
<template>
  <div class="app">
    <div ref="msgDiv">{{msg}}</div>
    <div v-if="msg1">Message got outside $nextTick: {{msg1}}</div>
    <div v-if="msg2">Message got inside $nextTick: {{msg2}}</div>
    <div v-if="msg3">Message got outside $nextTick: {{msg3}}</div>
    <button @click="changeMsg">Change the Message</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello Vue.",
      msg1: "",
      msg2: "",
      msg3: ""
    };
  },
  methods: {
    changeMsg() {
      this.msg = "Hello world.";
      this.msg1 = this.$refs.msgDiv.innerHTML;
      this.$nextTick(() => {
        this.msg2 = this.$refs.msgDiv.innerHTML;
      });
      this.msg3 = this.$refs.msgDiv.innerHTML;
    }
  }
};
</script>

<style>
</style>
```

> 说明：
>
> 在`this.msg = "Hello world.";`改变数据的时候，dom还没有更新，如果直接去获取dom(this.$refs.msgDiv.innerHTML)，这样只能取到更新前的dom，msg3也是同样的结果。如果我们在$nextTick的回调函数中获取dom，并且赋值给msg3，那么它拿到的值肯定是dom更新后的值了





## 二. 路由

## 2.1 Vue带参数路由跳转和展示

### 2.1.1 路由跳转

- 方式一

```js
methods: {
    handleTo() {
      const name = "test";
      this.$router.push({
        path: `/argu/${name}`
      });
    }
  }
```

- 方式二

```js
methods: {
    handleTo() {
      const name = "test";
      this.$router.push({
        name: "Argu",
        params: {
           name: "Tom"
        }
      });
    }
  }
```

### 2.1.2 参数接收

#### 2.1.2.1 接收参数方式一

这种方式使得路由和页面组件高度耦合，推荐使用方式二接收参数

Argu.vue

```vue
<template>
  <div>
    <h1>argu</h1>
    {{ this.$route.params.name }}
  </div>
</template>
```

#### 2.1.2.2 接收参数方式二

使用props接收参数

##### 布尔模式：

```vue
<template>
  <div>
    <h1>argu</h1>
    {{name}}
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: [String, Number],
      default: "tom"
    }
  }
};
</script>
```

路由中必须设置props:true ，才能显示真正的值，否则只会显示默认值 tom

```js
{
        path: '/argu/:name',
        name: 'Argu',
        component: () => import('../views/Argu.vue'),
        props: true
},
```

##### 对象模式：

```vue
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>{{ food }}</h2>
  </div>
</template>
<script>
export default {
  props: {
    food: {
      type: String,
      default: "banana"
    }
  }
};
</script>
```

路由配置，在路由中使用props对象传递参数

```js
{
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue'),
        props: {
            food: 'apple'
        }
},
```

##### 函数模式：

vue页面配置

```vue
<template>
  <div class="home">
    {{food}}
  </div>
</template>

<script>
export default {
  name: "Home",
  props: {
    food: {
      type: String,
      default: "banana"
    }
  }
};
</script>
```

路由配置

```js
{
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        props: route => ({
            food: route.query.food
        })
},
```

## 2.2. Vue全局路由守卫

模拟控制登录，登录之后可以任意访问，没登录，都跳转到登录页面

```js
var is_login = false;
router.beforeEach((to, from, next) => {
    if (to.name !== 'Login') {
        if (is_login) {
            next()
        } else {
            next({ name: 'Login' })
        }
    } else {
        if (is_login) {
            next({ name: 'Home' })
        } else {
            next()
        }
    }
})
```

## 2.3  完整的路由导航解析流程

- 导航被触发
- 在失活的组件中(即将离开的页面组件)里调用离开守卫beforeRouteLeave

```vue
<script>
export default {
  name: "Home",
  beforeRouteLeave(to, from, next) {
    const leave = confirm("你确定要离开么？");
    if (leave) {
      next();
    } else {
      next(false);
    }
  }
</script>
```

- 调用全局的前置守卫beforeEach

- 在重用的组件调用beforeRouteUpdate

```vue
<script>
export default {
  props: {
    name: {
      type: [String, Number],
      default: "lison"
    }
  },
  beforRouteEnter(to, from, next) {
    console.log("执行了 beforRouteEnter");
    next();
  },
  beforeRouteUpdate(to, from, next) {
    console.log("执行了 beforeRouteUpdate");
    next();
  }
};
</script>
```

> 说明：

在路由是hash模式的时候才会触发，history模式没有触发



- 调用路由独享的守卫beforeEnter

```js
export default [{
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        props: route => ({
            food: route.query.food
        }),
        beforeEnter: (to, from, next) => {
            if (from.name === 'About') {
                alert('这是从About页来的')
            } else {
                alert('这不是从About页来的')
            }
            next()
        }
    }
]
```

> 说明：

这一步是在路由列表配置的



- 解析异步路由组件
- 在被激活的路由组件(即将进入的页面组件)里调用beforeRouteEnter

```vue
<script>
export default {
  props: {
    food: {
      type: String,
      default: "banana"
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log("我是 beforeRouteEnter");
  }
};
</script>
```



- 调用全局的解析守卫beforeResolve

```js
router.beforeResolve((to, from, next) => {
    console.log(`调用了beforeResolve to.name=${to.name} from.name=${from.name}`)
    next()
})
```

> 说明：

是在配置路由的页面调用，和全局路由守卫在一个文件



- 导航被确认->被确认就是所有的导航钩子都执行结束
- 调用全局的后置守卫afterEach
- 触发dom渲染
- 用创建好的实例调用beforeRouteEnter守卫里传给next的回调函数

> 注意：

beforeRouteEnter中不能直接使用this实例，因为此时页面还没渲染，可以通过回调函数调用，next里面的就是回调函数

```js
beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log(vm);
    });
  },
```



## 2.4  路由元信息

使用全局路由守卫设置页签标题

router/index.js

```js
router.beforeEach((to, from, next) => {
  //这个表达式意思是如果to.meta为真，就继续执行setTitles
    to.meta && setTitle(to.meta.title)

    if (to.name !== 'Login') {
        if (is_login) {
            next()
        } else {
            next({ name: 'Login' })
        }
    } else {
        if (is_login) {
            next({ name: 'Home' })
        } else {
            next()
        }
    }
})
```

router/route.js

```js
{
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue'),
        props: {
            food: 'apple'
        },
        meta: {
            title: '关于'
        }
},
```



## 2.5 路由的切换动效

App.vue

这里多个视图需要用`transition-group`，单个的话就需要用`transition`，每个视图必须设置一个`key`，

样式的命名是`transition-group`的name分别加enter、enter-acitve、enter-to

```vue
<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{name:'Home'}">Home</router-link>|
      <router-link :to="{name:'About'}">About</router-link>|
      <router-link :to="{name:'Child'}">Parent</router-link>
    </div>
    <transition-group name="router">
      <router-view key="default" />
      <router-view key="email" name="email" />
    </transition-group>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

// 页面即将要显示的
.router-enter {
  // 透明度为0
  opacity: 0;
}

// 页面从无到有的效果
.router-enter-active {
  //从无到有的效果
  transition: opacity 1s ease;
}
// 页面完全显示的状态
.router-enter-to {
  opacity: 1;
}

// 页面即将要离开的效果
.router-leave {
  // 透明度为1
  opacity: 1;
}

// 页面从有到无的效果
.router-leave-active {
  transition: opacity 1s ease;
}
// 页面完全离开的状态
.router-leave-to {
  opacity: 0;
}
</style>

```

- 给单个的路由添加动效

```vue
<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{name:'Home'}">Home</router-link>|
      <router-link :to="{name:'About'}">About</router-link>|
      <router-link :to="{name:'Child'}">Parent</router-link>
    </div>
    <transition-group :name="routerTransition">
      <router-view key="default" />
      <router-view key="email" name="email" />
    </transition-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      routerTransition: ""
    };
  },
  watch: {
    '$route' (to) {
      to.query &&
        to.query.routerTransition &&
        (this.routerTransition = to.query.routerTransition);
    }
  }
};
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

// 页面即将要显示的
.router-enter {
  // 透明度为0
  opacity: 0;
}

// 页面从无到有的效果
.router-enter-active {
  //从无到有的效果
  transition: opacity 1s ease;
}
// 页面完全显示的状态
.router-enter-to {
  opacity: 1;
}

// 页面即将要离开的效果
.router-leave {
  // 透明度为1
  opacity: 1;
}

// 页面从有到无的效果
.router-leave-active {
  transition: opacity 1s ease;
}
// 页面完全离开的状态
.router-leave-to {
  opacity: 0;
}
</style>
```

- 页面请求

http://localhost:8888/#/about?routerTransition=router

> 说明
>
> 参数名需要和样式名称对应`routerTransition=router`



## 三. 状态管理

### 3.1 Bus的使用

- /src/lib/bus.js

```js
import Vue from 'vue'
const Bus = new Vue()
export default Bus
```

- /src/main.js

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Bus from './lib/bus'

Vue.config.productionTip = false
Vue.prototype.$bus = Bus

new Vue({
    router: router,
    store,
    render: h => h(App)
}).$mount('#app')
```

- /src/views/Email.vue

```vue
<template>
  <div class="email">
    email: 763010522@qq.com
    <button @click="handleClick">点我</button>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$bus);
  },
  methods: {
    handleClick() {
      this.$bus.$emit("on-click", "hello");
    }
  }
};
</script>

<style scoped>
.email {
  border: 1px solid green;
}
</style>
```

- Tel.vue

```vue
<template>
  <div class="tel">
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ""
    };
  },
  mounted() {
    this.$bus.$on("on-click", mes => {
      this.message = mes;
    });
  }
};
</script>

<style scoped>
.tel {
  border: 1px solid red;
}
</style>>
</style>
```

- /src/App.vue

```vue
<template>
  <div id="app">
    <transition-group>
      <router-view key="default" />
      <router-view key="email" name="email" />
      <router-view key="tel" name="tel" />
    </transition-group>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
```

### 3.2 Vuex的使用

#### 严格模式

- /src/store/index.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import user from './module/user'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: process.env.NODE_ENV === 'development',//严格模式
    state,
    mutations,
    actions,
    getters,
    modules: {
        user
    }
})
```

> 说明：
>
> `strict:true`严格模式：在严格模式下，不允许直接使用this.$store.state.username='我是新名字'，浏览器中会报错提示。正确的方式是提交一个commit给mutations，通过mutations改变state中的值



#### 3.2.1 state

state中的值一般在computed中操作，包括mapState工具函数



- /src/store/state.js

```js
const state = {
    appName: 'xxx后台管理系统',
  	username: 'admin'
}

export default state
```

##### 使用计算属性接收：

- /src/views/Login.vue

```vue
<template>
    <div class="login-div">
        <h3>{{appName}}</h3>
      	<h3>{{username}}</h3>
  	</div>
</template>

<script>
export default {
  computed: {
    //第一种写法，使用计算属性
    appName() {
       return this.$store.state.appName;
    },
    username() {
       return this.$store.state.username;
    }
  }
</script>
```

##### 使用mapState数组接收：

- /src/views/Login.vue

```vue
<template>
    <div class="login-div">
        <h3>{{appName}}</h3>
      	<h3>{{username}}</h3>
  	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    //第二种写法，使用mapState数组接收
		...mapState(["appName", "username"])
  }
</script>
```

##### 使用mapState对象接收：

- /src/views/Login.vue

```vue
<template>
    <div class="login-div">
        <h3>{{appName}}</h3>
      	<h3>{{username}}</h3>
  	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    //第三种写法，使用mapState对象接收
    ...mapState({
      appName: state => state.appName, //这个state相当于根的state
      username: state => state.user.username
    })
  }
</script>
```



##### module中的state

###### 通常用法：

如果是module中的state，那么接收的时候就是在state后面多加一个module的名字即可，例如state.user.username

> 说明：
>
> `...mapState()`辅助函数不能通过`...mapState(['user.username'])`或者`...mapState(['username'])`的方式获取user模块的username的值，只能通过下面的方式获取
>
> ```js
> ...mapState({
>       username: state => state.user.username//这个state相当于根的state
>     })
> ```
>
> 

- /src/store/module/user.js

````js
const state = {
    username: 'admin',
    password: '123456',
}

const actions = {
}

const mutations = {
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
````

- /src/views/Login.vue

```vue
<template>
    <div class="login-div">
        <h3>{{username}}</h3>
      	<h3>{{password}}</h3>
  	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    //第三种写法，使用mapState对象接收
    ...mapState({
      appName: state => state.user.password, //这个state相当于根的state
      username: state => state.user.username
    })
  }
</script>
```



###### 使用模块名称获取state：

此时需要开启namespaced命名空间

- /src/store/module/user.js

```js
const state = {
    username: 'admin',
    password: '123456',
}

const actions = {
}

const mutations = {
    SET_USERNAME(state, value) {
        state.username = value
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
```

- /src/views/Weclome.vue

```vue
<template>
  <div>
    <h1>欢迎来到后台管理系统</h1>
    <h3>{{appNameWithVersion}}</h3>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("user", {
      username: state => state.username
    })
  }
};
</script>

<style scoped lang="less">
</style>
```





#### 3.2.2 getters

getters是用在computed中的，也包括它的辅助函数mapGetters

getters通常是实时监控state中的数据的，利用这一特性，如果有数据是基于state中的数据修改的，可以使用getters



比如：我们要基于appName再加上一个版本v1.0

##### 使用计算属性：

- /src/store/getters.js

```js
const getters = {
    appNameWithVersion(state) {
        return `${state.appName}v1.0`
    }
}

export default getters
```

- /src/views/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到后台管理系统</h1>
    <h3>{{appNameWithVersion}}</h3>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
     appNameWithVersion() {
       return `${this.username}v2.0`;
     }
  }
};
</script>

<style scoped lang="less">
</style>
```



##### 使用mapGetters：

- /src/store/getters.js

```js
const getters = {
    appNameWithVersion(state) {
        return `${state.appName}v1.0`
    }
}

export default getters
```

- /src/views/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到后台管理系统</h1>
    <h3>{{appNameWithVersion}}</h3>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["appNameWithVersion"])
  }
};
</script>

<style scoped lang="less">
</style>
```

##### module中使用getters

module中使用getters，如果要通过全局的mapGetters获取，就需要关闭namespaced命名空间，默认namespaced:false

> 说明：
>
> `...mapGetters()`辅助函数是全局的，可以获取全局getters中的数据，也可以获取user模块中的getters的数据，不需要多加模块名，直接通过`...mapGetters(['appName','username'])`获取，其中appName是全局getters中的，username是user模块的getters中的



- /src/store/module/user.js

```js
const state = {
    username: 'admin',
    password: '123456',
}

const actions = {
}

const getters = {
    usernameWithVersion(state) {
        return `${state.username}v1.0`
    }
}

const mutations = {
}

export default {
    // namespaced: true,
    getters,
    state,
    actions,
    mutations
}
```

- /src/views/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到后台管理系统</h1>
    <h3>我是全局的getters：{{appNameWithVersion}}</h3>
    <h3>我是module中的getters：{{usernameWithVersion}}</h3>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["appNameWithVersion", "usernameWithVersion"])
  }
};
</script>

<style scoped lang="less">
</style>

```





#### 3.2.3 mutations

mutations主要在methods方法中操作，包括mapMutations工具函数

mutations主要用作用就是使用定义改变state值的方法，然后在vue的页面通过this.$store.commit的方式提交触发方法，然后达到修改state中值的目的

- /src/store/mutations.js

```js
const mutations = {
    UPDATE_APPNAME(state, value) {
        this.state.appName = value
    }
}

export default mutations
```



##### 直接提交修改：

- /src/views/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到后台管理系统</h1>
    <h3>{{this.$store.state.appName}}</h3>
    <el-button type="warning" @click="handleClick">修改appName</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleClick() {
      this.$store.commit("UPDATE_APPNAME", "我是新的名字");
    }
};
</script>

<style scoped lang="less">
</style>
```

##### 使用mapMutations：

- /src/view/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到后台管理系统</h1>
    <h3>{{this.$store.state.appName}}</h3>
    <el-button type="warning" @click="handleClick">修改appName</el-button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["UPDATE_APPNAME"]),
    handleClick() {
      this.UPDATE_APPNAME("我是aaa");
    }
};
</script>

<style scoped lang="less">
</style>
```



##### moudle中的mutations

如果要使用全局的mapMutations，就是需要关闭namespaced命名空间，默认namespaced:false



> 说明：
>
> `...mapMutations()`辅助函数是全局的，可以获取全局mutations中的数据，也可以获取user模块中的mutations的数据，不需要多加模块名，直接通过`...mapMutations(["UPDATE_APPNAME", "SET_USERNAME"])`获取，其中UPDATE_APPNAME是全局mutations中的，SET_USERNAME是user模块的mutations中的



- /src/store/module/user.js

```js
const state = {
    username: 'admin',
    password: '123456',

}

const actions = {
}

const mutations = {
    SET_USERNAME(state, value) {
        state.username = value
    }
}

export default {
  // namespaced: true, //不能开启命名空间
    state,
    actions,
    mutations
}
```

- /src/view/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到后台管理系统</h1>
    <h3>{{this.$store.state.appName}}</h3>
    <h3>{{this.$store.state.user.username}}</h3>
    <el-button type="warning" @click="handleClick">修改appName</el-button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["UPDATE_APPNAME", "SET_USERNAME"]),
    handleClick() {
      this.SET_USERNAME("xiaoming");
    }
  }
};
</script>

<style scoped lang="less">
</style>
```

> 说明：
>
> 这里为什么还可以使用`...mapMutations(["UPDATE_APPNAME", "SET_USERNAME"])`获取到user的mutations呢？
>
> 因为`vuex`会把所有的mutations包括module中的都放到全局的mapMutations中，这样我们就能很方便的得到了





#### 3.2.4 actions

actions通常在methods中操作，包括mapActions工具函数也是

actions通常处理异步请求，例如请求api接口

mutations只能处理同步操作



##### 通常用法

- /src/api/user.js

模拟api接口，延时1秒返回信息

```js
export const getAppName = () => {
    return new Promise((resolve, reject) => {
        const err = null
        setTimeout(() => {
            if (!err) resolve({ code: 200, data: { appName: 'newAppName' } })
            else reject('api error')
        }, 1000)
    })
}
```

- /src/store/actions.js

模拟调用接口获取appName，然后提交commit给mutations修改state中的appName

```js
import { getAppName } from '@/api/user'
const actions = {
    async updateAppName({ commit }) {
        const { data: { appName } } = await getAppName();
      	//提交mutations
        commit('UPDATE_APPNAME', appName)
    }
}

export default actions
```

- /src/views/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到后台管理系统</h1>
    <h3>{{this.$store.state.appName}}</h3>
    <el-button type="warning" @click="handleClick">修改appName</el-button>
  </div>
</template>

<script>
import {mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions(["updateAppName"]),
    handleClick() {
      this.updateAppName();
    }
  }
};
</script>

<style scoped lang="less">
</style>
```



##### module中的actions

如果要使用全局的mapActions，就需要禁用namespaced命名空间，默认namespaced:false





> 说明：
>
> `...mapMutations()`辅助函数是全局的，可以获取全局actions中的数据，也可以获取user模块中的actions的数据，不需要多加模块名，直接通过`....mapActions(["updateAppName", "updateUsername"])获取，其中updateAppName是全局actions中的，updateUsername是user模块的actions中的





- /src/store/module/user.js

```js
const state = {
    username: 'admin',
    password: '123456',
}

const actions = {
  	//修改username的值为superAdmin
    updateUsername({ commit, state, rootState, dispatch }) {
      	//提交user.js中的mutations
        commit('SET_USERNAME', 'superAdmin')
    },
  	//修改appName
    updateRootAppName({ commit }) {
        //提交全局的mutations
        commit('UPDATE_APPNAME', '后台系统')
    }
}

const getters = {
}

const mutations = {
    SET_USERNAME(state, value) {
        state.username = value
    }
}

export default {
    // namespaced: true,
    getters,
    state,
    actions,
    mutations
}
```

- /src/views/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到{{this.$store.state.appName}}</h1>
    <h3>{{appNameWithVersion}}</h3>
    <h3>{{usernameWithVersion}}</h3>
    <el-button type="warning" @click="handleClick">修改appName</el-button>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["appNameWithVersion", "usernameWithVersion"])
  },
  methods: {
    ...mapActions(["updateAppName", "updateUsername", "updateRootAppName"]),
    handleClick() {
      this.updateUsername();
      this.updateRootAppName();
    }
  }
};
</script>

<style scoped lang="less">
</style>
```



#### 3.2.5 动态注册模块

##### 通常用法：

- /src/views/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到{{this.$store.state.appName}}</h1>
    <el-button type="warning" @click="registerModule">动态注册模块</el-button>
    <p v-for="(item, index) in todoList" :key="index">{{item}}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      todoList: state => (state.todo ? state.todo.todoList : [])
    })
  },
  methods: {
    registerModule() {
      this.$store.registerModule("todo", {
        state: {
          todoList: ["学习vue", "学习Spring"]
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
</style>
```



##### 给模块动态添加模块：

- /src/views/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到{{this.$store.state.appName}}</h1>
    <el-button type="warning" @click="registerModulea">动态注册模块</el-button>
    <p v-for="(item, index) in todoList" :key="index">{{item}}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      todoList: state => (state.user.todo ? state.user.todo.todoList : [])
    }),
    ...mapGetters(["appNameWithVersion", "usernameWithVersion"])
  },
  methods: {
    registerModule() {
      this.$store.registerModule(["user", "todo"], {
        state: {
          todoList: ["学习vue", "学习Spring"]
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
</style>
```



#### 3.2.6 插件

把state的值格式化成json存到localStorage中，这样当浏览器再打开的时候原来的数据还在



- /src/store/plugin/saveInLocal.js

```js
export const saveInLocal = store => {
    console.log('store初始化了')
    if (localStorage.state) store.replaceState(JSON.parse(localStorage.state))
    store.subscribe((mutation, state) => {
        localStorage.state = JSON.stringify(state)
        console.log('提交了mutations')
    })
}
```

- /src/store/index.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import user from './module/user'
import getters from './getters'
import { saveInLocal } from './plugin/saveInLocal'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: process.env.NODE_ENV === 'development',
    state,
    mutations,
    actions,
    getters,
    modules: {
        user
    },
    plugins: [saveInLocal]
})
```



#### 3.2.7 vuex + 双向绑定

###### 第一种写法：

一个组件

- /src/components/AInput.vue

```vue
<template>
  <div class="container">
    <p>我是AInput组件</p>
    <input @input="handleInput" :value="value" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ""
    }
  },
  components: {},
  methods: {
    handleInput(event) {
      const value = event.target.value;
      this.$emit("input", value);
    }
  }
};
</script>

<style scoped lang="scss">
</style>

```

- /src/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到{{this.$store.state.appName}}</h1>
    <a-input :value="appName" @input="handleAppName" />
  </div>
</template>

<script>
import AInput from "../components/AInput";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {};
  },
  components: {
    AInput
  },
  computed: {
    ...mapState({
      appName: state => state.appName
    })
  },
  methods: {
    ...mapMutations(["UPDATE_APPNAME"]),
    handleAppName(val) {
      this.UPDATE_APPNAME(val);
    }
  }
};
</script>

<style scoped lang="less">
</style>

```

###### 第二种写法(推荐)：

这种方法更简洁

一个组件

- /src/components/AInput.vue

  同上

- /src/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到{{this.$store.state.appName}}</h1>
    <a-input v-model="appName" />
  </div>
</template>

<script>
import AInput from "../components/AInput";
import { mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  components: {
    AInput
  },
  computed: {
    appName: {
      set(value) {
        this.UPDATE_APPNAME(value);
      },
      get() {
        return this.$store.state.appName;
      }
    }
  },
  methods: {
    ...mapMutations(["UPDATE_APPNAME"])
  }
};
</script>

<style scoped lang="less">
</style>
```

##### 

## 四. Mockjs使用

### 4.1安装mockjs

```js
npm install -D mockjs
```



### 4.2 新建mock相关文件

- /src/mock/index.js

```js
import Mock from 'mockjs'
import { getUserInfo } from './response/user'
const Random = Mock.Random

Mock.mock(/\/getUserInfo/, getUserInfo)

Mock.setup({
    // timeout: 3000 //3秒后才会返回接口响应
    // timeout: '0-3000', //随机0-3秒返回接口响应
    timeout: 0
})

//自定扩展mock
Random.extend({
    fruit() {
        const fruit = ['apple', 'peach', 'lemon']
        return this.pick(fruit)
    }
})

export default Mock
```



- 新建数据模板 /src/mock/response/user.js

tempate就是数据模板

```js
import Mock from 'mockjs'

const Random = Mock.Random

export const getUserInfo = (options) => {
    const template = {
        'str|2-4': 'lison', //随机显示lison2-4次
        'age|+2': 18, //数组的时候，age每次+2
        'num|2-6': 0, //随机显示[2-6]的数字
        'float|2-8.2-3': 0, //随机显示[2-8]小数点随机2位或者三位
        'boo|1': true, //true的概率是二分之一
        'boo2|1-9': true, //min/(min+max) true的概率是十分之一
        'obj|1': { //随机将1个数据放在结果中
            name: 'xiaom',
            age: 22,
            address: '北京'
        },
        'obj2|1-2': { //随机将1-2个数据放在结果中
            name: 'xiaom',
            age: 22,
            address: '北京'
        },
        'arr|2': [1, 2, 3], //指定循环显示2次数组
        'arr2|1-2': ['a', 'b'], //随机循环数组1-2次
        'func': () => { //返回方法中return的值
            return 'this is a function'
        },
        'reg': /.*\.(js|html|css|jpg)/, //根据正则表达式的内容生成结果
        email: Random.email(), //随机生成邮箱
        email2: Mock.mock('@email'), //随机生成邮箱
        range: Random.range(3, 7, 2), //随机返回数组包括3不包括7，相差2
        date: Random.date('yyyy-MM-dd'), //随机返回日期
        time: Random.time('hh:mm'), //随机返回时间
        datetime: Random.datetime(), //随机返回日期+时间
        now: Random.now('second', 'yyyy-MM-dd hh:mm:ss'), //返回当前时间，精确到秒
        img: Random.image('100x100', '#00f000', '#fff', 'test'), //随机返回图片地址
        img_base64: Random.dataImage(), //返回base64格式的图片
        color: Random.color(), //返回随机颜色
        cword: Random.cword('我是中文汉字', 2, 5), //随机返回2-5个汉字
        cname: Random.cname(), //随机返回中文名字
        email3: Random.email('qq.com'), //随机返回qq.com的邮箱
        region: Random.region(), //随机返回中国地区
        province: Random.province(), //随机返回中国省份
        city: Random.city(), //随机返回中国城市
        county: Random.county(true), //随机返回县级
        zip: Random.zip(), //随机返回邮政编码
        upperFirstLetter: Random.capitalize('apple'), //第一个首字母大写
        upper: Random.upper('i love china'), //整体大写
        lower: Random.lower('I AM CODING'), //整体小写
        pick: Random.pick(), //从数组中随机挑选一个
        shuffle: Random.shuffle([1, 2, 3, 4, 5, 6]), //随机打乱顺序
        guid: Random.guid(), //随机生成了guid
        id: Random.id(), //随机生成身份证
        fruit: Random.fruit(), //自定义mock
        fruit2: '@fruit', //自定义mock2
    }

    return Mock.mock(template)
}
```

> 说明：
>
> 这个js主要使用mockjs模拟接口返回数据的 



### 4.3 vue中引入mockjs

- main.js入口文件引入mockjs

```js
import Vue from 'vue'
import axios from 'axios'
import vueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Bus from './lib/bus'
import './assets/css/global.css'
//根据开发模式动态引入
if (process.env.NODE_ENV === 'development') require('./mock')

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(vueAxios, axios)
Vue.prototype.$bus = Bus

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
```

> 说明：
>
> `if (process.env.NODE_ENV === 'development') require('./mock')`：如果是开发模式就引入mockjs



### 4.4 页面接口调用

- /src/views/Weclome.vue

```vue
<template>
  <div>
    <h1>欢迎来到{{this.$store.state.appName}}</h1>
    <el-button type="warning" @click="userInfo">请求api接口</el-button>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/user";
export default {
  methods: {
    async userInfo() {
      const { data: res } = await getUserInfo();
      console.log(res);
    }
  }
};
</script>

<style scoped lang="less">
</style>
```

### 4.5 接口访问

此时点击`请求api接口`按钮，返回的数据就是mockjs拦截接口后的数据，而不是接口的真正数据了



## 五.封装第三方js库为vue组件

### 5.1 安装第三方js库

```js
npm install -D countup
```

> 说明：
>
> 这个库可以设置数字在变大或者变小的动画效果



### 5.2 新建vue组件

- /src/components/count-to/index.js

```js
import CountTo from './count-to.vue'
export default CountTo
```

> 说明：
>
> 这么做的好处就是，在其他vue组件中需要用这个组件，就可以通过`import CountTo from "@/components/count-to";`这种方式引入

- /src/components/count-to/count-to.vue

```vue
<template>
  <div>
    <slot name="left"></slot>
    <span :class="countClass" ref="number" :id="eleId"></span>
    <slot name="right"></slot>
  </div>
</template>

<script>
import CountUp from "countup";
// import "./count-to.less";

export default {
  name: "CountTo",
  data() {
    return {
      counter: {}
    };
  },
  computed: {
    eleId() {
      return `count_up_${this._uid}`;
    },
    countClass() {
      return ["count-to-number", this.className];
    }
  },
  props: {
    //起始值
    startVal: {
      type: Number,
      default: 0
    },
    //最终值
    endVal: {
      type: Number,
      default: 0
    },
    //小数点后保留几位
    decimals: {
      type: Number,
      default: 0
    },
    //渐变时长，默认值是1秒
    duration: {
      type: Number,
      default: 1
    },
    //动画延迟，毫秒
    delay: {
      type: Number,
      default: 0
    },
    //是否使用变速效果
    useEasing: {
      type: Boolean,
      default: false
    },
    //是否使用分组
    useGrouping: {
      type: Boolean,
      default: true
    },
    //分组使用的分割符，默认逗号
    separator: {
      type: String,
      default: ","
    },
    //整数和小数的分割符号，默认句号
    decimal: {
      type: String,
      default: "."
    },
    className: {
      type: String,
      default: ""
    }
  },
  watch: {
    endVal(newVal, oldVal) {
      this.counter.update(newVal);
      this.emitEndEvent();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.counter = new CountUp(
        this.eleId,
        this.startVal,
        this.endVal,
        this.decimals,
        this.duration,
        {
          userEasing: this.userEasing,
          useGrouping: this.useGrouping,
          separator: this.separator,
          decimal: this.decimal
        }
      );
      setTimeout(() => {
        this.counter.start();
        this.emitEndEvent();
      }, this.delay);
    });
  },
  methods: {
    emitEndEvent() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$emit("on-animation-end", this.getCount());
        });
      }, this.duration * 1000);
    },
    getCount() {
      return this.$refs.number.innerText;
    }
  }
};
</script>

<style lang="less">
@import "./count-to.less";
</style>
```

- /src/components/count-to/count-to.less

```less
.count-to-number{
    color: pink;
}
```



### 5.3 使用组件

- /src/views/Welcome.vue

```vue
<template>
  <div>
    <h1>欢迎来到{{this.$store.state.appName}}</h1>
    <el-button type="warning" @click="getNumber">获取组件的数值</el-button>
    <el-button type="warning" @click="changeVal">更新值</el-button>
    <!-- 封装第三方组件 -->
    <count-to ref="countTo" @on-animation-end="handleEnd" :end-val="endVal">
      <span slot="left">总金额：</span>
      <span slot="right">元</span>
    </count-to>
  </div>
</template>

<script>
import CountTo from "@/components/count-to";

export default {
  data() {
    return {
      endVal: 0
    };
  },
  components: {
    CountTo
  },
  computed: {
  },
  methods: {
    getNumber() {
      this.$refs.countTo.getCount();
    },
    changeVal() {
      this.endVal += Math.random() * 100;
    },
    handleEnd(endVal) {
      console.log(`end -> ${endVal}`);
    }
  }
};
</script>

<style scoped lang="less">
</style>

```
