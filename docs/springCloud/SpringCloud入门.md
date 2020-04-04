---
sidebar: auto
---

### 单体应用存在的问题

- 随着业务的发展，开发变得越来越复杂
- 修改,新增某个功能，需要对整个系统进行测试,重新部署
- 一个模块出现问题，很可能导致整个系统崩溃
- 多个开发团队同时对数据进行管理，容易产生安全漏洞
- 各个模块使用同一种技术进行开发， 各个模块很难根据实际情况选择更合适的技术框架, 局限性很大
- 模块内容过于复杂，如果员工离职，可能需要很长时间才能完成工作交接

分布式、集群

集群：一台服务器无法符合高并发的数据访问量，那么就设置十台服务器一起分担压力，十台不行就设置一百台（物理层面）。很多人干同一件事情，来分摊压力。

分布式：讲一个复杂问题拆分成若干个简单的小问题，将一个大型的项目架构拆分成若干个微服务来协同完成（软件的设计层面）。将一个庞大的工作拆分成若干个小步骤，分别由不同的人完成这些小步骤，最终将所有的结果进行整合实现大的需求。



### 服务治理

- 服务治理的核心由三部分组成：服务提供者、服务消费者、注册中心

- 在分布式系统中，每个微服务在启动时，将自己的信息存储在注册中心，叫做服务注册

- 服务消费者从注册中心获取服务提供者的网络信息，通过该信息调用服务，叫做服务发现

SpringCloud的服务治理使用Eureka来实现，Eureka是Netflix开源的基于REST的服务治理解决方案，SpringCloud集成了Eureka，提供服务注册和服务发现功能，可以和基于SpringBoot搭建的微服务应用轻松完成整合，开箱即用，Spring Cloud Eureka。

### Spring Cloud Eureka

- Eureka Server，注册中心
- Eureka Client，所有要进行注册的微服务通过Eureka Client连接到Eureka Server，完成注册

### Eureka Server代码实现

- 创建父工程，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.southwind</groupId>
    <artifactId>aispringcloud</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>
    <modules>
        <module>eurekaserver</module>
    </modules>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.0.7.RELEASE</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Finchley.SR2</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```

- 在父工程下创建Module，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>eurekaserver</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>
</project>

```

- 创建配置文件application.yml，添加Eureka Server相关配置

```yml
server:
  port: 8761
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
    service-url: 
      defaultZone: http://localhost:8761/eureka/
```

> 属性说明

`server.port`：当前Eureka Server 服务端口。

`eureka.client.register-with-eureka`：是否将当前的Eureka Server服务作为客户端进行注册。

`eureka.client.fetch-registry`：是否获取其他Eureka Server服务的数据。

`eureka.client.service-url.defaultZone`：注册中心的访问地址。

- 创建启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * @author wuyanshen
 * @date 2020-02-05 11:39 上午
 * @discription Eureka Server
 */
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

> 注解说明：

`@SpringBootApplication`：声明该类是Spring Boot服务的入口

`@EnableEurekaServer`：声明该类是一个Eureka Server微服务，提供服务注册和服务发现的功能，即注册中心

### Eureka Client代码实现

- 创建Module，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>eurekaclient</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>
</project>

```

- 创建配置文件application.yml，添加Eureka Client相关配置。

```yaml
server:
  port: 8010

spring:
  application:
    name: provider

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true

```

> 属性说明：

`spring.application.name`：当前服务注册在Eureka Server商的名称。

`eureka.client.service-url.defaultZone`：注册中心的访问地址

`eureka.instance.prefer-op-address`：是否将当前服务的IP注册到Eureka Server

- 创建启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author wuyanshen
 * @date 2020-02-05 2:36 下午
 * @discription 服务提供者
 */
@SpringBootApplication
@EnableDiscoveryClient
public class ProviderAppliction {
    public static void main(String[] args) {
        SpringApplication.run(ProviderAppliction.class, args);
    }
}

```

- 实体类

```java
package com.southwind.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author wuyanshen
 * @date 2020-02-05 2:40 下午
 * @discription Student类
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student {

    private long id;
    private String name;
    private int age;

}
```

- Repository

