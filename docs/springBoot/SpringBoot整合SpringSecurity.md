---
sidebar: auto
---

# SpringBoot整合SpringSecurity

## 1.搭建工程

### 1.1 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.10.RELEASE</version>
    </parent>

    <groupId>com.longyi</groupId>
    <artifactId>boot-vue-back</artifactId>
    <packaging>jar</packaging>
    <version>1.0</version>

    <properties>
        <!-- 文件拷贝时的编码 -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <!-- 编译时的编码 -->
        <maven.compiler.encoding>UTF-8</maven.compiler.encoding>
        <!--一般的工程中定义当前项目所用的jdk版本-->
        <java.version>1.8</java.version>
        <!--通过maven插件定义当前项目所用的jdk版本和编码-->
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.2.0</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>

        <!--jwt-->
<!--        <dependency>-->
<!--            <groupId>io.jsonwebtoken</groupId>-->
<!--            <artifactId>jjwt</artifactId>-->
<!--            <version>0.9.1</version>-->
<!--        </dependency>-->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.10.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.10.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.10.5</version>
            <scope>runtime</scope>
        </dependency>


        <!--测试配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>RELEASE</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- 用来编译项目-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
            <!-- 用来package成可执行的jar包-->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```



### 1.2 启动类

```java
package com.longyi;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author wuyanshen
 * @date 2020-03-19 1:00 上午
 * @discription 启动类
 */
@SpringBootApplication
@MapperScan(basePackages = "com.longyi.dao")
public class VueBackApp {
    public static void main(String[] args) {
        SpringApplication.run(VueBackApp.class, args);
    }
}
```



### 1.3 application.yml

```yaml
server:
  port: 3001
  servlet:
    session:
      timeout: 20s  # SpringBoot默认session超时是1分钟，小于1分钟还是1分钟
      cookie:
        http-only: true #这样设置就不能通过js脚本获取cookie
#        secure: true #只有https请求才会携带cookie

spring:
  application:
    name: VueBackApp
  security:
    loginType: JSON

  session:
    timeout: 30m

  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/vue-boot-back?serverTimezone=Asia/Shanghai
    username: root
    password: root
    type: com.zaxxer.hikari.HikariDataSource


mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
#logging:
#  level:
#    org.springframework.security: DEBUG

```



### 1.4 安全配置

#### 1.4.1 主配置

SecurityConfig.java

```java
package com.longyi.config;

import com.longyi.security.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import javax.sql.DataSource;


