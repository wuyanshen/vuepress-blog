---
navbar: true
sidebar: auto
title: Java面试题
---

# JAVA面试题

## 一. java基础部分

### 1.equals与==的区别？

==操作符是用来比较两个变量的值是否相等，即就是比较变量在内存中的存储地址是否相同，equals（）方法s是String类从Object类中继承的，被用来检测两个对象的内容是否相同。



### 2.String s=new String(‘xyz’);创建了几个object对象?

会创建一个String类型的变量s。在类加载到此处之前没有出现“xyz”字面量的话，加载此处会创建一个对应“xyz”的String常量对象。在符合规范的JVM上，执行到此处new关键字会创建一个String对象



### 3.Overload和Override的区别？

重载Overload表示的是同一个类中可以有多个相同名称的方法，但这些方法的参数列表不同，即就是参数或参数类型不同。重载时返回值当然可以不一样，但是如果参数列表完全一致时，不能通过返回类型不一致而实现重载，这是不可以的。

重写Override表示子类中的方法可以与父类中的方法名称和参数完全相同，通过子类创建的对象来调用这个方法时，将调用子类中定义的方法，即就是子类中的该方法将父类的该方法覆盖了。子类覆盖父类方法时只能抛比父类更少或者更小的异常。重写的方法其返回必须和被覆盖的方法返回一致。



### 4.常用的设计模式有哪些？

工厂模式

桥接模式

状态模式

策略模式

模板模式

迭代器模式

门面模式

责任链模式



### 5.抽象类和接口的区别？

抽象类可以有默认的方法进行实现，可以有构造器，可以用main方法进行运行，可以直接在该类中添加实现的方法

接口没有默认的方法进行实现，没有构造器，不可以使用main方法进行运行，在接口中添加方法时需要在具体实现的类中添加方法。



### 6.String、StringBuffer与StringBuilder的区别？

String(字符串常量)：表示内容不可修改的字符串，StringBuffer表示内容可以修改的字符串，

StringBuffer(字符串变量，线程安全)：线程安全的可变字符序列。String覆盖了equals（）方法和hashcode（）方法，而StringBuffer没有覆盖两个方法，所以StringBuffer对象存储到java集合类中时会出现问题。

StringBulider(字符串变量，线程不安全)：一个可变的字符序列是5.0新增的，但不保证同步，也表示内容可以修改的字符串，但是其线程是不安全的，运行效率高



### 7.Java面向对象的特征与含义

封装、继承、抽象、多态



### 8. error和exception区别

error表示有可能恢复但比较困难的的一种严重问题，程序是不能进行处理的

exception表示一种设计或者实现问题。



### 9.try catch finally，try里有return，finally还执行么？

1、finally语句总会执行

2、如果try、catch中有return语句，finally中没有return，那么在finally中修改除包装类型和静态变量、全局变量以外的数据都不会对try、catch中返回的变量有任何的影响（包装类型、静态变量会改变、全局变量）

3、尽量不要在finally中使用return语句，如果使用的话，会忽略try、catch中的返回语句，也会忽略try、catch中的异常，屏蔽了错误的发生

4、finally中避免再次抛出异常，一旦finally中发生异常，代码执行将会抛出finally中的异常信息，try、catch中的异常将被忽略



### 10.Map、Set、List、Queue、Stack的特点与用法

1、Map是以键值对的形式进行存储的，其中key是唯一不可重复的，value的可以重复，当插入的值是key相同，后加入的会将已有的覆盖。他有几个具体的实现类，包括Treemap

和HashMap，TreeMap是有序的，HashMap是无序的。

2、List 有序，可重复

|--ArrayList

底层数据结构是数组，查询快，增删慢，线程不安全，效率高

|--Vector

底层数据结构是数组，查询快，增删慢，线程不安全，效率高

|--LinkedList

底层数据结构是链表，查询慢，增删块，线程安全，效率低

3、Set 无序，唯一

|--HashSet

底层数据结构是哈希表

如何保证元素的唯一性：

依赖两个方法，hashCode（）和equals（）

|--LinkedHashSet

底层数据结构是链表和哈希表，由链表保证元素有序，由哈希表保证元素唯一

|--TreeSet

底层数据结构是红黑树，

如何保证元素的排序：

自然排序：让元素所属的类实现Comparable接口

比较器排序：让集合接收一个Comparator的实现类对象

如何保证元素的唯一性：

根据比较的返回值是否是0来决定的