```java
package com.southwind.repository;

import com.southwind.entity.Student;

import java.util.Collection;

public interface StudentRepository {
    Collection<Student> findAll();
    Student findById(long id);
    void saveOrUpdate(Student student);
    void deleteById(long id);
}

```

- Repository实现类

```java
package com.southwind.repository.impl;

import com.southwind.entity.Student;
import com.southwind.repository.StudentRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * @author wuyanshen
 * @date 2020-02-05 2:45 下午
 * @discription 实现类
 */
@Repository
public class StudentRepositoryImpl implements StudentRepository {

    private static Map<Long,Student> studentMap;

    static {
        studentMap = new HashMap<>();
        studentMap.put(1L,new Student(1L,"张三",22));
        studentMap.put(2L,new Student(2L,"李四",22));
        studentMap.put(3L,new Student(3L,"王五",22));
    }

    @Override
    public Collection<Student> findAll() {
        return studentMap.values();
    }

    @Override
    public Student findById(long id) {
        return studentMap.get(id);
    }

    @Override
    public void saveOrUpdate(Student student) {
        studentMap.put(student.getId(),student);
    }

    @Override
    public void deleteById(long id) {
        studentMap.remove(id);
    }
}

```

- controller

```java
package com.southwind.controller;

import com.southwind.entity.Student;
import com.southwind.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

/**
 * @author wuyanshen
 * @date 2020-02-05 2:50 下午
 * @discription 控制器
 */
@RestController
@RequestMapping("/student")
@AllArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;

    @GetMapping("/findAll")
    public Collection<Student> findAll(){
        return studentRepository.findAll();
    }

    @GetMapping("/findById/{id}")
    public Student findById(@PathVariable("id") long id){
        return  studentRepository.findById(id);
    }

    @PostMapping("/save")
    public void save(@RequestBody Student student){
        studentRepository.saveOrUpdate(student);
    }

    @PutMapping("/update")
    public void update(@RequestBody Student student){
        studentRepository.saveOrUpdate(student);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id") long id){
        studentRepository.deleteById(id);
    }

}

```



### RestTemplate的使用

- 什么是RestTemplate？

RestTemplate是Spring框架提供的基于REST的服务组件，底层对HTTP请求及响应进行了封装，提供了很多访问REST服务的方法，可以简化代码的开发。

- 如何使用RestTemplate?

1、创建Maven工程，pom.xml

2、创建实体类

```java
package com.southwind.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author wuyanshen
 * @date 2020-02-05 2:40 下午
 * @discription Student类
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student {

    private long id;
    private String name;
    private int age;

}
```

3、Handler

```java
package com.southwind.controller;

import com.southwind.entity.Student;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collection;

/**
 * @author wuyanshen
 * @date 2020-02-05 3:27 下午
 * @discription 描述
 */
@RestController
@RequestMapping("/rest")
@AllArgsConstructor
public class RestHandler {

    private final RestTemplate restTemplate;

    @GetMapping("/findAll")
    public Collection<Student> findAll(){
        return 	restTemplate.getForEntity("http://localhost:8010/student/findAll",Collection.class).getBody();
    }

    @GetMapping("/findAll2")
    public Collection<Student> findAll2(){
        return restTemplate.getForObject("http://localhost:8010/student/findAll",Collection.class);
    }

    @GetMapping("findById/{id}")
    public Student findById(@PathVariable("id") long id){
        return restTemplate.getForEntity("http://localhost:8010/student/findById/{id}",Student.class,id).getBody();
    }

    @GetMapping("findById2/{id}")
    public Student findById2(@PathVariable("id") long id){
        return restTemplate.getForObject("http://localhost:8010/student/findById/{id}",Student.class,id);
    }

    @PutMapping("update")
    public void update(@RequestBody Student student){
        restTemplate.put("http://localhost:8010/student/update",student);
    }

    @PostMapping("save")
    public void save(@RequestBody Student student){
        restTemplate.postForEntity("http://localhost:8010/student/save",student,null).getBody();
    }

    @PostMapping("save2")
    public void save2(@RequestBody Student student){
        restTemplate.postForObject("http://localhost:8010/student/save",student,Student.class);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable("id") long id){
        restTemplate.delete("http://localhost:8010/student/delete/{id}",id);
    }
}

```

4、启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

