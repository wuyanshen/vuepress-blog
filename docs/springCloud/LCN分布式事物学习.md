---
sidebar: auto
---

# TXLCN分布式事物学习

## 1.搭建SpringCloud项目

### 1.1 父工程

- pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.wys.study</groupId>
    <artifactId>lcn-cloud-study</artifactId>
    <version>1.0</version>

    <packaging>pom</packaging>

    <modules>
        <module>eureka</module>
    </modules>

    <dependencies>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

<!--    Spring Cloud依赖-->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Greenwich.SR3</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>2.1.10.RELEASE</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>

```



### 1.2 Eureka注册中心

#### 1.2.1 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>lcn-cloud-study</artifactId>
        <groupId>com.wys.study</groupId>
        <version>1.0</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>eureka</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
    </dependencies>
</project>
```

#### 1.2.2 application.xml

```yaml
server:
  port: 8761

spring:
  application:
    name: eureka-server
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

#### 1.2.3 启动类

```java
package com.wys.study.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApp{
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApp.class, args);
    }
}
```

### 1.3 config配置中心

#### 1.3.1 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>lcn-cloud-study</artifactId>
        <groupId>com.wys.study</groupId>
        <version>1.0</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>config</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-config-server</artifactId>
        </dependency>
    </dependencies>
</project>
```

#### 1.3.2 application.yml

```yaml
server:
  port: 10000

spring:
  application:
    name: config-server
  cloud:
    config:
      discovery:
        service-id: config-server
      server:
        native:
          search-locations: classpath:/config
  profiles:
    active: native

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
```

#### 1.3.3 启动类

```java
package com.wys.study.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

/**
 * @author wuyanshen
 * @date 2020-03-13 4:09 下午
 * @discription 描述
 */
@EnableConfigServer
@SpringBootApplication
public class ConfigSeverApp {
    public static void main(String[] args) {
        SpringApplication.run(ConfigSeverApp.class,args);
    }
}
```

### 1.4 gateway网关

#### 1.4.1 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>lcn-cloud-study</artifactId>
        <groupId>com.wys.study</groupId>
        <version>1.0</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>gateway</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
        </dependency>
    </dependencies>
</project>
```

#### 1.4.2 bootstrap.yml

> 说明：
>
> 这个必须使用bootstrap开头，因为需要提前加载配置中心的服务的端口信息等，application.xml是不行的

```yaml
server:
  port: 7000

spring:
  application:
    name: gateway
  profiles:
    active: dev
# 配置中心
  cloud:
    config:
      fail-fast: true
      discovery:
        service-id: config-server
        enabled: true
      name: ${spring.application.name}
      profile: ${spring.profiles.active}
