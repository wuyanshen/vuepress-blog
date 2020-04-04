---
sidebar: auto
title: Java8 Lambda表达式学习
---

## 1. stream管道流

### 什么是Java Stream API？

Java Stream函数式编程接口最初是在Java 8中引入的，并且与lambda一起成为Java开发的里程碑式的功能特性，它极大的方便了开放人员处理集合类数据的效率。从笔者之前看过的调查文章显示，绝大部分的开发者使用的JDK版本是java 8，其中Java Stream和lambda功不可没。

Java Stream就是一个数据流经的管道，并且在管道中对数据进行操作，然后流入下一个管道。有学过linux 管道的同学应该会很容易就理解。在没有Java Stram之前，对于集合类的操作，更多的是通过for循环。大家从后文中就能看出Java Stream相对于for 循环更加简洁、易用、快捷。

管道的功能包括：Filter（过滤）、Map(映射)、sort(排序）等，集合数据通过Java Stream管道处理之后，转化为另一组集合或数据输出。



### 获取Stream管道流

#### 将数组转化为Stream

使用Stream.of()方法，将数组转换为管道流。

```java
String[] array = {"Monkey", "Lion", "Giraffe", "Lemur"};
Stream<String> nameStrs2 = Stream.of(array);

Stream<String> nameStrs3 = Stream.of("Monkey", "Lion", "Giraffe", "Lemur");
```



#### 将集合类对象转化为Stream

通过调用集合类的stream()方法，将集合类对象转换为管道流。

```java
List<String> list = Arrays.asList("Monkey", "Lion", "Giraffe", "Lemur");
Stream<String> streamFromList = list.stream();

Set<String> set = new HashSet<>(list);
Stream<String> streamFromSet = set.stream();
```



#### 将文本文件转化为Stream

通过Files.lines方法将文本文件转换为管道流，下图中的Paths.get()方法作用就是获取文件，是Java NIO的API！

也就是说：我们可以很方便的使用Java Stream加载文本文件，然后逐行的对文件内容进行处理。

```java
Stream<String> lines = Files.lines(Paths.get("file.txt"));
```



## 2. Stream中的filter和谓词逻辑

### 谓词逻辑

这段代码是使用filter过滤三个对象中年龄大于30并且性别是男的人的list，其中filter括号中的逻辑就是`谓词逻辑`

```java
@Data
@AllArgsConstructor
public class StreamTest {

    private String name;
    private Integer age;
    private String gender;

    public static void main(String[] args) {
        String str [] = {"lilei","xiaohong","liming","xiyang"};
        StreamTest st1 = new StreamTest("小红",22,"女");
        StreamTest st2 = new StreamTest("小李",22,"男");
        StreamTest st3 = new StreamTest("小刘",46,"男");
        Arrays.asList(st1,st2,st3).stream()
                .filter(streamTest -> streamTest.getAge()>30 && streamTest.getGender().equals("男"))
                .collect(Collectors.toList())
                .forEach(System.out::println);
      //结果：
      //StreamTest(name=小刘, age=46, gender=男)
    }
}
```





#### 什么是谓词逻辑

我们已经知道lambda表达式表达的是一个匿名接口函数的实现。那具体到Stream.filter()中，它表达的是什么呢？看下面代码：可以看出它表达的是一个Predicate接口，在英语中这个单词的意思是：谓词。

```java
Stream<T> filter(Predicate<? super T> predicate);
```

WHERE 和 AND 限定了主语employee是什么，那么WHERE和AND语句所代表的逻辑就是谓词逻辑

```sql
SELECT *
FROM employee
WHERE age > 70
AND gender = 'M'
```



#### 谓词逻辑的复用

通常情况下，filter函数中lambda表达式为一次性使用的谓词逻辑。如果我们的谓词逻辑需要被多处、多场景、多代码中使用，通常将它抽取出来单独定义到它所限定的主语实体中。
比如：将下面的谓词逻辑定义在Employee实体class中。

```java
private static Predicate<StreamTest> ageGreateThan30 = x->x.getAge()>30;
private static Predicate<StreamTest> genderMan = x->x.getGender().equals("男");
```



- and语法(并集)

```java
Arrays.asList(st1,st2,st3).stream()
                .filter(ageGreateThan30.and(genderMan))
                .collect(Collectors.toList())
                .forEach(System.out::println);
//结果：
//StreamTest(name=小刘, age=46, gender=男)
```



- or语法(交集)

```java
Arrays.asList(st1,st2,st3).stream()
  							.filter(ageGreateThan30.or(genderMan))
  							.collect(Collectors.toList())
  							.forEach(System.out::println);
//结果：
//StreamTest(name=小李, age=22, gender=男)
//StreamTest(name=小刘, age=46, gender=男)
```



- negate语法(取反)

```java
Arrays.asList(st1,st2,st3).stream()
  							.filter(ageGreateThan30.or(genderMan).negate())
  							.collect(Collectors.toList())
  							.forEach(System.out::println);
//结果：
//StreamTest(name=小红, age=22, gender=女)
```







## 3. Stream中间操作

其实在程序员编程中，经常会接触到“有状态”，“无状态”，绝大部分的人都比较蒙。而且在不同的场景下，“状态”这个词的含义似乎有所不同。但是“万变不离其宗”，理解“状态”这个词在编程领域的含义，笔者教给大家几个关键点：

- 状态通常代表公用数据，有状态就是有“公用数据”
- 因为有公用的数据，状态通常需要额外的存储。
- 状态通常被多人、多用户、多线程、多次操作，这就涉及到状态的管理及变更操作。

是不是更蒙了？举个例子，你就明白了

- web开发session就是一种状态，访问者的多次请求关联同一个session，这个session需要存储到内存或者redis。多次请求使用同一个公用的session，这个session就是状态数据。
- vue的vuex的store就是一种状态，首先它是多组件公用的，其次是不同的组件都可以修改它，最后它需要独立于组件单独存储。所以store就是一种状态。

回到我们的Stream管道流

- filter与map操作，不需要管道流的前面后面元素相关，所以不需要额外的记录元素之间的关系。输入一个元素，获得一个结果。
- sorted是排序操作、distinct是去重操作。像这种操作都是和别的元素相关的操作，我自己无法完成整体操作。就像班级点名就是无状态的，喊到你你就答到就可以了。如果是班级同学按大小个排序，那就不是你自己的事了，你得和周围的同学比一下身高并记住，你记住的这个身高比较结果就是一种“状态”。所以这种操作就是有状态操作。



### 无状态操作

#### filter

```java
public static void main(String[] args) {
	String str [] = {"lilei","xiaohong","liming","xiyang"};
  Stream.of(str).filter(x->x.startsWith("x")).forEach(System.out::println);
}
//结果：
//xiaohong
//xiyang
```



#### map

```java
public static void main(String[] args) {
  String str [] = {"lilei","xiaohong","liming","xiyang"};
  Stream.of(str).map(String::toUpperCase).forEach(System.out::println);
}
//结果：
//XIAOHONG
//XIYANG
//LIMING
//XIYANG
```



#### peek(特殊的map)

由于map的参数e就是返回值，所以可以用peek函数。peek函数是一种特殊的map函数，当函数没有返回值或者参数就是返回值的时候可以使用peek函数。

```java
@Data
@AllArgsConstructor
public class StreamTest {

    private String name;
    private Integer age;

    public static void main(String[] args) {
        StreamTest streamTest1 = new StreamTest("小红",22);
        StreamTest streamTest2 = new StreamTest("小李",22);
        StreamTest streamTest3 = new StreamTest("小刘",22);
        StreamTest streamTest4 = new StreamTest("小赵",22);
      	//将所有人的年龄都+1
      //1.map写法，必须有返回值
      //Stream.of(streamTest1,streamTest2,streamTest3,streamTest4).map(e->{e.setAge(e.getAge()+1);return e;}).forEach(System.out::println);
      //2.peek写法，不需要返回值
        Stream.of(streamTest1,streamTest2,streamTest3,streamTest4).peek(e->e.setAge(e.getAge()+1)).forEach(System.out::println);
    }
//结果：
//StreamTest(name=小红, age=23)
//StreamTest(name=小李, age=23)
//StreamTest(name=小刘, age=23)
//StreamTest(name=小赵, age=23)
```





#### flatMap

map可以对管道流中的数据进行转换操作，但是如果管道中还有管道该如何处理？即：如何处理二维数组及二维集合类。实现一个简单的需求：将"lilei","xiaohong","liming","xiyang"四个字符串组成的集合，元素的每一个字母打印出来。如果不用Stream我们怎么写？写2层for循环,第一层遍历字符串，并且将字符串拆分成char数组，第二层for循环遍历char数组。

```java
@Data
@AllArgsConstructor
public class StreamTest {

    private String name;
    private Integer age;

    public static void main(String[] args) {
        String str [] = {"lilei","xiaohong","liming","xiyang"};
        List<String> list = Arrays.asList(str);
        list.stream().map(e->Arrays.stream(e.split(""))).forEach(System.out::println);
    }
}
//结果：
//java.util.stream.ReferencePipeline$Head@3d71d552
//java.util.stream.ReferencePipeline$Head@1cf4f579
//java.util.stream.ReferencePipeline$Head@18769467
//java.util.stream.ReferencePipeline$Head@46ee7fe8
```

用map方法是做不到的，这个需求用map方法无法实现。map只能针对一维数组进行操作，数组里面还有数组，管道里面还有管道，它是处理不了每一个元素的。

```java
@Data
@AllArgsConstructor
public class StreamTest {

    private String name;
    private Integer age;

    public static void main(String[] args) {
        String str [] = {"lilei","xiaohong","liming","xiyang"};
        List<String> list = Arrays.asList(str);
        list.stream().flatMap(e->Arrays.stream(e.split(""))).forEach(System.out::println);
        //结果：
        //l
        //i
        //l
        //e
        //i
        //x
        //i
        //a
        //o
        //h
        //o
        //n
        //g
        //l
        //i
        //m
        //i
        //n
        //g
        //x
        //i
        //y
        //a
        //n
        //g
    }

}
```



### 有状态操作

#### distinct

我们还可以使用distinct方法对管道中的元素去重，涉及到去重就一定涉及到元素之间的比较，distinct方法时调用Object的equals方法进行对象的比较的，如果你有自己的比较规则，可以重写equals方法。

```java
@Data
@AllArgsConstructor
public class StreamTest {

    private String name;
    private Integer age;

    public static void main(String[] args) {
        String str [] = {"lilei","xiaohong","liming","xiyang","liming"};
        List<String> list = Arrays.asList(str);
        list.stream().distinct().forEach(System.out::println);
      //结果：
      //lilei
      //xiaohong
      //liming
      //xiyang
    }
}
```



#### limit

limt方法传入一个整数n，用于截取管道中的前n个元素。经过管道处理之后的数据是：[lilei, xiaohong]。

```java
@Data
@AllArgsConstructor
public class StreamTest {

    private String name;
    private Integer age;

    public static void main(String[] args) {
        String str [] = {"lilei","xiaohong","liming","xiyang"};
        List<String> list = Arrays.asList(str);
        list.stream().limit(2).forEach(System.out::println);
      //结果：
      //lilei
			//xiaohong
    }
}
```



#### skip

skip方法与limit方法的使用相反，用于跳过前n个元素，截取从n到末尾的元素。经过管道处理之后的数据是： [liming, xiyang]

```java
@Data
@AllArgsConstructor
public class StreamTest {

    private String name;
    private Integer age;

    public static void main(String[] args) {
        String str [] = {"lilei","xiaohong","liming","xiyang"};
        List<String> list = Arrays.asList(str);
        list.stream().skip(2).forEach(System.out::println);
      //结果：
      //liming
      //xiyang
    }
}
```



#### sorted

默认的情况下，sorted是按照字母的自然顺序进行排序。如下代码的排序结果是：[lilei, liming, xiaohong, xiyang]，字数按顺序G在L前面，L在M前面。第一位无法区分顺序，就比较第二位字母。

```java
@Data
@AllArgsConstructor
public class StreamTest {

    private String name;
    private Integer age;

    public static void main(String[] args) {
        String str [] = {"lilei","xiaohong","liming","xiyang"};
        List<String> list = Arrays.asList(str);
        list.stream().sorted().forEach(System.out::println);
      //结果：
      //lilei
      //liming
      //xiaohong
      //xiyang
    }
}
```



### 串行和并行

- 串行的好处是可以保证顺序，但是通常情况下处理速度慢一些
- 并行的好处是对于元素的处理速度快一些（通常情况下），但是顺序无法保证。这**可能会导致**进行一些**有状态操作**的时候，最后得到的不是你想要的结果。



parallel()函数表示对管道中的元素进行并行处理，而不是串行处理。但是这样就有可能导致管道流中后面的元素先处理，前面的元素后处理，也就是元素的顺序无法保证。

```java
Stream.of("Monkey", "Lion", "Giraffe", "Lemur", "Lion")
                .parallel()
                .sorted()
                .forEach(System.out::println);
//结果：
//因为是并行处理，所以输出的顺序并没有按照sorted()排序的结果返回
```



并行操作的适用场景

- 数据源易拆分：从处理性能的角度，parallel()更适合处理ArrayList，而不是LinkedList。因为ArrayList从数据结构上讲是基于数组的，可以根据索引很容易的拆分为多个。
- 适用于无状态操作：每个元素的计算都不得依赖或影响任何其他元素的计算的运算场景。
- 基础数据源无变化：从文本文件里面边读边处理的场景，不适合parallel()并行处理。parallel()适合处理开始就容量固定的集合，这样能够平均的拆分、同步处理。



## 4. 集合排序

#### 字符串排序

```java
//大小写不敏感排序，按照字母顺序排
List<String> zimu = Arrays.asList("A","D","C","b");
zimu.sort(String.CASE_INSENSITIVE_ORDER);
System.out.print(zimu);

//自然顺序排序，大小写敏感，先将大写按照字母顺序排，再拍小写字母
zimu.sort(Comparator.naturalOrder());
System.out.print(zimu);

Arrays.asList("A","D","C","b").stream()
  	.sorted(String.CASE_INSENSITIVE_ORDER).forEach(System.out::print);
```



#### 对象排序

```java
@Data
@AllArgsConstructor
public class StreamTest {

    private String name;
    private Integer age;
    private String gender;

    public static void main(String[] args) {

        StreamTest st1 = new StreamTest("小红",22,"F");
        StreamTest st2 = new StreamTest("小刘",23,"M");
        StreamTest st3 = new StreamTest("小王",24,"M");

        Arrays.asList(st1,st2,st3)
                .stream()
                .sorted(Comparator.comparing(StreamTest::getAge))
                .forEach(System.out::println);
      //结果：
      //StreamTest(name=小红, age=22, gender=F)
      //StreamTest(name=小刘, age=23, gender=M)
      //StreamTest(name=小王, age=24, gender=M)
    }
}
```



- 倒序

如果想按照年龄倒序排序，就需要加上reversed了

```java
Arrays.asList(st1,st2,st3)
        .stream()
        .sorted(Comparator.comparing(StreamTest::getAge).reversed())
        .forEach(System.out::println);
//结果
//StreamTest(name=小王, age=24, gender=M)
//StreamTest(name=小刘, age=23, gender=M)
//StreamTest(name=小红, age=22, gender=F)
```



- 链式排序

先对年龄进行倒序排序，再对性别进行倒序排序

```java
@Data
@AllArgsConstructor
public class StreamTest {

    private String name;
    private Integer age;
    private String gender;

    public static void main(String[] args) {

        StreamTest st1 = new StreamTest("小红",22,"F");
        StreamTest st2 = new StreamTest("小刘",23,"M");
        StreamTest st3 = new StreamTest("小王",24,"M");

        Arrays.asList(st1,st2,st3)
                .stream()
                .sorted(
                    Comparator.comparing(StreamTest::getAge).reversed()
                    .thenComparing(StreamTest::getGender).reversed()
                )
                .forEach(System.out::println);
      //结果：
      //StreamTest(name=小红, age=22, gender=F)
			//StreamTest(name=小刘, age=23, gender=M)
			//StreamTest(name=小王, age=24, gender=M)
    }
}
```



## 5. 函数式接口

### 什么是函数式接口？

所谓的函数式接口，实际上就是接口里面**只能有一个抽象方法的接口**。我们上一节用到的Comparator接口就是一个典型的函数式接口，它只有一个抽象方法compare。

```java
@FunctionalInterface
public interface Comparator<T> {
  
    int compare(T o1, T o2);
  
  	boolean equals(Object obj);

    default Comparator<T> reversed() {
        return Collections.reverseOrder(this);
    }


    default <U extends Comparable<? super U>> Comparator<T> thenComparing(
            Function<? super T, ? extends U> keyExtractor)
    {
        return thenComparing(comparing(keyExtractor));
    }
  
  ...省略


    public static<T> Comparator<T> comparingDouble(ToDoubleFunction<? super T> keyExtractor) {
        Objects.requireNonNull(keyExtractor);
        return (Comparator<T> & Serializable)
            (c1, c2) -> Double.compare(keyExtractor.applyAsDouble(c1), keyExtractor.applyAsDouble(c2));
    }
```

只有一个抽象方法？那上图中的equals方法不是也没有函数体么？



### 函数式接口的特点

- 接口有且仅有一个抽象方法，如上图的抽象方法compare
- 允许定义静态非抽象方法
- 允许定义默认defalut非抽象方法（default方法也是java8才有的，有空可以讲一下）
- 允许java.lang.Object中的public方法，如上面的方法equals。
- FunctionInterface注解不是必须的，如果一个接口符合"函数式接口"定义，那么加不加该注解都没有影响。加上该注解能够更好地让编译器进行检查。如果编写的不是函数式接口，但是加上了@FunctionInterface，那么编译器会报错

甚至可以说：函数式接口是专门为lambda表达式准备的，**lambda表达式是只实现接口中唯一的抽象方法的匿名实现类**。



### JDK中的函数式接口举例

java.lang.Runnable,

java.util.Comparator,

java.util.concurrent.Callable

java.util.function包下的接口，如Consumer、Predicate、Supplier等



### 自定义Comparator排序

我们自定义一个排序器，实现compare函数（函数式接口Comparator唯一的抽象方法）。返回0表示元素相等，-1表示前一个元素小于后一个元素，1表示前一个元素大于后一个元素。这个规则和java 8之前没什么区别。

下面代码用自定义接口实现类的的方式实现：按照年龄的倒序排序！

> 倒序就是 `return o1.getAge()-o2.getAge()>0? -1:1;`在结果大于0的时候正常需要返回1，如果我们返回它的相反值-1，就实现了倒序的效果

```java
@Data
@AllArgsConstructor
public class StreamTest {

    private String name;
    private Integer age;
    private String gender;

    public static void main(String[] args) {

        StreamTest st1 = new StreamTest("小红",22,"F");
        StreamTest st2 = new StreamTest("小刘",23,"M");
        StreamTest st3 = new StreamTest("小王",24,"M");

        Arrays.asList(st1,st2,st3)
                .stream()
                .sorted(
                        new Comparator<StreamTest>() {
                            @Override
                            public int compare(StreamTest o1, StreamTest o2) {
                                if(o1.getAge()==o2.getAge()){
                                    return 0;
                                }
                                return o1.getAge()-o2.getAge()>0? -1:1;
                            }
                        }
                )
                .forEach(System.out::println);
    }
}
```



## 6.java8对map的排序

### 排序实现思路

1. 将Map或List等集合类对象转换为Stream对象
2. 使用Streams的`sorted()`方法对其进行排序
3. 最终将其返回为`LinkedHashMap`（可以保留排序顺序）

`sorted()`方法以a`Comparator`作为参数，从而可以按任何类型的值对Map进行排序。



### HashMap的merge()函数

在学习Map排序之前，有必要讲一下HashMap的merge()函数，该函数应用场景就是当Key重复的时候，如何处理Map的元素值。这个函数有三个参数：

- 参数一：向map里面put的键
- 参数二：向map里面put的值
- 参数三：如果键发生重复，如何处理值。可以是一个函数，也可以写成lambda表达式。



```java
public class StreamTest {

    public static void main(String[] args) throws JsonProcessingException {
        Map<String,Integer> map = new HashMap<String,Integer>(){{
            put("age",22);
        }};
        map.merge("age",20,(oldV,newV)->oldV+newV);
        ObjectMapper objectMapper = new ObjectMapper();
        String s = objectMapper.writeValueAsString(map);
        System.out.println(s);
    }
}
```



### 按Map的键排序

下面一个例子使用Java 8 Stream按Map的键进行排序：

```java
public class StreamTest {

    public static void main(String[] args) throws JsonProcessingException {
        // 创建一个Map，并填入数据
        Map<String, Integer> codes = new HashMap<>();
				codes.put("Apple", 1);//苹果
        codes.put("Gooseberry", 49);//醋栗
        codes.put("Banana", 33);//香蕉
        codes.put("Cherry", 86);//樱桃
        codes.put("Pear", 92);//梨

      //正常排序
      //        for(Map.Entry entry:codes.entrySet()){
      //            System.out.println(entry.getKey()+"-"+entry.getValue());
      //        }
      
      //java8排序
        codes.entrySet().forEach(System.out::println);
      
      //结果
      //Apple=1
      //Pear=92
      //Cherry=86
      //Gooseberry=49
      //Banana=33
    }
}
```



- 根据key进行排序

```java
public class StreamTest {

    public static void main(String[] args) throws JsonProcessingException {
        // 创建一个Map，并填入数据
        Map<String, Integer> codes = new HashMap<>();
        codes.put("Apple", 1);//苹果
        codes.put("Gooseberry", 49);//醋栗
        codes.put("Banana", 33);//香蕉
        codes.put("Cherry", 86);//樱桃
        codes.put("Pear", 92);//梨

				// 按照Map的键进行排序
        codes.entrySet().stream()
          .sorted(Map.Entry.comparingByKey())
          .collect(Collectors.toMap
                   (Map.Entry::getKey,Map.Entry::getValue,
                    (newVal,oldVal)->newVal,
                    LinkedHashMap::new)
                  )
          .entrySet()
          .forEach(System.out::println);
        //结果：
        //Apple=1
        //Banana=33
        //Cherry=86
        //Gooseberry=49
        //Pear=92
}
```

> **请注意**使用`LinkedHashMap`来存储排序的结果以保持顺序。默认情况下，`Collectors.toMap()`返回`HashMap`。`HashMap`不能保证元素的顺序



- 按照value进行排序

```java
public class StreamTest {

    public static void main(String[] args) throws JsonProcessingException {
        // 创建一个Map，并填入数据
        Map<String, Integer> codes = new HashMap<>();
        codes.put("Apple", 1);//苹果
        codes.put("Gooseberry", 49);//醋栗
        codes.put("Banana", 33);//香蕉
        codes.put("Cherry", 86);//樱桃
        codes.put("Pear", 92);//梨

				// 按照Map的键进行排序
        codes.entrySet().stream()
          .sorted(Map.Entry.comparingByValue())
          .collect(Collectors.toMap
                   (Map.Entry::getKey,Map.Entry::getValue,
                    (newVal,oldVal)->newVal,
                    LinkedHashMap::new)
                  )
          .entrySet()
          .forEach(System.out::println);
        //结果：
        //Apple=1
        //Banana=33
        //Gooseberry=49
        //Cherry=86
        //Pear=92
}
```



- 根据TreeMap排序

TreeMap内的元素是有顺序的，所以利用TreeMap排序也是可取的一种方法。您需要做的就是创建一个`TreeMap`对象，并将数据从`HashMap`put到`TreeMap`中，非常简单：

```java
public class StreamTest {

    public static void main(String[] args) throws JsonProcessingException {
        // 创建一个Map，并填入数据
        Map<String, Integer> codes = new HashMap<>();
        codes.put("Apple", 1);//苹果
        codes.put("Gooseberry", 49);//醋栗
        codes.put("Banana", 33);//香蕉
        codes.put("Cherry", 86);//樱桃
        codes.put("Pear", 92);//梨

        Map<String, Integer> sorted = new TreeMap<>(codes);
        sorted.entrySet().forEach(System.out::println);
      //键(水果)以自然字母顺序排序。
      //结果
      //Apple=1
      //Banana=33
      //Cherry=86
      //Gooseberry=49
      //Pear=92
    }
}
```



## 7.Stream的结果操作

### 将结果打印

如果我们只是希望将Stream管道流的处理结果打印出来，而不是进行类型转换，我们就可以使用forEach()方法或forEachOrdered()方法

- parallel()函数表示对管道中的元素进行并行处理，而不是串行处理，这样处理速度更快。但是这样就有可能导致管道流中后面的元素先处理，前面的元素后处理，也就是元素的顺序无法保证
- forEachOrdered从名字上看就可以理解，虽然在数据处理顺序上可能无法保障，但是forEachOrdered方法可以在元素输出的顺序上保证与元素进入管道流的顺序一致。也就是下面的样子（forEach方法则无法保证这个顺序）：



forEach方法

```java
public class StreamTest {

    public static void main(String[] args) throws JsonProcessingException {

        Stream.of("Apple","Gooseberry","Banana","Cherry","Pear")
                .parallel()
                .forEach(System.out::println);
				//结果：
      	//Banana
        //Apple
        //Pear
        //Gooseberry
        //Cherry
    }
}
```



forEachOrdered方法

```java
public class StreamTest {

    public static void main(String[] args) throws JsonProcessingException {

        Stream.of("Apple","Gooseberry","Banana","Cherry","Pear")
                .parallel()
                .forEachOrdered(System.out::println);
      //结果：
      //Banana
      //Apple
      //Cherry
      //Pear
      //Gooseberry
    }
}
```



### 将结果转换成集合

java Stream 最常见的用法就是：

一将集合类转换成管道流，

二对管道流数据处理，

三将管道流处理结果在转换成集合类。

那么collect()方法就为我们提供了这样的功能：将管道流处理结果在转换成集合类。



- 转换为Set

通过Collectors.toSet()方法收集Stream的处理结果，将所有元素收集到Set集合中。

```java
public class StreamTest {

    public static void main(String[] args) {
        Stream.of("Apple","Gooseberry","Banana","Cherry","Pear","Cherry")
                .parallel()
                .collect(Collectors.toSet())
                .forEach(System.out::println);
      //结果：注意Set会去重。
      //Apple
			//Pear
			//Cherry
			//Gooseberry
			//Banana
      
    }
}
```



- 转换为List

同样，可以将元素收集到`List`使用`toList()`收集器中。

```java
public class StreamTest {

    public static void main(String[] args) {
        Stream.of("Apple","Gooseberry","Banana","Cherry","Pear","Cherry")
                .parallel()
                .collect(Collectors.toSet())
                .forEach(System.out::println);
      //结果：
      //Apple
			//Pear
			//Cherry
			//Gooseberry
			//Banana
      //Cherry
    }
}
```



- 通用的转换方法

上面为大家介绍的元素收集方式，都是专用的。比如使用Collectors.toSet()收集为Set类型集合；使用Collectors.toList()收集为List类型集合。那么，有没有一种比较通用的数据元素收集方式，将数据收集为任意的Collection接口子类型。
所以，这里就像大家介绍一种通用的元素收集方式，你可以将数据元素收集到任意的Collection类型：即向所需Collection类型提供构造函数的方式。

```java
public class StreamTest {

    public static void main(String[] args) {
        Stream.of("Apple","Gooseberry","Banana","Cherry","Pear","Cherry")
                .parallel()
                .collect(Collectors.toCollection(LinkedList::new))
                .forEach(System.out::println);
      //结果：
      //Apple
      //Gooseberry
      //Banana
      //Cherry
      //Pear
      //Cherry
    }
}
```



- 转换成Array

```java
public class StreamTest {

    public static void main(String[] args) {
        Arrays.asList(Stream.of("Apple","Gooseberry","Banana","Cherry","Pear","Cherry")
                .toArray(String[]::new)).stream().forEach(System.out::println);
      //结果：
      //Apple
      //Gooseberry
      //Banana
      //Cherry
      //Pear
      //Cherry
    }
}
```



- 转换成Map

```java
public class StreamTest {

    public static void main(String[] args) {
        Stream.of("Apple","Gooseberry","Banana","Cherry","Pear","Cherry")
          .distinct()//去重
          .collect(Collectors.toMap(
            Function.identity(),//将输入值作为key
            s -> (int)s.chars().distinct().count()))//将水果单词不重复的字母数作为value
          .entrySet()//获取到map中对象的集合
          .forEach(System.out::println);
      
      //结果：
      //Apple=4
      //Pear=4
      //Cherry=5
      //Gooseberry=7
      //Banana=3
    }
}
```



- 分组收集groupBy

Collectors.groupingBy用来实现元素的分组收集，下面的代码演示如何根据首字母将不同的数据元素收集到不同的List，并封装为Map。

```java
public static void main(String[] args) {
  //下面其实返回的是一个这样格式的map-->Map<Character, List<String>> groupingByList
        Stream.of("Apple","Gooseberry","Banana","Cherry","Pear","Cherry")
                .collect(Collectors.groupingBy(
                        s -> s.charAt(0)
                        ))
                .entrySet()
                .forEach(System.out::println);
  	//结果
    //P=[Pear]
    //A=[Apple]
    //B=[Banana]
    //C=[Cherry, Cherry]
    //G=[Gooseberry]
    }
```



带统计数量的

```java
public static void main(String[] args) {
        Stream.of("Apple","Gooseberry","Banana","Cherry","Pear","Cherry")
                .collect(Collectors.groupingBy(
                        s -> s.charAt(0),
                        counting()
                        ))
                .entrySet()
                .f	orEach(System.out::println);
  	//结果
    //P=1
    //A=1
    //B=1
    //C=2
    //G=1
    }
```



### 其他结果操作

```java
boolean containsTwo = IntStream.of(1, 2, 3).anyMatch(i -> i == 2);
// 判断管道中是否包含2，结果是: true


long nrOfAnimals = Stream.of(
    "Monkey", "Lion", "Giraffe", "Lemur"
).count();
// 管道中元素数据总计结果nrOfAnimals: 4


int sum = IntStream.of(1, 2, 3).sum();
// 管道中元素数据累加结果sum: 6


OptionalDouble average = IntStream.of(1, 2, 3).average();
//管道中元素数据平均值average: OptionalDouble[2.0]


int max = IntStream.of(1, 2, 3).max().orElse(0);
//管道中元素数据最大值max: 3


IntSummaryStatistics statistics = IntStream.of(1, 2, 3).summaryStatistics();
// 全面的统计结果statistics: IntSummaryStatistics{count=3, sum=6, min=1, average=2.000000, max=3}

```