/**
 * @author wuyanshen
 * @date 2020-02-05 3:25 下午
 * @discription 启动类
 */
@SpringBootApplication
public class RestTemplateApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestTemplateApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}

```

### 服务消费者consumer

- 创建Maven工程，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>consumer</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>

</project>

```

- 创建application.yml配置文件

```yaml
server:
  port: 8020
spring:
  application:
    name: consumer
eureka:
  instance:
    prefer-ip-address: true
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

- 创建启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author wuyanshen
 * @date 2020-02-05 4:09 下午
 * @discription 启动类
 */
@SpringBootApplication
public class ConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class, args);
    }
}

```

- 实体类

```java
package com.southwind.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author wuyanshen
 * @date 2020-02-05 2:40 下午
 * @discription Student类
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student {

    private long id;
    private String name;
    private int age;

}

```

- Controller

```java
package com.southwind.controller;

import com.southwind.entity.Student;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collection;

/**
 * @author wuyanshen
 * @date 2020-02-05 4:11 下午
 * @discription 控制器
 */
@RestController
@AllArgsConstructor
public class ConsumerController {

    private final RestTemplate restTemplate;

    @GetMapping("/findAll")
    public Collection<Student> findAll(){
        return restTemplate.getForEntity("http://localhost:8010/student/findAll",Collection.class).getBody();
    }

    @GetMapping("/findAll2")
    public Collection<Student> findAll2(){
        return restTemplate.getForObject("http://localhost:8010/student/findAll",Collection.class);
    }

    @GetMapping("findById/{id}")
    public Student findById(@PathVariable("id") long id){
        return restTemplate.getForEntity("http://localhost:8010/student/findById/{id}",Student.class,id).getBody();
    }

    @GetMapping("findById2/{id}")
    public Student findById2(@PathVariable("id") long id){
        return restTemplate.getForObject("http://localhost:8010/student/findById/{id}",Student.class,id);
    }

    @PutMapping("update")
    public void update(@RequestBody Student student){
        restTemplate.put("http://localhost:8010/student/update",student);
    }

    @PostMapping("save")
    public void save(@RequestBody Student student){
        restTemplate.postForEntity("http://localhost:8010/student/save",student,null).getBody();
    }

    @PostMapping("save2")
    public void save2(@RequestBody Student student){
        restTemplate.postForObject("http://localhost:8010/student/save",student,Student.class);
    }

    @DeleteMapping("delete/{id}")
    public void delete(@PathVariable("id") long id){
        restTemplate.delete("http://localhost:8010/student/delete/{id}",id);
    }

}

```

### 服务网关

Spring Cloud 集成了Zuul组件，实现服务网关。

- 什么是Zuul?

Zuul是Netflix提供的一个开源的API网关服务器，是客户端和网站后端所有请求的中间层，对外开放一个API，将所有请求导入统一的入口，屏蔽了服务端点额具体实现逻辑，Zuul可以实现反向代理的功能，在网关内部实现动态路由、身份认证、IP过滤、数据监控等。

- Zuul代码实现
- 创建Maven工程，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>zuul</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>

</project>

```

- 创建配置文件application.yml

```yaml
server:
  port: 8030

spring:
  application:
    name: zuul
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true

zuul:
  routes:
    provider: /p/**

```

> 属性说明：

`zuul.routes.provider`：给服务提供者provider设置映射

- 创建启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

/**
 * @author wuyanshen
 * @date 2020-02-05 4:39 下午
 * @discription 网关启动类
 */
@EnableZuulProxy
@EnableAutoConfiguration
public class ZuulApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZuulApplication.class,args);
    }
}

```

> 注解说明：

`@EnableZuulProxy`：包含了`@EnableZuulServer`注解，设置该类是网关的启动类。

`@EnableAutoConfiguration`：可以帮助SpringBoot应用将所有符合条件的`@Configuration`配置加载到当前Spring Boot创建并使用的Ioc容器中。

- zuul还自带了负载均衡的功能，修改provider代码。

```java
package com.southwind.controller;

import com.southwind.entity.Student;
import com.southwind.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

/**
 * @author wuyanshen
 * @date 2020-02-05 2:50 下午
 * @discription 控制器
 */