# 网关配置
    gateway:
      discovery:
        locator:
          enabled: true # 开启默认路由
      routes:
        # 微服务A
        - id: service-a
          uri: lb://service-a
          predicates:
            - Path=/a/**
          filters:
            - StripPrefix=1
        # 微服务B
        - id: service-b
          uri: lb://service-b
          predicates:
            - Path=/b/**
          filters:
            - StripPrefix=1

# 注册中心
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
```

#### 1.4.3 启动类：

```java
package com.wys.study.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GatewayApp {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApp.class,args);
    }
}
```

### 1.5 数据库sql

```sql
drop database if exists `bank-a`;
drop database if exists `bank-b`;
drop database if exists `tx-manager`;

# LCN数据库
create database `tx-manager`;

# 微服务A的库
create database `bank-a`;
SET NAMES UTF8;

use `bank-a`;

drop table if exists `account`;

CREATE TABLE `account` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `username` varchar(20) DEFAULT NULL COMMENT '用户名',
  `money` int(11) DEFAULT NULL COMMENT '金额',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

insert into account (username,money) values ('xiaoming',1000);

# 微服务B的库
create database `bank-b`;
SET NAMES UTF8;

use `bank-b`;

drop table if exists `account`;

CREATE TABLE `account` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `username` varchar(20) DEFAULT NULL COMMENT '用户名',
  `money` int(11) DEFAULT NULL COMMENT '金额',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

insert into account (username,money) values ('xiaoming',1000);
```



### 1.6 微服务A

#### 1.6.1 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>lcn-cloud-study</artifactId>
        <groupId>com.wys.study</groupId>
        <version>1.0</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>service-a</artifactId>
    <packaging>jar</packaging>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.2</version>
        </dependency>

        <!--lcn分布式事物客户端-->
        <dependency>
            <groupId>com.codingapi.txlcn</groupId>
            <artifactId>txlcn-tc</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>com.codingapi.txlcn</groupId>
            <artifactId>txlcn-txmsg-netty</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.2.5.RELEASE</version>
            </plugin>
        </plugins>
    </build>
</project>

```

#### 1.6.2 bootstrap.yml

```yaml
server:
  port: 8081

spring:
  application:
    name: service-a
  profiles:
    active: dev

# 配置中心
  cloud:
    config:
      fail-fast: true
      discovery:
        enabled: true
        service-id: config-server
      name: ${spring.application.name}
      profile: ${spring.profiles.active}

# 数据库
  datasource:
    type: com.zaxxer.hikari.HikariDataSource
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/service-a?serverTimezone=Asia/Shanghai
    username: root
    password: root

# 注册中心
eureka:
  instance:
    prefer-ip-address: true
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/


# mybatis配置
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

```

#### 1.6.3 启动类

```java
package com.wys.study.servicea;

import com.codingapi.txlcn.tc.config.EnableDistributedTransaction;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableDistributedTransaction
@EnableFeignClients
@SpringBootApplication
@MapperScan("com.wys.study.servicea.mapper")
public class ServcieAApp {
    public static void main(String[] args) {
        SpringApplication.run(ServcieAApp.class, args);
    }
}

```

#### 1.6.4 实体类

```java
package com.wys.study.servicea.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class Account implements Serializable {

    private Integer id;
    private String username;
    private Integer money;
    private Date CreateTime;
}
```

#### 1.6.5 mapper

```java
package com.wys.study.servicea.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;


@Mapper
public interface AccountMapper {

    @Update("update account set money = money - #{money} where username = #{username}")
    int update(@Param("money") Integer money, @Param("username") String username);
}
```

#### 1.6.6 service

```java
package com.wys.study.servicea.service;

import com.wys.study.servicea.entity.Account;

public interface AccountService {
    String update(Account account);
}
```

#### 1.6.7 feign接口

```java
package com.wys.study.servicea.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = "service-b")
public interface ServiceBClient {

    @GetMapping("add")
    String add(@RequestParam("money") int money, @RequestParam("username") String username);
}

```

#### 1.6.8 impl

```java
package com.wys.study.servicea.service.impl;

import com.codingapi.txlcn.tc.annotation.LcnTransaction;
import com.wys.study.servicea.entity.Account;
import com.wys.study.servicea.feign.ServiceBClient;
import com.wys.study.servicea.mapper.AccountMapper;
import com.wys.study.servicea.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author wuyanshen
 * @date 2020-03-13 6:13 下午
 * @discription 描述
 */
@Component
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountMapper accountMapper;

    @Autowired
    private ServiceBClient serviceBClient;

    @Override
    @LcnTransaction
    @Transactional
    public String update(Account account) {
        int r = accountMapper.update(account.getMoney(),account.getUsername());
        if(r >0){
            String result = serviceBClient.add(account.getMoney(),account.getUsername());
            throw new RuntimeException("这里出现异常啦");
        }
        return "rpc error";
    }
}
```

#### 1.6.9 controller

```java
package com.wys.study.servicea.controller;

import com.wys.study.servicea.entity.Account;
import com.wys.study.servicea.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ServiceAController {

    @Autowired
    private AccountService accountService;

    @GetMapping("subtract")
    public String subtrack(@RequestParam("money") int money,@RequestParam("username") String username){
        Account account = new Account();
        account.setMoney(money);
        account.setUsername(username);
        return accountService.update(account);
    }
}
```

#### 1.6.10 访问接口

- 直接访问

http://localhost:8081/subtract?money=100&username=xiaoming

- 通过网关访问

http://localhost:7000/a/subtract?money=100&username=xiaoming

### 1.7 微服务B

#### 1.7.1 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.wys.study</groupId>
        <artifactId>lcn-cloud-study</artifactId>
        <version>1.0</version>
    </parent>
    <artifactId>service-b</artifactId>
    <name>service-b</name>
    <packaging>jar</packaging>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.2</version>
        </dependency>

				<!--lcn分布式事物客户端-->
        <dependency>
            <groupId>com.codingapi.txlcn</groupId>
            <artifactId>txlcn-tc</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>com.codingapi.txlcn</groupId>
            <artifactId>txlcn-txmsg-netty</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.2.5.RELEASE</version>
            </plugin>
        </plugins>
    </build>

</project>

```

#### 1.7.2 bootstrap.xml

```yaml
server:
  port: 8082

spring:
  application:
    name: service-b
  profiles:
    active: dev
  main:
    allow-bean-definition-overriding: true

  # 配置中心
  cloud:
    config:
      fail-fast: true
      discovery:
        enabled: true
        service-id: config-server
      name: ${spring.application.name}
      profile: ${spring.profiles.active}

  # 数据库
  datasource:
    type: com.zaxxer.hikari.HikariDataSource
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/bank-b?serverTimezone=Asia/Shanghai
    username: root
    password: root

# 注册中心
eureka:
  instance:
    prefer-ip-address: true
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/

# mybatis配置
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

# 显示lcn相关的日志
logging:
  level:
    com:
      codingapi: debug
```

