---
navbar: true
sidebar: auto
---

# 使用docker搭建gogs

## 1.下载gogs的docker镜像

```bash
docker pull gogs/gogs
```

## 2.运行gogs容器

```bash
docker run -d -p 3000:3000 -v $PWD/gogs:/data --name gogs gogs/gogs
```

## 3.浏览器访问

```bash
http://localhost:3000
```

## 4.设置gogs

- 数据库主机

ip+端口，ip需要设置成局域网ip，不能使用localhost或者127.0.0.1

- 域名(非必须，可以使用localhost，如果要配置外网访问就不能使用localhost)

设置为局域网ip

- 应用URL(非必须，可以使用localhost，如果要配置外网访问就不能使用localhost)

http://192.168.31.180:3000/

- 可选设置>服务器和其它服务设置
  - 1.禁用注册功能
  - 2.启用登录访问限制

> 说明：
>
> 这样设置，没有登录的只能显示登录页不会看到仓库内容

- 点击`立即安装`按钮

## 5.设置用户名密码

点击`注册`按钮，创建账户

## 6. 新建git仓库

## 7.在腾讯云上搭建注意事项

在腾讯云上使用docker搭建gogs基本步骤都一样，我们还需要配置入站和出站规则，入站配置3000端口，出站配置3306端口-->因为我们使用的是腾讯云上的mysql，对于docker容器来说我们得通过公网ip+端口方式访问mysql，也就是相当于我们要访问外网的3306端口

> 说明：
>
> 入站：就是我们可以访问腾讯云服务器上的哪些端口
>
> 出站：腾讯云服务器上的应用可以访问外网的哪些端口