4、Query队列遵循先进先出的原则，不允许插入null值，其中提供了相应的进队和出队的方法，建议使用offer（）方法来添加元素，使用poll（）方法删除元素

5、Stack遵从后进先出的原则，继承自Vector。他通过5个操作对Vector类进行扩展，它提供了push和pop操作，以及去堆栈顶点的peek（）方法，测试堆栈是否为空的empty方法

6、使用方法：

如果涉及到堆栈，队列等操作，建议使用List

对于快速插入和删除元素建议使用LinkedList

需要快速随机访问元素建议使用ArrayList



### 11.HashMap和Hashtable的区别？

1、Hashtable是基于Dictionary类的，HashMap是Map接口的一个实现类

2、Hashtable是线程安全的，即是同步的；HashMap线程不是安全的，不是同步的。

3、HashMap可以将空值作为key或value



### 12.HashMap、LinkedHashMap、ConcurrentHashMap、ArrayList、LinkedList的底层实现

1、HashMap是java数据结构中两大结构数组和链表的组合。HashMap底层数组，数组中的每一项又是一个链表。程序会先根据key的hashcode（）方法返回值决定该Entry在数组中的

存储位置，如果该位置上没有元素，就会将元素放置在此位置上，如果两个Entry的key相同，会调用equals，返回值是true则覆盖原来的value值，返回false则会形成Entry链，位于

头部

2、ArrrayList的底层实现是数组，在执行add操作时，会先检查数组 大小是否可以容纳新的元素，如果不够就会进行扩容。然后会将原来的数据拷贝到新的数组中

3、LinkedList底层是一个链表，其实现增删改查和数据结构中的操作完全相同，而且插入是有序的

4、LinkedHashMap的底层结构式是双链表，其他的逻辑处理与HashMap一致，同样没有锁保护，多线程使用时存在风险

5、ConcurrentHashMap是segment数组结构和HashEntry数组结构组成的，segment在ConcurrentHashMap中充当锁的角色，HashEntry用于存储键值对数据。segment的结构是数组

和链表，一个segment中有一个HashEntry，每个HashEntry是一个链表结构的元素。对HashEntry中的数据进行修改时，需要先获得它所对应的segment锁。每个ConcurrentHashMap

默认有16个segment。



### 13.什么是java序列化？如何实现java序列化

序列化就是一种用来处理对象流的 机制，所谓对象流也就是将对象的内容进行流化。可以对流化后的对象进行读写操作，也可以将流化后的对象在网络间进行传递。

序列化的实现：将需要被序列化的类实现Serializable接口，该接口没有需要实现的方法，implements Serializable 只是为了标注 该对象时可被序列化的。



### 14.什么是线程安全

线程安全就是多线程访问时，采用了加锁机制，当一个线程访问该类时进行保护，其他线程不能访问直到该线程访问结束，其他的线程才可以使用。一般使用synchronized关键字加锁同步控制来解决线程不安全的问题。



### 15.反射的作用于原理

简单的说，反射机制其实就是指程序在运行的时候可以获取自身的信息。如果知道一个 类的名称或者它的一个实例对象，就能把这个类的所有方法和变量的信息找出来，如果明确知道这个类里的某个方法名和参数个数及类型，还能通过传递参数来运行那个类的方法，这就是反射。在java中，class类与java.lang.reflect类库一起对反射的概念提供了支持，该类库包含了Field、Method以及Construcctor类。



### 16.java中的内存泄漏

java中的内存泄漏广义通俗的说就是：不会再被使用的对象不能被回收。如果长生命周期的对象持有短生命周期的引用，就有可能会出现内存泄漏。



## 二. java web

### 1.Cookie与Session的作用与原理

1、cookie是流浪器保存在用户电脑上的一小段文本，用来保存用户在网站上的必要信息。web页面或者服务器告诉浏览器按照一定的规范存储这些信息，并且在以后的所有请求中，这些信息就会自动加在http

请求头中发送给服务器，服务器根据这些信息判断不同的用户，并且cookie本身是安全的

2、session的作用和cookie差不多，但是session是存储在服务器端的，不会在网络中进行传输，所以比cookie更加安全一些。但是session是依赖cookie的，当用户访问某个站点的时候，服务器会为这个用户产生

唯一的session_id，并把这个session_id以cookie的形式，发送到客户端，以后的客户端请求都会自动携带则cookie。



### 2.Servlet的生命周期是什么？是否是单例？