@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private  StudentRepository studentRepository;

    @Value("${server.port}")
    private String port;

    @GetMapping("/findAll")
    public Collection<Student> findAll(){
        return studentRepository.findAll();
    }

    @GetMapping("/findById/{id}")
    public Student findById(@PathVariable("id") long id){
        return  studentRepository.findById(id);
    }

    @PostMapping("/save")
    public void save(@RequestBody Student student){
        studentRepository.saveOrUpdate(student);
    }

    @PutMapping("/update")
    public void update(@RequestBody Student student){
        studentRepository.saveOrUpdate(student);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id") long id){
        studentRepository.deleteById(id);
    }

    @GetMapping("index")
    public String index(){
        return "当前服务端口是："+port;
    }
}

```

### Ribbon负载均衡

- 什么是Ribbon?

Spring Cloud Ribbon 是一个负载均衡解决方案，Ribbon是Netflix发布的负载均衡器，Spring Cloud Ribbon是基于Netflix Ribbon实现的，是一个用于对HTTP请求进行控制的负载均衡客户端。

在注册中心对Ribbon进行注册之后，Ribbon就可以基于某种负载均衡算法，如轮询、随机、加权轮询、加权随机等自动帮助服务消费者调用接口，开发者也可以根据具体需求自定义Ribbon负载均衡算法。实际开发中，Spring Cloud Ribbon需要结合Spring Cloud Eureka来使用，Eureka Server 提供所有可以调用的服务提供者列表，Ribbon基于特定的负载均衡算法从这些服务提供者中选择要调用的具体实例。

- 创建Module，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>ribbon</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>
</project>

```

- 创建配置文件application.yml

```yaml
server:
  port: 8040

spring:
  application:
    name: ribbon
eureka:
  instance:
    prefer-ip-address: true
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/

```

- 创建启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

/**
 * @author wuyanshen
 * @date 2020-02-05 5:12 下午
 * @discription 启动类
 */
@SpringBootApplication
public class RibbonApplication {
    public static void main(String[] args) {
        SpringApplication.run(RibbonApplication.class, args);
    }

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}

```

> 说明：

`@LoadBalanced`：声明一个基于Ribbon的负载均衡。

- controller

```java
package com.southwind.controller;

import com.southwind.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Collection;

/**
 * @author wuyanshen
 * @date 2020-02-05 5:15 下午
 * @discription 控制器
 */
@RestController
@RequestMapping("/ribbon")
public class RibbonController {
    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("findAll")
    public Collection<Student> findAll(){
        return restTemplate.getForObject("http://provider/student/findAll",Collection.class);
    }

    @GetMapping("index")
    public String index(){
        return restTemplate.getForObject("http://provider/student/index",String.class);
    }
}

```

- 实体类

```java
package com.southwind.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author wuyanshen
 * @date 2020-02-05 2:40 下午
 * @discription Student类
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student {

    private long id;
    private String name;
    private int age;

}

```

### Feign

- 什么是feign?

与Ribbon一样，Feign也是由NetFlix提供的，Feign是一个声明式、模板化的Web Service客户端，它简化了开发者编写Web服务客户端的操作，开发者可以通过简单的接口和注解来调用HTTP API，Spring Cloud Feign它整合了Ribbon和Hystrix，具有可插拔、基于注解、负载均衡、服务熔断等一系列便捷功能。

相比较于Ribbon + RestTemplate的方式，Feign大大简化了代码的开发，Feign支持多种注解，包括Feign注解、JAX-RS注解、SpringMVC注解等，Spring Cloud对Feign进行了优化，整合了Ribbon和Eureka，从而让Feign的使用更加方便。

- Ribbon和Feign的区别

Ribbon是一个通用的HTTP客户端工具， Feign是基于Ribbon实现的。

- Feign的特点

1、Feign是一个声明式的Web Service客户端

2、支持Feign注解、SpringMVC注解、JAX-RS注解

3、Feign基于Ribbon实现，使用起来更加简单

4、Feign集成了Hystrix，具备服务熔断功能

- Feign代码实现
- 创建module，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>feign</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>
</project>

```

- 创建配置文件application.yml

```yaml
server:
  port: 8050

spring:
  application:
    name: feign

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true

```

- 创建启动类