/**
 * @author wuyanshen
 * @date 2020-03-19 11:42 上午
 * @discription SpringSecurity配置
 */
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private CommonExpiredSessionStrategy commonExpiredSessionStrategy;

    @Autowired
    private CommonLoginSuccessHandler commonLoginSuccessHandler;

    @Autowired
    private CommonLoginFailureHandler commonLoginFailureHandler;

    @Autowired
    private CommonUserDetailService commonUserDetailService;

    @Autowired
    private CommonAccessDeniedHandler commonAccessDeniedHandler;

    @Autowired
    private CommonLogoutSuccessHandler commonLogoutSuccessHandler;

    @Autowired
    private DataSource dataSource;

    @Override
    public void configure(WebSecurity web) throws Exception {
        // 设置拦截忽略url - 会直接过滤该url - 将不会经过Spring Security过滤器链
        // 设置拦截忽略文件夹，可以对静态资源放行
        web.ignoring().antMatchers("/favicon.ico","/img/**","/css/**", "/js/**");
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {
            http
                    .logout()
                        .logoutUrl("/signout")
//                        .logoutSuccessUrl("/login.html")
                        .logoutSuccessHandler(commonLogoutSuccessHandler)
                        .deleteCookies("JSESSIONID")
                .and()
                    .csrf().disable()
                    .rememberMe()
                        .rememberMeCookieName("remember-me-cookie")
                        .rememberMeParameter("remember-me-new")
                        .tokenValiditySeconds(2*24*60*60)
                        .tokenRepository(persistentTokenRepository())
                .and()
                    .formLogin()
                        .loginProcessingUrl("/login")
                        .loginPage("/login.html")
                        .successForwardUrl("/index.html")
                        .successHandler(commonLoginSuccessHandler)
                        .failureHandler(commonLoginFailureHandler)
                .and()
                    .authorizeRequests()
                    .antMatchers("/login","/login.html").permitAll()
                    .anyRequest().access("@commonHasPermission.hasPermision(request,authentication)")
//                    .anyRequest()
//                    .authenticated()
                .and()
                    .exceptionHandling()
                        .accessDeniedHandler(commonAccessDeniedHandler)
                .and()
                    .sessionManagement()
                        //默认的session生成策略
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .sessionFixation().migrateSession()
                         //指定最大登录数
                        .maximumSessions(1)
                        // 当达到最大值时，旧用户被踢出后的操作
                        .expiredSessionStrategy(commonExpiredSessionStrategy)
                        // 当达到最大值时，是否保留已经登录的用户，为true，新用户无法登录；为 false，旧用户被踢出
                        .maxSessionsPreventsLogin(false);

    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(commonUserDetailService)
                .passwordEncoder(bCryptPasswordEncoder());
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    /**
     * remember持久化
     *
     * @param
     * @return PersistentTokenRepository
     */
    @Bean
    public PersistentTokenRepository persistentTokenRepository(){
        JdbcTokenRepositoryImpl tokenRepository = new JdbcTokenRepositoryImpl();
        tokenRepository.setDataSource(dataSource);
        return tokenRepository;
    }

}
```

> 说明：
>
> 在springMVC项目中我们需要在配置@Configuration注解的配置类上再加一个`@EnableWebSecurity`来启用SpringSecurity。
>
> 如果我们是SpringBoot项目，就不需要加这个注解了，SpringBoot默认开启了SpringSecuriy，因为在`WebSecurityEnablerConfiguration`类上已经加上了`@EnableWebSecurity`这个注解
>
> ```java
> @Configuration
> @ConditionalOnBean({WebSecurityConfigurerAdapter.class})
> @ConditionalOnMissingBean(
>  name = {"springSecurityFilterChain"}
> )
> @ConditionalOnWebApplication(
>  type = Type.SERVLET
> )
> @EnableWebSecurity
> public class WebSecurityEnablerConfiguration {
>  public WebSecurityEnablerConfiguration() {
>  }
> }
> ```
> 说明：
>
> @EnableGlobalMethodSecurity(securedEnabled = true,prePostEnabled = true)：其中
>
> 1.securedEnabled = true是开启方法的安全注解，开启之后就可以在方法上使用@secure和>@PreAuthorize注解了
>
> 2.prePostEnabled = true是开启了方法的权限表达式，我们就可以像@PreAuthorize("hasAuthority('sys:user:find')")这样在注解里使用表达式来判断权限了
>
> 



#### 1.4.2 动态判断权限(重点)

```java
package com.longyi.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import javax.servlet.http.HttpServletRequest;

/**
 * @author wuyanshen
 * @date 2020-03-24 2:52 下午
 * @discription 自定义动态判断权限
 */
@Component
public class CommonHasPermission {

    private AntPathMatcher antPathMatcher = new AntPathMatcher();

    public boolean hasPermision(HttpServletRequest request, Authentication authentication){
        if(authentication.getPrincipal() instanceof CommonUser){
            CommonUser commonUser = (CommonUser)authentication.getPrincipal();
            return commonUser.getAuthorities().stream().anyMatch(permission ->antPathMatcher.match(permission.getAuthority(),request.getRequestURI()));
        }
        return false;
    }
}
```

> 说明：
>
> 这个是实现动态判断访问url地址是否有权限的核心，之前我们都是在写死路径对应需要的权限，这个类可以通过查数据库动态判断url对应的权限



#### 1.4.3 自定义认证用户

```java
package com.longyi.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

/**
 * @author wuyanshen
 * @date 2020-03-24 5:23 下午
 * @discription 自定义认证用户
 */
public class CommonUser extends User {

    /**机构id*/
    @Getter
    private Integer orgId;

    public CommonUser(String username, String password, Integer orgId, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.orgId = orgId;
    }
}
```



#### 1.4.4 自定义认证查询

```java
package com.longyi.security;

import com.longyi.dao.SysMenuDao;
import com.longyi.dao.SysRoleDao;
import com.longyi.dao.SysUserDao;
import com.longyi.entity.SysMenu;
import com.longyi.entity.SysRole;
import com.longyi.entity.SysUser;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author wuyanshen
 * @date 2020-03-24 1:44 上午
 * @discription 自定义认证查询方法
 */
@Component
public class CommonUserDetailService implements UserDetailsService {

    @Autowired
    private SysUserDao sysUserDao;
    @Autowired
    private SysRoleDao sysRoleDao;
    @Autowired
    private SysMenuDao sysMenuDao;

    @SneakyThrows
    @Override
    public UserDetails loadUserByUsername(String username) {
        //获取用户
        SysUser sysUser = sysUserDao.loadUserByUsername(username);

        if(sysUser == null){
            throw new UsernameNotFoundException("您输入的用户不存在");
        }

        //获取角色
        List<SysRole> roles = sysRoleDao.loadRolesByUsername(username);
        List<String> roleCodes = roles.stream().map(sysRole -> sysRole.getRoleCode()).collect(Collectors.toList());

        //获取可以访问的菜单
        List<SysMenu> sysMenus = sysMenuDao.loadPermissionByRoleCode(roleCodes);
        List<String> urls = sysMenus.stream().map(sysMenu -> sysMenu.getUrl()).collect(Collectors.toList());

        //将可以访问的菜单和角色合并
        urls.addAll(roleCodes.stream().map(roleCode-> "ROLE_"+roleCode).collect(Collectors.toList()));
        String auths = urls.stream().collect(Collectors.joining(","));

//        List<SimpleGrantedAuthority> collection = authCodes.stream().map(str -> new SimpleGrantedAuthority(str)).collect(Collectors.toList());

        return new CommonUser(sysUser.getUsername(),sysUser.getPassword(),sysUser.getOrgId(),sysUser.isStatus(),true,true,true,AuthorityUtils.commaSeparatedStringToAuthorityList(auths));
    }
}
```



#### 1.4.5 自定义登录成功后的处理

```java
package com.longyi.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Key;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @author wuyanshen
 * @date 2020-03-23 1:47 下午
 * @discription 自定义登录成功后的处理
 */

@Slf4j
@Component
public class CommonLoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${spring.security.loginType}")
    private String loginType;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        log.info("=== 用户【{}】在 {} 登录了系统 ===", authentication.getName(), sdf.format(new Date()));

        if(loginType.equalsIgnoreCase("JSON")){

            //生成token
            Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
            String jws = Jwts.builder().setSubject("Joe").signWith(key).compact();

            response.setContentType("application/json;charset=UTF-8");
            Map map = new HashMap();
            map.put("code","200");
            map.put("msg","登录成功");
            map.put("token",jws);

            response.getWriter().write(objectMapper.writeValueAsString(map));
        }else {
            super.onAuthenticationSuccess(request,response,authentication);
        }
    }
}
```



#### 1.4.6 自定义登录失败后的处理

```java
package com.longyi.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * @author wuyanshen
 * @date 2020-03-23 4:16 下午
 * @discription 自定义登录失败的处理
 */