Servlet 生命周期可被定义为从创建直到毁灭的整个过程。以下是 Servlet 遵循的过程：

Servlet 通过调用 init () 方法进行初始化。

Servlet 调用 service() 方法来处理客户端的请求。

Servlet 通过调用 destroy() 方法终止（结束）。

最后，Servlet 是由 JVM 的垃圾回收器进行垃圾回收的。

Servlet单实例，减少了产生servlet的开销



### 3.MVC各个部分都有哪些技术来实现

MVC 是Model－View－Controller的简写。”Model” 代表的是应用的业务逻辑（通过JavaBean，EJB组件实现）， “View” 是应用的表示面，用于与用户的交互（由JSP页面产生），”Controller” 是提供应用的处

理过程控制（一般是一个Servlet），通过这种设计模型把应用逻辑，处理过程和显示逻辑分成不同的组件实现。这些组件可以进行交互和重用。model层实现系统中的业务逻辑，view层用于与用户的交互，

controller层是model与view之间沟通的桥梁，可以分派用户的请求并选择恰当的视图以用于显示，同时它也可以解释用户的输入并将它们映射为模型层可执行的操作。


## 三. 数据库

### 1.数据库事务的四个特性及含义

原子性(Atomic)：事务中各项操作，要么全做要么全不做，任何一项操作的失败都会导致整个事务的失败； 

一致性(Consistent)：事务结束后系统状态是一致的；

隔离性(Isolated)：并发执行的事务彼此无法看到对方的中间状态；

持久性(Durable)：事务完成后所做的改动都会被持久化，即使发生灾难性的失败。通过日志和同步备份可以在故障发生后重建数据。



### 2.数据库优化

1、选取最实用的字段属性：字段的大小设计较为严谨的话，一方面可以减小资源空间的浪费，另一方面可以加快查询的速度

2、使用连接代替子查询

3、临时表的使用

临时表的使用有好有坏，但对于大量的数据操作来说，还是利大于弊的。

好处：减少阻塞，提高并发性

弊端：频繁建立和删除临时表，浪费系统的资源

4、使用事物。保持事物的一致性和完整性是较为重要的



### 3.sql语句的优化

1、避免全表查询，考虑建立索引

查询的过程中查询所需要的关键字段，全表查询会浪费大量的时间

合理的建立索引会大大的提高sql的效率，但索引并不是越多越好，数据的插入和删除会重新建立索引和修改索引，会消耗大量的时间。

2、避免在where子句中进行如下的操作，这都将导致引擎放弃使用索引而进行全表扫描

进行null值判断（最好不要给数据库留null）、

使用!=或<>操作符、

使用模糊查询like、

对字段进行表达式操作或函数操作

3、尽量避免在where子句中使用or来连接查询条件，如果一个字段有索引，一个字段没有索引，将导致引擎放弃使用索引而进行全表扫描；可以使用union all来代替or；

4、慎用in和not in，这也会导致全表扫描；对于连续的数值，可以用between代替in；

5、很多时候可以用exists代替in；

6、存储过程



## 四. 框架

### 1.Spring是单例还是多例，怎么修改

单例，可以将type改为prototype就成了多例

```xml
<bean id="user" class="modle.User" scope="prototype">  </bean>
```

spring bean作用域

singleton:单例模式，当spring创建applicationContext容器的时候，spring会欲初始化所有的该作用域实例，加上lazy-init就可以避免预处理；

prototype：原型模式，每次通过getBean获取该bean就会新产生一个实例，创建后spring将不再对其管理；



web

request：搞web的大家都应该明白request的域了吧，就是每次请求都新产生一个实例，和prototype不同就是创建后，接下来的管理，spring依然在监听

session:每次会话，同上



为什么spring要默认是单例呢？原因有二：

1、为了性能。

单例不用每次都new，当然快了

2、不需要多例。



### 2.Spring框架中的单例bean是线程安全的吗?

不，Spring框架中的单例bean不是线程安全的



### 3.什么是IOC，AOP，依赖注入(DI)

1.控制反转IOC：就是应用本身不负责依赖对象的创建和维护，依赖对象的创建和维护都是由外部容器负责的。

2.aop：面向切面:在运行时，动态地将代码切入到类的指定方法、指定位置上的编程思想就是面向切面的编程



IOC和DI其实两者本质上是没有区别的

例如：在A类中调用B类的方法，那么我们就称 A依赖B，B为被依赖（对象），相信这点大家能够理解。