```java
package com.soutwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * @author wuyanshen
 * @date 2020-02-05 5:37 下午
 * @discription 启动类
 */
@SpringBootApplication
@EnableFeignClients
public class FeignApplication {
    public static void main(String[] args) {
        SpringApplication.run(FeignApplication.class, args);
    }
}

```

- 实体类

```java
package com.soutwind.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author wuyanshen
 * @date 2020-02-05 2:40 下午
 * @discription Student类
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Student {

    private long id;
    private String name;
    private int age;

}

```

- 创建声明式接口

```java
package com.soutwind.feign;

import com.soutwind.entity.Student;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Collection;

@FeignClient(value = "provider")
public interface FeignProviderClient {

    @GetMapping("/student/findAll")
    Collection<Student> findAll();
    @GetMapping("/student/index")
    String index();
}

```

- 创建controller

```java
package com.soutwind.controller;

import com.soutwind.entity.Student;
import com.soutwind.feign.FeignProviderClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

/**
 * @author wuyanshen
 * @date 2020-02-05 5:45 下午
 * @discription 控制器
 */
@RestController
@RequestMapping("feign")
public class FeignController {

    @Autowired
    private FeignProviderClient feignProviderClient;

    @GetMapping("findAll")
    public Collection<Student> findAll(){
        return feignProviderClient.findAll();
    }

    @GetMapping("index")
    public String index(){
        return feignProviderClient.index();
    }
}

```

- 服务熔断，application.yml添加熔断配置

```yaml
server:
  port: 8050

spring:
  application:
    name: feign

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
feign:
  hystrix:
    enabled: true

```

> 说明：

`feign.hystrix.enabled`： 是否开启feign的熔断器，默认false

- 创建FeignProviderClient接口的实现类FeignError，定义容错处理逻辑，`@Component`注解将FeignError实例注入到Ioc容器中

```java
package com.soutwind.feign;

import com.soutwind.entity.Student;
import org.springframework.stereotype.Component;

import java.util.Collection;

/**
 * @author wuyanshen
 * @date 2020-02-05 5:57 下午
 * @discription 服务降级处理类
 */

@Component
public class FeignError implements FeignProviderClient {
    @Override
    public Collection<Student> findAll() {
        return null;
    }

    @Override
    public String index() {
        return "服务降级。。。";
    }
}

```

- 在FeignProviderClient定义处通过`@FeignClient`的fallback属性设置映射

```java
package com.soutwind.feign;

import com.soutwind.entity.Student;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Collection;

@FeignClient(value = "provider", fallback = FeignError.class)
public interface FeignProviderClient {

    @GetMapping("/student/findAll")
    Collection<Student> findAll();
    @GetMapping("/student/index")
    String index();
}

```

### Hystrix容错机制

在不改变各个微服务调用关系的前提下，针对错误情况进行预先处理。

- 设计原则

1、服务隔离机制

指的是防止某个服务提供者出现问题而影响整个系统的运行

2、服务降级机制

指的是服务提供者出现故障时，向服务消费者返回fallback的降级处理

3、熔断机制

指的是当服务消费者请求失败率达到某一个特定的数值时，会迅速启动熔断机制，并对错误进行修复

4、提供实时的监控和报警功能

5、提供实时的配置修改功能

Hystrix数据监控需要结合Spring Boot Actuator组件来使用，Actuator提供了对服务的健康监控、数据统计，可以通过hystrix-stream节点获取监控的请求数据，提供了可视化的监控界面。

- 代码实现
- 创建module，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>hystrix</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
            <version>2.0.7.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>
</project>

```

- 创建配置文件application.yml

```yaml
server:
  port: 8060

spring:
  application:
    name: hystrix

eureka:
  instance:
    prefer-ip-address: true
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/

feign:
  hystrix:
    enabled: true

management:
  endpoints:
    web:
      exposure:
        include: 'hystrix.stream'

```

- 创建启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * @author wuyanshen
 * @date 2020-02-05 6:23 下午
 * @discription 启动类
 */
@SpringBootApplication
@EnableFeignClients
@EnableCircuitBreaker
@EnableHystrixDashboard
public class HystrixAppliction {

    public static void main(String[] args) {
        SpringApplication.run(HystrixAppliction.class, args);
    }
}

```

> 注解说明：

