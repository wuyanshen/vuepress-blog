---
sidebar: auto
---

# nginx配置

## 1. docker安装nginx

```bash
docker run -d -p 80:80 -p 8888:8888 -v $PWD/mysoftware/mynginx/conf:/etc/nginx --name nginx nginx:1.15.8-alpine-perl
```

> 说明：
>
> 如果想要配置listen非80端口，比如：listen:8888，那么就需要在启动docker容器的时候添加`端口映射：-p 8888:8888`，其它端口同理



## 2.配置nginx

- cd到mynginx/conf目录

- 将conf.d目录中的default.conf里面全部注释
- 在nginx.conf文件中http{}的结尾加上include /etc/nginx/web.conf*;*

```bash
http{
		...其它配置项

    include /etc/nginx/web.conf;
}
```



- 在mynginx/conf目录新建web.conf，配置如下

```bash

upstream mysvr {   
      server 127.0.0.1:7878;
      server 192.168.10.121:3333 backup;  #热备
}

server {
		keepalive_requests 2; #单连接请求上限次数。
    listen 80;
    server_name localhost;
    
    location / {
    		proxy_set_header Host $host; #在请求头中设置host
        proxy_set_header X-Real-IP $remote_addr; #在请求头中设置真实ip
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; #在请求头中设置X-Forwarded-For
    		proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
        add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate"; #设置不缓存index.html
        root html/vue-admin; # 设置index.html的路径
        index index.html; #设置首页
        try_files $uri /index.html; #重定向$uri请求到index.html 例如: 
        # deny all; # 拒绝所有请求
        error_page 404 https://www.baidu.com; #错误页
	}
	
	access_log logs/vue-admin.log main; #设置记录日志

}
```

> 说明：
>
> try_files： 重试请求页面，可以设置指定的请求到指定的页面
>
> $uri：就是指ip后面的路径，例如http://192.168.31.180/welcome, /welcome就是$uri
>
> $remote_addr 与 $http_x_forwarded_for 用以记录客户端的ip地址；
>
> $http_referer ：用来记录从那个页面链接访问过来的；
>
> $remote_user ：用来记录客户端用户名称；
>
> $time_local ： 用来记录访问时间与时区；
>
> $request ： 用来记录请求的url与http协议；
>
> $status ： 用来记录请求状态；成功是200；
>
> $body_bytes_sent ：记录发送给客户端文件主体内容大小；
>
> $http_user_agent ：记录客户端浏览器的相关信息；





## 3.nginx配置https

参考配置：

https://cloud.tencent.com/document/product/400/35244

```bash
server {
  listen 443 ssl;
  #填写绑定证书的域名
  server_name www.domain.com; 
  #网站主页路径。此路径仅供参考，具体请您按照实际目录操作。
  root /var/www/www.domain.com; 
  index index.html index.htm;   
  
  #证书文件名称(写证书的绝对路径)
  ssl_certificate  /data/https/1_www.domain.com_bundle.crt; 
  #私钥文件名称(写证书的绝对路径)
  ssl_certificate_key /data/https/2_www.domain.com.key; 
  ssl_session_timeout 5m;
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_prefer_server_ciphers on;
  
  location / {
     index index.html index.htm;
  }
}
# 配置http默认跳转到https
server {
  listen 80;
  #填写绑定证书的域名
  server_name www.domain.com; 
  #把http的域名请求转成https
  #return 301 https://$host$request_uri; 
  #或者 这种写法和上面的写法都可以
  rewrite ^(.*)$ https://${server_name}$1 permanent; 
}
```





## 4. 参考配置

https://www.runoob.com/w3cnote/nginx-setup-intro.html