@Slf4j
@Component
public class CommonLoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${spring.security.loginType}")
    private String loginType;

    @SneakyThrows
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception){
        if(loginType.equalsIgnoreCase("JSON")){
            response.setContentType("application/json;charset=UTF-8");
            Map map = new HashMap();

            if(exception instanceof DisabledException){
                map.put("code","1");
                map.put("msg","账户已被禁用，请联系管理员");
            }else if(exception instanceof BadCredentialsException){
                map.put("code","1");
                map.put("msg","用户名或密码错误");
            }else if(exception instanceof UsernameNotFoundException){
                map.put("code","1");
                map.put("msg","用户名不存在");
            }else {
                map.put("code","500");
                map.put("msg","系统错误，请联系管理员");
            }

            response.getWriter().write(objectMapper.writeValueAsString(map));
        }else {
            super.onAuthenticationFailure(request,response,exception);
        }
    }
}
```



#### 1.4.7 自定义访问拒绝处理

```java
package com.longyi.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author wuyanshen
 * @date 2020-03-24 4:59 下午
 * @discription 自定义登录后访问拒绝处理
 */
@Component
public class CommonAccessDeniedHandler implements AccessDeniedHandler {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setContentType("application/json;charset=UTF-8");
        Map<String,Object> map = new HashMap<>();
        map.put("code",403);
        map.put("msg","您无权访问该资源，请联系管理员");
        response.getWriter().write(objectMapper.writeValueAsString(map));
    }
}
```

> 说明：
>
> AccessDeniedHandler是处理在**登录后**访问未授权资源的情况



#### 1.4.8 自定义退出成功后的处理

```java
package com.longyi.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author wuyanshen
 * @date 2020-03-24 10:53 下午
 * @discription 自定义退出成功后的处理
 */