#### 1.7.3 启动类

```java
package com.wys.study.serviceb;
import com.codingapi.txlcn.tc.config.EnableDistributedTransaction;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableDistributedTransaction
@SpringBootApplication
@MapperScan("com.wys.study.serviceb.mapper")
public class ServiceBApp {
    public static void main(String[] args) {
        SpringApplication.run(ServiceBApp.class, args);
    }
}
```

#### 1.7.4 实体类

```java
package com.wys.study.serviceb.entity;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class Account implements Serializable {

    private Integer id;
    private String username;
    private Integer money;
    private Date CreateTime;
}
```

#### 1.7.5 mapper

```java
package com.wys.study.serviceb.mapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface AccountMapper {

    @Update("update account set money = money + #{money} where username = #{username}")
    int update(@Param("money") Integer money, @Param("username") String username);
}
```

#### 1.7.6 service

```java
package com.wys.study.serviceb.service;
import com.wys.study.serviceb.entity.Account;

public interface AccountService {
    String update(Account account);
}
```

#### 1.7.7 impl

```java
package com.wys.study.serviceb.service.impl;

import com.codingapi.txlcn.tc.annotation.LcnTransaction;
import com.codingapi.txlcn.tc.annotation.TxcTransaction;
import com.wys.study.serviceb.entity.Account;
import com.wys.study.serviceb.mapper.AccountMapper;
import com.wys.study.serviceb.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountMapper accountMapper;

    @Override
    @LcnTransaction
    @Transactional
    public String update(Account account) {
        int r = accountMapper.update(account.getMoney(),account.getUsername());
        return r > 0 ? "success":"fail";
    }
}
```

#### 1.7.8 controller

```java
package com.wys.study.serviceb.controller;

import com.wys.study.serviceb.entity.Account;
import com.wys.study.serviceb.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ServiceBController {

    @Autowired
    private AccountService accountService;

    @GetMapping("add")
    public String add(@RequestParam("money") int money,@RequestParam("username") String username){
        Account account = new Account();
        account.setMoney(money);
        account.setUsername(username);
        return accountService.update(account);
    }
}
```

#### 1.7.9 访问接口

- 直接访问

http://localhost:8082/add?money=100&username=xiaoming

- 通过网关访问

http://localhost:7000/b/add?money=100&username=xiaoming

### 1.8 LCN服务

#### 1.8.1 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>lcn-cloud-study</artifactId>
        <groupId>com.wys.study</groupId>
        <version>1.0</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>lcn</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.codingapi.txlcn</groupId>
            <artifactId>txlcn-tm</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>
    </dependencies>

</project>
```

#### 1.8.2 application.properties

```properties
spring.application.name=tx-manager
server.port=7970

spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/tx-manager?characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=root

mybatis.configuration.map-underscore-to-camel-case=true
mybatis.configuration.use-generated-keys=true

# TM后台登陆密码，默认值为codingapi
tx-lcn.manager.admin-key=admin
# 数据库方言
spring.jpa.database-platform=org.hibernate.dialect.MySQL5InnoDBDialect

# 第一次运行可以设置为: create, 为TM创建持久化数据库表
spring.jpa.hibernate.ddl-auto=validate
#tx-lcn.logger.enabled=true
# TxManager Host Ip
#tx-lcn.manager.host=127.0.0.1
# TxClient连接请求端口
#tx-lcn.manager.port=8070
# 心跳检测时间(ms)
#tx-lcn.manager.heart-time=15000
# 分布式事务执行总时间
#tx-lcn.manager.dtx-time=30000
#参数延迟删除时间单位ms
#tx-lcn.message.netty.attr-delay-time=10000
#tx-lcn.manager.concurrent-level=128
# 开启日志
tx-lcn.logger.enabled=true
logging.level.com.codingapi=debug
#redis 主机
#spring.redis.host=127.0.0.1
#redis 端口
#spring.redis.port=6379
#redis 密码
#spring.redis.password=

```

#### 1.8.3 启动类

```java
package com.wys.study.lcn;s
import com.codingapi.txlcn.tm.config.EnableTransactionManagerServer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableTransactionManagerServer
public class LcnApp {
    public static void main(String[] args) {
        SpringApplication.run(LcnApp.class,args);
    }
}
```

#### 1.8.4 访问lcn页面控制台

http://127.0.0.1:7970/admin/index.html

密码默认是：codingapi