`@EnableCircuitBreaker`：声明启用数据监控

`@EnableHystrixDashboard`：声明启动可视化数据监控

- 创建controller

```java
package com.southwind.controller;

import com.southwind.entity.Student;
import com.southwind.feign.FeignProviderClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

/**
 * @author wuyanshen
 * @date 2020-02-05 6:28 下午
 * @discription 控制器
 */
@RestController
@RequestMapping("hystrix")
public class HystrixController {

    @Autowired
    private FeignProviderClient feignProviderClient;

    @GetMapping("findAll")
    public Collection<Student> findAll(){
        return feignProviderClient.findAll();
    }

    @GetMapping("index")
    public String index(){
        return feignProviderClient.index();
    }
}

```

- 启动成功之后，访问`http://localhost:8060/actuator/hystrix.stream`可以监控到请求数据，
- 访问`http://localhost:8060/hystrix`，可以看到可视化的监控界面，输入要监控的地址节点即可看到该节点的可视化数据监控。

### Spring Cloud配置中心

Spring Cloud Config，通过服务端可以为多个客户端提供配置服务。Spring Cloud Config可以将配置文件存储在本地，也可以将配置文件存储在远程Git仓库，创建Config Server，通过它管理所有的配置文件。

#### 本地文件系统

- 创建Module，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>nativeconfigserver</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-config-server</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>

</project>

```

- 创建application.yml配置文件

```yaml
server:
  port: 8762

spring:
  application:
    name: nativeconfigserver
  profiles:
    active: native
  cloud:
    config:
      server:
        native:
          search-locations: classpath:/shared

```

> 注解说明：

`spring.profiles.active`：配置文件的获取方式

`spring.cloud.config.server.native.search-locations`：本地配置文件的存放路径

- resources路径下创建shared文件夹，并在此路径下创建configclient-dev.yml

```yaml
server:
  port: 8070
foo: foo version 1

```

- 创建启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

/**
 * @author wuyanshen
 * @date 2020-02-05 10:51 下午
 * @discription 启动类
 */
@SpringBootApplication
@EnableConfigServer
public class NativeConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(NativeConfigServerApplication.class, args);
    }
}

```

> 注解说明：

`@EnableConfigServer`：声明配置中心

#### 创建客户端读取本地配置中心的配置文件

- 创建module，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>nativeconfigclient</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>
</project>

```

- 创建bootstrap.yml配置文件，配置读取本地配置中心的相关信息

```yaml
spring:
  application:
    name: configclient
  profiles:
    active: dev
  cloud:
    config:
      uri: http://localhost:8762
      fail-fast: true

```

> 说明：

`spring.cloud.config.fail-fast`：设置客户端优先判断Config Server获取是否正常

`spring.cloud.config.uri`：本地Config Server的访问路径

通过`spring.application.name`结合`spring.profiles.active`拼接目标配置文件名，configclient-dev.yml，

然后去Config Server中查找该文件

- 创建启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author wuyanshen
 * @date 2020-02-05 11:06 下午
 * @discription 启动类
 */
@SpringBootApplication
public class NativeConfigClientApplication {
    public static void main(String[] args) {
        SpringApplication.run(NativeConfigClientApplication.class, args);
    }
}
```

- 创建controller

```java
package com.southwind.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author wuyanshen
 * @date 2020-02-05 11:08 下午
 * @discription 控制器
 */
@RestController
@RequestMapping("/native")
public class NativeConfigClientController {

    @Value("${server.port}")
    private String port;

    @Value("${foo}")
    private String foo;

    @GetMapping("index")
    public String index(){
        return this.port + "-" +this.foo;
    }
}
```

### Spring Cloud Config远程配置

- 创建配置文件，上传至GitHub

```yaml
server:
  port: 8070
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
spring:
  application:
    name: configclient
```

- 创建Config Server，新建Maven工程，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>configserver</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-config-server</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>

</project>

```

- 创建配置文件application.yml

```yaml
server:
  port: 8888
spring:
  application:
    name: configserver
  cloud:
    config:
      server:
        git:
          uri: https://github.com/wuyanshen/aispringcloud.git
          search-paths: config
          username: root
          password: root
      label: master
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

- 创建启动类