@Slf4j
@Component
public class CommonLogoutSuccessHandler implements LogoutSuccessHandler {
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        log.info("=== 用户【{}】在 {} 退出了系统 ===", authentication.getName(), sdf.format(new Date()));
        response.sendRedirect("/login.html");
    }
}
```



#### 1.4.9 自定义强制下线后的提示

```java
package com.longyi.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.session.SessionInformationExpiredEvent;
import org.springframework.security.web.session.SessionInformationExpiredStrategy;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * @author wuyanshen
 * @date 2020-03-23 1:13 下午
 * @discription 自定义强制下线后的提示
 */
@Component
public class CommonExpiredSessionStrategy implements SessionInformationExpiredStrategy {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void onExpiredSessionDetected(SessionInformationExpiredEvent event) throws IOException, ServletException {
        HttpServletResponse response = event.getResponse();
        response.setContentType("application/json;charset=utf-8");
        PrintWriter writer = response.getWriter();
        Map<String,Object> map = new HashMap<>();
        map.put("msg","已经在另一台机器登录，您被迫下线。");
        map.put("code",0);
        String res = objectMapper.writeValueAsString(map);
        writer.write(res);
    }
}
```



#### 1.4.10 自定义匿名访问的处理

```java
package com.longyi.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author wuyanshen
 * @date 2020-03-25 1:34 下午
 * @discription 自定义匿名访问(也就是没登录就访问)资源的提示
 */
@Component
public class CommonAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json;charset=utf-8");
        Map<String,Object> map = new HashMap<>();
        map.put("code",401);
        map.put("msg","您无权访问");
        response.getWriter().write(objectMapper.writeValueAsString(map));
    }
}
```

> 说明：
>
> 匿名访问就是指在没有登录的情况下访问资源
>
> AuthenticationEntryPoint是处理在**未登录**的情况下访问资源的情况



#### 1.4.11 自定义Token过滤器

```java
package com.longyi.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.longyi.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author wuyanshen
 * @date 2020-03-25 2:18 下午
 * @discription 校验token过滤器
 * OncePerRequestFilter 可以保证一个请求只执行一次TokenFilter过滤器
 */
@Component
@Slf4j
public class TokenFilter extends OncePerRequestFilter {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CommonUserDetailService commonUserDetailService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if(request.getRequestURI().equals("/login") && request.getMethod().equalsIgnoreCase("post")){
            filterChain.doFilter(request,response);
            //这里必须使用return，否则登录请求(/login)还继续会往下走
            return;
        }
        response.setContentType("application/json;charset=utf-8");
        Map<String,Object> map = new HashMap<>();