在spring中，B的实例对象被看成Bean对象，这个Bean对象由spring容器进行创建和管理，如此一来，A获取B的实例对象就不是由自己主动去获取，而是被动接受spring给它设值，那么，这个主动变为被动，就可以理解为“控制反转”。

而另一种说法，从spring容器的角度上看，它负责把A的依赖对象B（B是被依赖对象）注入给了A，所以我们可以理解为“依赖注入”

达到的效果：

你只需要在spring配置文件中配置相应的bean，以及设置相关的属性，让spring容器来生成类的实例对象以及管理对象。在spring容器启动的时候，spring会把你在配置文件中配置的bean都初始化好，然后在你需要调用的时候，就把它已经初始化好的那些bean分配给你需要调用这些bean的类。

依赖注入有几种方式：

接口注入，属性注入，构造注入



### 4. Spring中的AOP底层实现原理

动态代理，照我的理解就是，在不修改原有类对象方法的源代码基础上，通过代理对象实现原有类对象方法的增强，也就是拓展原有类对象的功能。



### 5. SpringMVC的执行流程

简化版描述

客户端发送一个请求过来--》 前端控制器接收--得到url地址，--》
由前端处理映射器（根据url地址得到相对应的类）--》
前端处理适配器调用方法执行方法里面的代码---》
由视图解析器解析出要返回的页面--》
响应到客户端



1.客户端发http请求，服务器接收到请求，如果匹配DispatchServlet的请求映射路径（在web.xml中指定），web容器将请求转发交给DispatchServlet处理。

2.DispatchServlet根据请求的信息（包括URL,http方法，请求报文头，请求参数，cookie等）及HandlerMapping的配置找到处理请求的的处理器（Handler）。

3.得到请求的Handler后，通过HandlerAdapter对Handler进行封装，再以统一的适配器接口调用Handler。HandlerAdapter是一个适配器，它用统一的接口对各种Handler方法进行调用

4.处理器完成业务逻辑处理后将返回一个ModelAndView给DispatchServlet, ModelAndView包含了视图逻辑名和模型数据信息。

5.当得到真实的视图队形view后，DispatchServlet就使用这个view对象，对ModelAndView中的模型数据进行视图渲染。

6.客户端得到响应消息，可能是HTML、xml、json等不同的媒体格式。



### 6.Spring的事物隔离级别和传播行为

**5个隔离级别：**

1、ISOLOCATION_DEFAULT: 数据库默认级别

2、ISOLOCATION_READ_UNCOMMITTED: 允许读取未提交的读， 可能导致脏读，不可重复读，幻读

3、ISOLOCATION_READ_COMMITTED: 允许读取已提交的读，可能导致不可重复读，幻读

4、ISOLOCATION_REPEATABLE_READ : 不能能更新另一个事务修改单尚未提交(回滚)的数据，可能引起幻读

5、ISOLOCATION_SERIALIZABLE: 序列执行效率低

 

**7个传播行为：**

**1、**PROPERGATION_MANDATORY:　方法必须运行在一个事务中，不存在事务则抛出异常

2、PROPERGATION_NESTED:　　存在事务则运行在嵌套事务中，不存在则创建一个事务

3、PROPERGATION_NEVER: 当前方法不能运行在事务中，存在事务则抛出异常

4、PROPERGATION_NOT_SUPPORT: 当前存在事务则将其 挂起

5、PROPERGATION_REQUIRED: 不存在事务则创建一个事务 （默认）

6、PROPERGATION_REQUIRES_NEW: 新建一个自己的事务，不论当前是否存在事务

7、PROPERGATION_SUPPORT: 存在事务则加入，不存在也可以



### 7.mybatis中#{}和${}的区别是什么

```
${} 是Properties文件中的变量占位符，它可以用于标签属性值和sql内部，属于静态文本替换，比如${driver}会被静态替换为com.mysql.jdbc.Driver。#{}是sql的参数占位符，Mybatis会将sql中的#{}替换为?号，在sql执行前会使用PreparedStatement的参数设置方法，按序给sql的?号占位符设置参数值，比如ps.setInt(0, parameterValue)，#{item.name}的取值方式为使用反射从参数对象中获取item对象的name属性值，相当于param.getItem().getName()
```

#{}是预编译处理，${}是字符串替换。

Mybatis在处理时，就是把 {}时，就是把时，就是把{}替换成变量的值。
#{}解析传递进来的参数数据
${}对传递进来的参数原样拼接在SQL中
使用#{}可以有效的防止SQL注入，提高系统安全性。