```java
package com.soutwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

/**
 * @author wuyanshen
 * @date 2020-02-05 11:40 下午
 * @discription 启动类
 */
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}

```

#### 创建Config Client

- 创建Maven工程，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>configclient</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>
</project>
```

- 创建bootstrap.yml配置文件

```yaml
spring:
  application:
    name: configclient
  cloud:
    config:
      name: configclient-dev
      label: master
      discovery:
        enabled: true
        service-id: configserver
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
```

> 说明：

`spring.cloud.config.name`：当前服务注册在Eureka Server上的名称，与远程仓库配置文件名对应

`spring.cloud.config.label`：Git Repository的分支

`spring.cloud.config.discovery.enabled`：是否开启Config服务发现支持，即发现注册中心的配置

`spring.cloud.config.discovery.service-id`：配置中心在Eureka Server上注册的名称

- 创建启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author wuyanshen
 * @date 2020-02-05 11:51 下午
 * @discription 启动类
 */
@SpringBootApplication
public class ConfigclientApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigclientApplication.class, args);
    }
}
```

- 创建Controller

```java
package com.southwind.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author wuyanshen
 * @date 2020-02-06 12:02 上午
 * @discription 控制器
 */
@RestController
@RequestMapping("/hello")
public class HelloController {

    @Value("${server.port}")
    private String port;

    @GetMapping("index")
    public String index(){
        return this.port;
    }
}
```

### 服务跟踪

Spring Cloud Zipkin

Zipkin是一个可以采集并且跟踪分布式系统中请求数据的组件，让开发者可以更加直观的监控到请求在各个微服务所耗费的时间等， Zipkin：Zipkin Server、Zipkin Client

#### 创建Zipkin Server服务端

- 代码实现，创建Maven的module，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>zipkin</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>io.zipkin.java</groupId>
            <artifactId>zipkin-server</artifactId>
            <version>2.9.4</version>
        </dependency>
        <dependency>
            <groupId>io.zipkin.java</groupId>
            <artifactId>zipkin-autoconfigure-ui</artifactId>
            <version>2.9.4</version>
        </dependency>
    </dependencies>

</project>


```

- 创建配置文件application.yml

```yaml
server:
  port: 9090
  
```

- 创建启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import zipkin.server.internal.EnableZipkinServer;

/**
 * @author wuyanshen
 * @date 2020-02-06 12:19 上午
 * @discription 启动类
 */
@EnableZipkinServer
@SpringBootApplication
public class ZipkinApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZipkinApplication.class, args);
    }
}

```

> 注解说明：

`@EnableZipkinServer`：声明启动Zipkin Server

#### 创建Zipkin Client客户端

- 创建Maven工程，pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>aispringcloud</artifactId>
        <groupId>com.southwind</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>zipkinclient</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-zipkin</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
            <version>2.0.2.RELEASE</version>
        </dependency>
    </dependencies>
</project>
```

- 创建配置文件application.yml

```yaml
server:
  port: 8090
spring:
  application:
    name: zipkinclient
  sleuth:
    web:
      client:
        enabled: true
    sampler:
      probability: 1.0
  zipkin:
    base-url: http://localhost:9090
eureka:
  client:
    service-url: 
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
```

> 说明：

`spring.sleuth.web.client.enabled`：设置开启请求跟踪

`spring.sleuth.sampler.probability`：设置采样比例，默认1.0

`spring.zipkin.base-url`：Zipkin Server的地址

- 创建启动类

```java
package com.southwind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author wuyanshen
 * @date 2020-02-06 12:29 上午
 * @discription 启动类
 */
@SpringBootApplication
public class ZipkinclientApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZipkinclientApplication.class, args);
    }
}
```

- 创建Controller

```java
package com.southwind.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author wuyanshen
 * @date 2020-02-06 12:34 上午
 * @discription 控制器
 */
@RestController
@RequestMapping("zipkin")
public class ZipkinController {
    @Value("${server.port}")
    private String port;

    @GetMapping("index")
    public String index(){
        return this.port;
    }
}
```

- 启动Zipkin Server成功后，访问`http://localhost:9090/zipkin/`，可以看到监控界面
- 启动Zipkin Clinet成功后，访问index接口，然后再刷新`http://localhost:9090/zipkin/`，会展示监控结果