        String token = request.getHeader("token");
        if (token == null){
            map.put("code",403);
            map.put("msg","请求中必须携带token");
            response.getWriter().write(objectMapper.writeValueAsString(map));
            return;
        }

        //验证token
        if(!JwtUtil.validateToken(token)){
            log.info("token校验失败");
            map.put("code",403);
            map.put("msg","无效的token");
            response.getWriter().write(objectMapper.writeValueAsString(map));
            return;
        }

        //解析token
        Map<String, Object> stringObjectMap = JwtUtil.parseToken(token);
        String username = stringObjectMap.get("username").toString();
        UserDetails userDetails = commonUserDetailService.loadUserByUsername(username);
        if (userDetails == null){
            map.put("code",403);
            map.put("msg","token中的用户不存在");
            response.getWriter().write(objectMapper.writeValueAsString(map));
            return;
        }

        //将认证信息放到SpringSecurity上下文中
        UsernamePasswordAuthenticationToken authenticationToken
                = new UsernamePasswordAuthenticationToken(userDetails,null,
                userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        //继续走其它过滤器
        filterChain.doFilter(request,response);
    }
}
```

> 说明：
>
> 使用过滤器校验接口请求中是否带有token，如果有就校验正确性，校验通过后就查询用户对应的权限，最后将权限设置到Spring Security的全局上下文中，Spring Security就可以判断用户是否有权限调用该接口

 

#### 1.4.12 JWT工具类

```java
package com.longyi.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.experimental.UtilityClass;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

/**
 * @author wuyanshen
 * @date 2020-03-25 2:31 下午
 * @discription Jwt加密，验证工具类
 */
@UtilityClass
public class JwtUtil {

    /**
     * key（按照签名算法的字节长度设置key）
     */
    private final static String SECRET_KEY = "0123456789_0123456789_0123456789";

    /**
     * 过期时间（毫秒单位）
     */
    private final static long TOKEN_EXPIRE_MILLIS = 1000 * 60 * 60; //1小时

