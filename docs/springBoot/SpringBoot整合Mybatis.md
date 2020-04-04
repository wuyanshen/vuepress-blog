---
sidebar: auto
---

# SpringBoot整合Mybatis

## 大版本

SpringBoot 2.1.10.RELEASE

mybatis 3.5.4

lombok 1.18.10





## 1. 无xml版本

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.longyi</groupId>
    <artifactId>rbac-demo</artifactId>
    <version>1.0</version>
    <name>rbac-demo</name>
    <packaging>jar</packaging>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.2</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-parent</artifactId>
                <version>2.1.10.RELEASE</version>
                <scope>import</scope>
                <type>pom</type>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```



### application.yml

```yml
server:
  port: 3002

spring:
  application:
    name: rbac-demo
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.zaxxer.hikari.HikariDataSource
    url: jdbc:mysql://localhost:3306/devicedb
    username: root
    password: root

mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```



### 启动类

```java
package com.longyi.rbacdemo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.longyi.rbacdemo.mapper")
@SpringBootApplication
public class RbacDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(RbacDemoApplication.class, args);
    }
}
```



### entity实体类

- SysUser

```java
package com.longyi.rbacdemo.entity;

import lombok.Data;
import java.util.Date;

@Data
public class SysUser implements Serializable{
  private static final long serialVersionUID = 532866134108871587L;

    private Integer id;
    private String username;
    private String password;
    private String org_id;
    private boolean enabled;
    private String phone;
    private String email;
    private Date create_time;
}
```



- SysRole

```java
package com.longyi.rbacdemo.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class SysRole implements Serializable {
    private static final long serialVersionUID = 532866134108871587L;

    private Integer id;

    private String roleName;

    private String roleDesc;

    private String roleCode;

    private Integer sort;

    private Object status;
}
```



### mapper

```java
package com.longyi.rbacdemo.mapper;

import com.longyi.rbacdemo.entity.SysUser;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

public interface UserMapper {

    @Select("select * from sys_user where username=#{username}")
    SysUser info(@Param("username") String username);
}
```



### service

```java
package com.longyi.rbacdemo.service;

import com.longyi.rbacdemo.entity.SysUser;

public interface UserService {

    SysUser info(String username);
}
```



### impl

```java
package com.longyi.rbacdemo.service.impl;

import com.longyi.rbacdemo.entity.SysUser;
import com.longyi.rbacdemo.mapper.UserMapper;
import com.longyi.rbacdemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    public SysUser info(String username) {
        return userMapper.info(username);
    }
}
```



### controller

```java
package com.longyi.rbacdemo.controller;

import com.longyi.rbacdemo.entity.SysUser;
import com.longyi.rbacdemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("{username}")
    public SysUser info(@PathVariable("username") String username){
        return this.userService.info(username);
    }
}
```



### sql

```sql
CREATE TABLE `sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL DEFAULT '0' COMMENT '用户名',
  `password` varchar(64) NOT NULL DEFAULT '0' COMMENT '密码',
  `org_id` int(11) NOT NULL COMMENT '组织id',
  `enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0无效用户，1是有效用户',
  `phone` varchar(16) DEFAULT NULL COMMENT '手机号',
  `email` varchar(32) DEFAULT NULL COMMENT 'email',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '用户创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='用户信息表';
```



## 2. 有xml版本

其他配置都一样，主要区别就是application.yml和mapper文件，还多了一个xml文件

### application.yml

```yaml
server:
  port: 3002

spring:
  application:
    name: rbac-demo
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.zaxxer.hikari.HikariDataSource
    url: jdbc:mysql://localhost:3306/devicedb
    username: root
    password: root

mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  mapper-locations: classpath:mapper/*.xml
```



### mapper

```java
package com.longyi.rbacdemo.mapper;

import com.longyi.rbacdemo.entity.SysUser;
import org.apache.ibatis.annotations.Param;

public interface UserMapper {

    SysUser info(@Param("username") String username);
}
```



### UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.longyi.rbacdemo.mapper.UserMapper">
    <select id="info" resultType="com.longyi.rbacdemo.entity.SysUser">
        select * from sys_user where username=#{username}
    </select>
</mapper>
```



## 3.关于mapper.xml标签用法

### collection

多对多关系的写法，通过查询SysUser，带出和SysUser关联的SysRole的信息

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.longyi.rbacdemo.mapper.UserMapper">
    <resultMap id="SysUserMap" type="com.longyi.rbacdemo.entity.SysUser">
        <id column="id" property="id"/>
        <result column="username" property="username"/>
        <result column="password" property="password"/>
        <result column="org_id" property="orgId"/>
        <result column="enabled" property="enabled"/>
        <result column="phone" property="phone"/>
        <result column="email" property="email"/>
        <result column="create_time" property="createTime"/>
        <collection property="roles" ofType="com.longyi.rbacdemo.entity.SysRole">
            <id column="id" property="id"/>
            <result column="role_code" property="roleCode"/>
            <result column="role_name" property="roleName"/>
            <result column="role_desc" property="roleDesc"/>
            <result column="sort" property="sort"/>
            <result column="status" property="status"/>
        </collection>
    </resultMap>

    <sql id="userJoinColumn">
          su.id,su.username,su.password,su.org_id,su.enabled,su.phone,su.email,su.create_time,
        sr.id,sr.role_code,sr.role_name,sr.role_desc,sr.status,sr.sort
    </sql>

    <select id="getUser" resultMap="SysUserMap">
        select
        <include refid="userJoinColumn"></include>
        from sys_user su
        left join sys_user_role sur on su.id = sur.user_id
        left join sys_role sr on sur.role_id = sr.id
    </select>

</mapper>

```



- SysUserMapper

```java
package com.longyi.rbacdemo.mapper;

import com.longyi.rbacdemo.entity.SysUser;

import java.util.List;

public interface UserMapper {
    List<SysUser> getUser();
}
```



- SysUserService

```java
package com.longyi.rbacdemo.service;

import com.longyi.rbacdemo.entity.SysUser;

import java.util.List;

public interface UserService {
    List<SysUser> getUser();
}
```



- SysUserServiceImpl

```java
package com.longyi.rbacdemo.service.impl;

import com.longyi.rbacdemo.entity.SysUser;
import com.longyi.rbacdemo.mapper.UserMapper;
import com.longyi.rbacdemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    public List<SysUser> getUser() {
        return userMapper.getUser();
    }
}
```



- SysUserController

```java
package com.longyi.rbacdemo.controller;

import com.longyi.rbacdemo.entity.SysUser;
import com.longyi.rbacdemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("info")
    public List<SysUser> info(){
        return this.userService.getUser();
    }
}
```





- 结果

```json
[
  {
    "id": 2,
    "username": "admin",
    "password": "$2a$10$eWxhrcPVnMMrnyrxWa./1.d19QuBMS33amEaVVjIETsxk4kes2HKG",
    "orgId": "1",
    "enabled": true,
    "phone": "13756823456",
    "email": "Xx@163.com",
    "createTime": "2020-02-27T18:37:47.000+0000",
    "roles": [
        {
        "id": 2,
        "roleName": "管理员",
        "roleDesc": "系统管理员",
        "roleCode": "admin",
        "sort": 1,
        "status": false
        }
    ]
  },
  {
    "id": 1,
    "username": "yanfa1",
    "password": "$2a$10$dpdjlMhNK70nHcuF3SHf2elXTPTY1CJFgnVvrVc6gfeqsce.PAARK",
    "orgId": "5",
    "enabled": true,
    "phone": null,
    "email": "111@qq.com",
    "createTime": "2020-02-28T09:16:30.000+0000",
    "roles": [
        {
        "id": 1,
        "roleName": "普通用户",
        "roleDesc": "普通用户",
        "roleCode": "common",
        "sort": 2,
        "status": false
        }
    ]
  }
]
```



### set

set用于update语句，可以判断更新语句中没变更的值不做重复的update操作，也就是，如果这个字段的值没变，那么就不会拼接这个字段

```xml
<update id="update" parameterType="com.longyi.rbacdemo.entity.SysUser">
        update sys_user
        <set>
            <if test="username!=null ">
                username = #{username},
            </if>
            <if test="password!=null ">
                password = #{password},
            </if>
            <if test="orgId!=null ">
                org_id = #{orgId},
            </if>
            <if test="enabled!=null ">
                enabled = #{enabled},
            </if>
            <if test="createTime!=null ">
                create_time = #{createTime}
            </if>
        </set>
        where id = #{id}
</update>
```



### foreach

foreach用于查询中的in，可以迭代生成一系列的值，比如可以将传进来的list参数转换成括号包裹，逗号分隔的形式，以便于我们拼接in语句

```xml
<select id="batchSelect" parameterType="com.longyi.rbacdemo.entity.SysUser" resultMap="SysUserMap">
        select
        <include refid="userColumn"></include>
        from sys_user
        <where>
            <foreach collection="ids" item="id" open="id in (" separator="," close=")">
                #{id}
            </foreach>
        </where>
</select>
```

- UserMapper.java

```java
package com.longyi.rbacdemo.mapper;

import com.longyi.rbacdemo.entity.SysUser;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface UserMapper {

    List<SysUser> batchSelect(@Param("ids") List<Integer> ids);
}
```



## 4. 遍历树形菜单

### sql

```sql
Dump of table sys_menu

DROP TABLE IF EXISTS `sys_menu`;

CREATE TABLE `sys_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_pid` int(11) NOT NULL COMMENT '父菜单ID',
  `menu_pids` varchar(64) NOT NULL COMMENT '当前菜单所有父菜单',
  `is_leaf` tinyint(1) NOT NULL COMMENT '0:不是叶子节点，1:是叶子节点',
  `menu_name` varchar(16) NOT NULL COMMENT '菜单名称',
  `url` varchar(64) DEFAULT NULL COMMENT '跳转URL',
  `icon` varchar(45) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL COMMENT '排序',
  `level` int(11) NOT NULL COMMENT '菜单层级',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否禁用，0:启用(否）,1:禁用(是)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统菜单表';


INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `menu_name`, `url`, `icon`, `sort`, `level`, `status`)
VALUES
	(1,0,'[0]',0,'系统根目录','/','',1,1,0),
	(2,1,'[0],[1]',0,'系统管理','/system','el-icon-fa fa-cogs',1,2,0),
	(3,2,'[0],[1],[2]',1,'用户管理','/home/sysuser','el-icon-fa fa-user',1,3,0),
	(4,2,'[0],[1],[2]',1,'角色管理','/home/sysrole','el-icon-fa fa-users',2,3,0),
	(5,2,'[0],[1],[2]',1,'组织管理','/home/sysorg','el-icon-fa fa-sitemap',3,3,0),
	(6,2,'[0],[1],[2]',1,'菜单管理','/home/sysmenu','el-icon-fa fa-list-ul',4,3,0),
	(7,2,'[0],[1],[2]',1,'接口管理','/home/sysapi','el-icon-fa fa-plug',5,3,1),
	(10,1,'[0],[1]',0,'测试用菜单','/order','el-icon-eleme',2,2,0),
	(11,10,'[0],[1],[10]',1,'子菜单(首页)','/home/firstpage','el-icon-lock',1,3,0),
	(12,2,'[0],[1],[2]',1,'参数配置','/home/sysconfig','el-icon-fa fa-cog',6,3,0),
	(13,2,'[0],[1],[2]',1,'数据字典','/home/sysdict','el-icon-fa fa-list-ol',7,3,0);
```



### MenuMapper.xml

这种写法是可以遍历三级的菜单

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.longyi.rbacdemo.mapper.MenuMapper">
    <resultMap id="SysMenuMap" type="com.longyi.rbacdemo.entity.SysMenu">
        <id column="id" property="id"/>
        <result column="menu_pid" property="menuPid"/>
        <result column="menu_pids" property="menuPids"/>
        <result column="menu_name" property="menuName"/>
        <result column="is_leaf" property="isLeaf"/>
        <result column="sort" property="sort"/>
        <result column="level" property="level"/>
        <result column="status" property="status"/>
        <collection property="children" ofType="com.longyi.rbacdemo.entity.SysMenu">
            <id column="id2" property="id"/>
            <result column="menu_pid" property="menuPid"/>
            <result column="menu_pids" property="menuPids"/>
            <result column="menu_name2" property="menuName"/>
            <result column="is_leaf" property="isLeaf"/>
            <result column="sort" property="sort"/>
            <result column="level" property="level"/>
            <result column="status" property="status"/>
            <collection property="children" ofType="com.longyi.rbacdemo.entity.SysMenu">
                <id column="id3" property="id"/>
                <result column="menu_pid" property="menuPid"/>
                <result column="menu_pids" property="menuPids"/>
                <result column="menu_name3" property="menuName"/>
                <result column="is_leaf" property="isLeaf"/>
                <result column="sort" property="sort"/>
                <result column="level" property="level"/>
                <result column="status" property="status"/>
            </collection>
        </collection>
    </resultMap>

    <sql id="menuColumn">
        id,menu_pid,menu_pids,menu_name,is_leaf,sort,level,status
    </sql>
  
    <select id="menuTree" resultMap="SysMenuMap">
        select m1.id,m1.menu_name,m2.id as 'id2',m2.menu_name as 'menu_name2',m3.id as 'id3',m3.menu_name as 'menu_name3' from sys_menu m1,sys_menu m2,sys_menu m3 where m1.id = m2.menu_pid and m2.id = m3.menu_pid
    </select>
</mapper>
```



### MenuMapper.java

```java
package com.longyi.rbacdemo.mapper;

import com.longyi.rbacdemo.entity.SysMenu;

import java.util.List;

public interface MenuMapper {

    List<SysMenu> menuTree();
}
```



### MenuController.java

为了简单，这里就不新建service和impl了，直接在controller调用mapper

```java
package com.longyi.rbacdemo.controller;

import com.longyi.rbacdemo.entity.SysMenu;
import com.longyi.rbacdemo.mapper.MenuMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("menus")
public class MenuController {

    @Autowired
    private MenuMapper menuMapper;

    @GetMapping("tree")
    public List<SysMenu> menuTree(){
        return menuMapper.menuTree();
    }
}
```



### 结果

```json
[
    {
        "id": 1,
        "menuPid": null,
        "menuPids": null,
        "isLeaf": null,
        "menuName": "系统根目录",
        "url": null,
        "icon": null,
        "sort": null,
        "level": null,
        "status": null,
        "children": [
            {
                "id": 2,
                "menuPid": null,
                "menuPids": null,
                "isLeaf": null,
                "menuName": "系统管理",
                "url": null,
                "icon": null,
                "sort": null,
                "level": null,
                "status": null,
                "children": [
                    {
                        "id": 3,
                        "menuPid": null,
                        "menuPids": null,
                        "isLeaf": null,
                        "menuName": "用户管理",
                        "url": null,
                        "icon": null,
                        "sort": null,
                        "level": null,
                        "status": null,
                        "children": null
                    },
                    {
                        "id": 4,
                        "menuPid": null,
                        "menuPids": null,
                        "isLeaf": null,
                        "menuName": "角色管理",
                        "url": null,
                        "icon": null,
                        "sort": null,
                        "level": null,
                        "status": null,
                        "children": null
                    },
                    {
                        "id": 5,
                        "menuPid": null,
                        "menuPids": null,
                        "isLeaf": null,
                        "menuName": "组织管理",
                        "url": null,
                        "icon": null,
                        "sort": null,
                        "level": null,
                        "status": null,
                        "children": null
                    },
                    {
                        "id": 6,
                        "menuPid": null,
                        "menuPids": null,
                        "isLeaf": null,
                        "menuName": "菜单管理",
                        "url": null,
                        "icon": null,
                        "sort": null,
                        "level": null,
                        "status": null,
                        "children": null
                    },
                    {
                        "id": 7,
                        "menuPid": null,
                        "menuPids": null,
                        "isLeaf": null,
                        "menuName": "接口管理",
                        "url": null,
                        "icon": null,
                        "sort": null,
                        "level": null,
                        "status": null,
                        "children": null
                    },
                    {
                        "id": 12,
                        "menuPid": null,
                        "menuPids": null,
                        "isLeaf": null,
                        "menuName": "参数配置",
                        "url": null,
                        "icon": null,
                        "sort": null,
                        "level": null,
                        "status": null,
                        "children": null
                    },
                    {
                        "id": 13,
                        "menuPid": null,
                        "menuPids": null,
                        "isLeaf": null,
                        "menuName": "数据字典",
                        "url": null,
                        "icon": null,
                        "sort": null,
                        "level": null,
                        "status": null,
                        "children": null
                    }
                ]
            },
            {
                "id": 10,
                "menuPid": null,
                "menuPids": null,
                "isLeaf": null,
                "menuName": "测试用菜单",
                "url": null,
                "icon": null,
                "sort": null,
                "level": null,
                "status": null,
                "children": [
                    {
                        "id": 11,
                        "menuPid": null,
                        "menuPids": null,
                        "isLeaf": null,
                        "menuName": "子菜单(首页)",
                        "url": null,
                        "icon": null,
                        "sort": null,
                        "level": null,
                        "status": null,
                        "children": null
                    }
                ]
            }
        ]
    }
]
```