### 8.为什么说Mybatis是半自动ORM映射工具？它与全自动的区别在哪里？

Hibernate属于全自动ORM映射工具，使用Hibernate查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全自动的。而Mybatis在查询关联对象或关联集合对象时，需要手动编写sql来完成，所以，称之为半自动ORM映射工具。
一对一、一对多的关联查询
association 一对一关联查询
collection 一对多关联查询





## 五.微服务

### 1.什么是Spring cloud，Spring cloud有什么特性

Spring cloud 就是一套分布式服务治理的框架，它不会提供具体功能的操作，更专注于服务发现注册、配置中心、消息总线、负载均衡、断路器、数据监控等等



### 2.Spring boot 和Spring cloud 的区别

1、Spring boot 是 Spring 的一套快速配置脚手架，可以基于spring boot 快速开发单个微服务；Spring Cloud是一个基于Spring Boot实现的云应用开发工具；
2、Spring boot专注于快速、方便集成的单个个体，Spring Cloud是关注全局的服务治理框架；
3、spring boot使用了默认大于配置的理念，很多集成方案已经帮你选择好了，能不配置就不配置，Spring Cloud很大的一部分是基于Spring boot来实现。
4、Spring boot可以离开Spring Cloud独立使用开发项目，但是Spring Cloud离不开Spring boot，属于依赖的关系。

### 3.Rest和RPC对比

1.RPC主要的缺陷是服务提供方和调用方式之间的依赖太强，需要对每一个微服务进行接口的定义，并通过持续继承发布，严格版本控制才不会出现冲突。
2.REST是轻量级的接口，服务的提供和调用不存在代码之间的耦合，只需要一个约定进行规范。

### 4.**你所知道的微服务技术栈**

维度(springcloud)
服务开发：springboot spring springmvc
服务配置与管理:Netfix公司的Archaiusm ,阿里的Diamond
服务注册与发现:Eureka,Zookeeper
服务调用:Rest RPC gRpc
服务熔断器:Hystrix
服务负载均衡:Ribbon Nginx
服务接口调用:Fegin
消息队列:Kafka Rabbitmq activemq
服务配置中心管理:SpringCloudConfig
服务路由（API网关）Zuul
事件消息总线:SpringCloud Bus

### 5.负载均衡的意义

在计算中，负载均衡可以改善跨计算机，计算机集群，网络链接，中央处理单元或磁盘驱动器等多种计算资源的工作负载分布。负载均衡旨在优化资源使用，最大吞吐量，最小响应时间并避免任何单一资源的过载。使用多个组件进行负载均衡而不是单个组件可能会通过冗余来提高可靠性和可用性。负载平衡通常涉及专用软件或硬件，例如多层交换机或域名系统服务进程。

### 6.什么是服务熔断？什么是服务降级

服务直接的调用，比如在高并发情况下出现进程阻塞，导致当前线程不可用，慢慢的全部线程阻塞，导致服务器雪崩。
服务熔断：相当于保险丝，出现某个异常，直接熔断整个服务，而不是一直等到服务超时。通过维护一个自己的线程池，当线程到达阈值的时候就启动服务降级，如果其他请求继续访问就直接返回fallback的默认值。

### 7.**什么是Ribbon？**

ribbon是一个负载均衡客户端，可以很好的控制htt和tcp的一些行为。feign默认集成了ribbon。



### 8.什么是feign?它的优点是什么？

1.feign采用的是基于接口的注解
2.feign整合了ribbon，具有负载均衡的能力
3.整合了Hystrix，具有熔断的能力



### 9.**Ribbon和Feign的区别？**

1.Ribbon都是调用其他服务的，但方式不同。
2.启动类注解不同，Ribbon是@RibbonClient feign的是@EnableFeignClients
3.服务指定的位置不同，Ribbon是在@RibbonClient注解上声明，Feign则是在定义抽象方法的接口中使用@FeignClient声明。
4.调用方式不同，Ribbon需要自己构建http请求，模拟http请求然后使用RestTemplate发送给其他服务，步骤相当繁琐。Feign需要将调用的方法定义成抽象方法即可。



### 10.什么是SpringCloud Bus?

spring cloud bus 将分布式的节点用轻量的消息代理连接起来，它可以用于广播配置文件的更改或者服务直接的通讯，也可用于监控。
如果修改了配置文件，发送一次请求，所有的客户端便会重新读取配置文件。