    /**
     * 生成token
     *
     * @param claimMap
     * @return java.lang.String
     */
    public String createToken(Map<String, Object> claimMap){
        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(new Date(System.currentTimeMillis()))    // 设置签发时间
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_EXPIRE_MILLIS))   // 设置过期时间
                .addClaims(claimMap) //设置主体内容
                .signWith(generateKey()) //设置签名算法
                .compact();
    }

    /**
     * 校验token
     *
     * @param token
     * @return java.lang.Boolean
     */
    public Boolean validateToken(String token){
        try {
            Jwts.parser().setSigningKey(generateKey()).parseClaimsJws(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }

    /**
     * 解析token
     *
     * @param token
     * @return Map<Object>
     */
    public Map<String,Object> parseToken(String token){
        return Jwts.parser()  // 得到DefaultJwtParser
                .setSigningKey(generateKey()) // 设置签名密钥
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 生成安全密钥
     * @return
     */
    public Key generateKey() {
        return new SecretKeySpec(SECRET_KEY.getBytes(), SignatureAlgorithm.HS256.getJcaName());
    }

}
```





## 2. 数据库设计

### 2.1 核心表

用户表(sys_user)

角色表(sys_role)

用户角色关联表(sys_user_role)

菜单表(sys_menu)

角色菜单关联表(sys_role_menu)

> 说明：
>
> 基于RBAC权限管理模型，最少这5张表



### 2.2 表关系

用户表 -> 角色表：多对多

角色表 -> 菜单表：多对多

机构表 -> 用户表:  多对一 ，用户表存机构表的id（一对多关系中，外键存在多的一方）



### 2.3 表sql

```sql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `menu_pid` int(11) DEFAULT NULL COMMENT '父id',
  `menu_pids` varchar(64) DEFAULT NULL COMMENT '所有的父id',
  `menu_name` varchar(20) DEFAULT NULL COMMENT '菜单名称',
  `url` varchar(64) DEFAULT NULL COMMENT '菜单路径',
  `permission` varchar(20) DEFAULT NULL COMMENT '权限标识',
  `is_leaf` int(2) DEFAULT NULL COMMENT '是否叶子节点，1:是，0:不是',
  `level` int(2) DEFAULT NULL COMMENT '菜单第几级',
  `icon` varchar(20) DEFAULT NULL COMMENT '菜单图标',
  `status` int(2) DEFAULT '1' COMMENT '状态,1可用0不可用',
  `sort` int(4) DEFAULT NULL COMMENT '排序',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `del_flag` int(2) DEFAULT '0' COMMENT '是否删除,1已删0未删',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COMMENT='菜单表';

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu` VALUES (1, 0, '0', '系统管理', NULL, NULL, 0, 1, NULL, 1, 1, '2020-03-23 16:25:57', '2020-03-23 16:40:12', 0);
INSERT INTO `sys_menu` VALUES (2, 1, '1', '用户管理', '/user.html', '', 1, 2, NULL, 1, 1, '2020-03-23 16:41:33', '2020-03-24 08:04:09', 0);
INSERT INTO `sys_menu` VALUES (3, 1, '1', '日志管理', '/log.html', '', 1, 2, NULL, 1, 2, '2020-03-23 16:42:09', '2020-03-24 08:04:12', 0);
INSERT INTO `sys_menu` VALUES (4, 1, '1', '业务一', '/biz1.html', '', 1, 2, NULL, 1, 3, '2020-03-23 16:44:55', '2020-03-24 08:15:20', 0);
INSERT INTO `sys_menu` VALUES (5, 1, '1', '业务二', '/biz2.html', '', 1, 2, NULL, 1, 4, '2020-03-23 16:45:18', '2020-03-24 08:15:26', 0);
INSERT INTO `sys_menu` VALUES (6, NULL, NULL, NULL, '/index.html', NULL, NULL, NULL, NULL, 1, NULL, '2020-03-24 08:01:34', '2020-03-24 08:04:18', 0);
INSERT INTO `sys_menu` VALUES (7, 2, '1,2', '用户查询', '/sysUser/info', '', NULL, NULL, NULL, 1, NULL, '2020-03-24 08:24:46', '2020-03-24 08:49:50', 0);
COMMIT;

-- ----------------------------
-- Table structure for sys_org
-- ----------------------------
DROP TABLE IF EXISTS `sys_org`;
CREATE TABLE `sys_org` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `org_pid` int(11) DEFAULT NULL COMMENT '父节点id',
  `org_pids` varchar(20) DEFAULT NULL COMMENT '所有的父节点',
  `is_leaf` int(2) DEFAULT NULL COMMENT '是否叶子节点',
  `org_name` varchar(20) DEFAULT NULL COMMENT '组织机构名称',
  `address` varchar(64) DEFAULT NULL COMMENT '地址',
  `status` int(2) DEFAULT '1' COMMENT '状态,1启用0无效',
  `sort` int(4) DEFAULT NULL COMMENT '排序',
  `level` int(4) DEFAULT NULL COMMENT '菜单的层级',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `del_flag` int(2) DEFAULT '0' COMMENT '是否删除,1已删0未删',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='组织机构表';

-- ----------------------------
-- Records of sys_org
-- ----------------------------
BEGIN;
INSERT INTO `sys_org` VALUES (1, 0, '0', 0, '总部', '北京海淀', 1, 1, 1, '2020-03-23 16:34:37', '2020-03-23 16:34:40', 0);
INSERT INTO `sys_org` VALUES (2, 1, '1', 0, '研发部', '北京海淀', 1, 1, 2, '2020-03-23 16:36:31', '2020-03-23 16:36:31', 0);
INSERT INTO `sys_org` VALUES (3, 2, '1,2', 1, '研发一部', '北京海淀', 1, 1, 3, '2020-03-23 16:37:36', '2020-03-23 16:37:36', 0);
INSERT INTO `sys_org` VALUES (4, 2, '1,2', 1, '研发二部', '北京海淀', 1, 2, 3, '2020-03-23 16:38:09', '2020-03-23 16:38:09', 0);
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `role_name` varchar(20) DEFAULT NULL COMMENT '角色名称',
  `role_code` varchar(20) DEFAULT NULL COMMENT '角色英文名称',
  `sort` int(4) DEFAULT NULL COMMENT '排序',
  `status` int(2) DEFAULT '1' COMMENT '状态,1可用0不可用',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `del_flag` int(2) DEFAULT '0' COMMENT '是否删除,1已删0未删',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` VALUES (1, '管理员', 'admin', 1, 1, '2020-03-23 16:32:26', '2020-03-23 16:32:26', 0);
INSERT INTO `sys_role` VALUES (2, '普通用户', 'common', 2, 1, '2020-03-23 16:33:15', '2020-03-23 16:33:15', 0);
COMMIT;

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `role_id` int(11) DEFAULT NULL COMMENT '角色id',
  `menu_id` int(11) DEFAULT NULL COMMENT '菜单id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COMMENT='角色和菜单关联表';

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_role_menu` VALUES (1, 1, 2);
INSERT INTO `sys_role_menu` VALUES (2, 1, 3);
INSERT INTO `sys_role_menu` VALUES (3, 2, 4);
INSERT INTO `sys_role_menu` VALUES (4, 2, 5);
INSERT INTO `sys_role_menu` VALUES (5, 1, 6);
INSERT INTO `sys_role_menu` VALUES (6, 2, 6);
INSERT INTO `sys_role_menu` VALUES (7, 1, 7);
COMMIT;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `org_id` int(11) DEFAULT NULL COMMENT '组织机构id',
  `username` varchar(10) DEFAULT NULL COMMENT '用户名',
  `password` varchar(200) DEFAULT NULL COMMENT '密码',
  `email` varchar(20) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) DEFAULT NULL COMMENT '电话',
  `avatar` varchar(50) DEFAULT NULL COMMENT '头像',
  `status` int(2) DEFAULT '1' COMMENT '状态,1可用0不可用',
  `sort` int(4) DEFAULT NULL COMMENT '排序',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `del_flag` int(2) DEFAULT '0' COMMENT '是否删除,1已删0未删',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Records of sys_user
-- ----------------------------
BEGIN;
INSERT INTO `sys_user` VALUES (1, 3, 'admin', '$2a$10$RcT2uUd7h2tRKt1WoZNfcuBl3jYptVklF1Q1cydNuO800xRaH6Xla', NULL, NULL, NULL, 1, 1, NULL, '2020-03-24 09:19:11', 0);
INSERT INTO `sys_user` VALUES (2, 1, 'yanfa1', '$2a$10$RcT2uUd7h2tRKt1WoZNfcuBl3jYptVklF1Q1cydNuO800xRaH6Xla', NULL, NULL, NULL, 1, 2, '2020-03-23 16:53:46', '2020-03-24 08:14:03', 0);
COMMIT;

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `role_id` int(11) DEFAULT NULL COMMENT '角色id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='用户和角色关联表';

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_user_role` VALUES (1, 1, 1);
INSERT INTO `sys_user_role` VALUES (2, 2, 2);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
```





## 2.Session管理

### 2.1 yml配置

- SpringBoot自带的session配置(推荐使用这种)

```yaml
server:
  servlet:
    session:
      timeout: 20s  # SpringBoot默认session超时是1分钟，小于1分钟还是1分钟
      cookie:
        http-only: true # 这样设置就不能通过js脚本获取cookie
        secure: true #只有https请求才会携带cookie，只有配置了https再开启这个
```



- 引入相关session依赖后的配置

```yaml
spring:
  session:
    timeout: 30m
```



### 2.2 控制session

```java
@Configuration
@EnableGlobalMethodSecurity(securedEnabled = true,prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private CommonExpiredSessionStrategy commonExpiredSessionStrategy;


    @Override
    protected void configure(HttpSecurity http) throws Exception {
            http
                .csrf().disable()
                .formLogin()
                    .loginProcessingUrl("/login")
                    .loginPage("/Login.html")
                .and()
                    .authorizeRequests()
                    .antMatchers("/login","/Login.html").permitAll()
                    .antMatchers("/sysUser/selectOn").hasAuthority("ADMIN")
                    .anyRequest().
                    authenticated()
                .and()
                    .sessionManagement()
                    //默认的session生成策略
                    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                    .sessionFixation().migrateSession()
                     //指定最大登录数
                    .maximumSessions(1)
                    // 当达到最大值时，旧用户被踢出后的操作
                    .expiredSessionStrategy(commonExpiredSessionStrategy)
                    // 当达到最大值时，是否保留已经登录的用户，为true，新用户无法登录；为 false，旧用户被踢出
                    .maxSessionsPreventsLogin(false);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser("user")
                .password(bCryptPasswordEncoder().encode("123"))
                .authorities("sys:user:find")
                .and()
                .passwordEncoder(bCryptPasswordEncoder());
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
```

> 



## 3.记住我

	### 后端配置

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
  http.rememberMe()
    .rememberMeCookieName("remember-me-cookie")
    .rememberMeParameter("remember-me-new")
    .tokenValiditySeconds(2*24*60*60)
}
```

> 说明：
>
> `rememberMeCookieName`：是浏览器存贮的cookie的名字
>
> `rememberMeParameter`：是页面中复选框中的name名称
>
> `tokenValiditySeconds`：设置cookie失效时间，不设置的话默认14天



### 前端页面配置

```html
<form method="post" action="/login">
        <input name="username"><br>
        <input name="password"><br>
        <input type="checkbox" name="remember-me-new"/>记住密码</label><br>
        <input type="submit" value="登录"><br>
</form>
```



### 记住我持久化

- 后端配置

 ```java
@Autowired
private DataSource dataSource;

//remember持久化
@Bean
public PersistentTokenRepository persistentTokenRepository(){
  JdbcTokenRepositoryImpl tokenRepository = new JdbcTokenRepositoryImpl();
  tokenRepository.setDataSource(dataSource);
  return tokenRepository;
}

@Override
protected void configure(HttpSecurity http) throws Exception {
  http.rememberMe()
    .rememberMeCookieName("remember-me-cookie")
    .rememberMeParameter("remember-me-new")
    .tokenValiditySeconds(2*24*60*60)
    .tokenRepository(persistentTokenRepository())
}
 ```

- sql语句

```sql
create table persistent_logins 
(
  username varchar(64) not null, 
  series varchar(64) primary key,
  token varchar(64) not null,
  last_used timestamp not null
)
```

> 说明：
>
> 这个语句是官方自带的，在`JdbcTokenRepositoryImpl`这个类中



## 4.退出

### 后端配置

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
  http
    .logout()
    .logoutUrl("/signout")
    .logoutSuccessUrl("/")
    .deleteCookies("JSESSIONID")
}
```

> 说明：
>
> `logoutUrl`：触发退出的url
>
> `logoutSuccessUrl`：成功退出后跳转的url
>
> `deleteCookies`：成功退出后删除浏览器中的cookie->JSESSIONID



### 前端配置

```html
<a href="/signout">退出</a>
```



### 成功退出后做一些操作

- CommonLogoutSuccessHandler类

```java
@Slf4j
@Component
public class CommonLogoutSuccessHandler implements LogoutSuccessHandler {
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        log.info("=== 用户【{}】在 {} 退出了系统 ===", authentication.getName(), sdf.format(new Date()));
        response.sendRedirect("/login.html");
    }
}
```



- 配置类

```java
@Autowired
private CommonLogoutSuccessHandler commonLogoutSuccessHandler;

@Override
protected void configure(HttpSecurity http) throws Exception {
  http
    .logout()
    .logoutUrl("/signout")
    .logoutSuccessUrl("/")
    .deleteCookies("JSESSIONID")
    .logoutSuccessHandler(commonLogoutSuccessHandler)
}
```

