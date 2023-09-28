---
title: log4j和log4j2
categories: java
cover: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.p1soM-C5zVFsl5nZ82j0aAHaE8'
description: log4j和log4j2
abbrlink: 30094
date: 2023-09-02 11:30:00
updated: 2023-09-02 11:30:00
---

### 日志框架配置
> log4j支持properties文件，而log4j2取消支持了log4j的properties文件，采用了xml,json文件。
> 另外log4j2支持了颜色自定义，最大的特点是异步的，性能提升。
> 俩个没啥功能性上的实质区别。
#### log4j
```xml
<dependency>
  <groupId>org.slf4j</groupId>
  <artifactId>slf4j-api</artifactId>
  <version>1.7.30</version>
</dependency>
<dependency>
  <groupId>org.slf4j</groupId>
  <artifactId>slf4j-log4j12</artifactId>
  <version>1.7.30</version>
</dependency>
<dependency>
  <groupId>log4j</groupId>
  <artifactId>log4j</artifactId>
  <version>1.2.17</version>
</dependency>
```

```properties
#级别：ALL < DEBUG < INFO < WARN < ERROR < FATAL < OFF
#将等级为DEBUG的日志信息输出到console和file这两个目的地，console和file的定义在下面的代码
log4j.rootLogger=INFO,console
#控制台输出的相关设置
#Appenders
#org.apache.log4j.ConsoleAppender（控制台）
#org.apache.log4j.FileAppender（文件）
#org.apache.log4j.DailyRollingFileAppender（每天产生一个日志文件）
#org.apache.log4j.RollingFileAppender（文件大小到达指定尺寸的时候产生一个新的文件）
#org.apache.log4j.WriterAppender（将日志信息以流格式发送到任意指定的地方）
#layout
#org.apache.log4j.HTMLLayout（以HTML表格形式布局）
#org.apache.log4j.PatternLayout（可以灵活地指定布局模式）
#org.apache.log4j.SimpleLayout（包含日志信息的级别和信息字符串）
#org.apache.log4j.TTCCLayout（包含日志产生的时间、线程、类别等信息）
#pattern
#%p：输出日志信息的优先级，即DEBUG，INFO，WARN，ERROR，FATAL。
#%d：输出日志时间点的日期或时间，默认格式为ISO8601，也可以在其后指定格式，如：%d{yyyy/MM/dd HH:mm:ss,SSS}。
#%r：输出自应用程序启动到输出该log信息耗费的毫秒数。
#%t：输出产生该日志事件的线程名。
#%l：输出日志事件的发生位置，相当于%c.%M(%F:%L)的组合，包括类全名、方法、文件名以及在代码中的行数。例如：test.TestLog4j.main(TestLog4j.java:10)。
#%c：输出日志信息所属的类目，通常就是所在类的全名。
#%M：输出产生日志信息的方法名。
#%F：输出日志消息产生时所在的文件名称。
#%L:：输出代码中的行号。
#%m:：输出代码中指定的具体日志信息。
#%n：输出一个回车换行符，Windows平台为"\r\n"，Unix平台为"\n"。
#%x：输出和当前线程相关联的NDC(嵌套诊断环境)，尤其用到像java servlets这样的多客户多线程的应用中。
#%%：输出一个"%"字符。
log4j.appender.console = org.apache.log4j.ConsoleAppender
log4j.appender.console.Target = System.out
log4j.appender.console.Threshold=INFO
log4j.appender.console.layout = org.apache.log4j.PatternLayout
#log4j.appender.console.layout.ConversionPattern=[%c]-%m%n
log4j.appender.console.layout.ConversionPattern=[%p] [%d{yyyy-MM-dd HH:mm:ss}] [%c] %m%n

#============================================================END===========================================================================
#文件输出的相关设置
#'.'yyyy-MM：每月
#'.'yyyy-ww：每周
#'.'yyyy-MM-dd：每天
#'.'yyyy-MM-dd-a：每天两次
#'.'yyyy-MM-dd-HH：每小时
#'.'yyyy-MM-dd-HH-mm：每分钟
log4j.appender.file = org.apache.log4j.DailyRollingFileAppender
log4j.appender.file.File=./log/yybk.user.log
log4j.appender.file.MaxFileSize=10mb
log4j.appender.file.Threshold=INFO
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.file.layout.ConversionPattern=[%p][%d{yyyy-MM-dd HH:mm:ss,SSS}][%c]%m%n
log4j.appender.file.DatePattern='.'yyyy-MM-dd

#============================================================END===========================================================================
#日志输出级别
#log4j.logger.org.mybatis=DEBUG
#log4j.logger.java.sql=DEBUG
#log4j.logger.java.sql.Statement=DEBUG
#log4j.logger.java.sql.ResultSet=DEBUG
#log4j.logger.java.sql.PreparedStatement=DEBUG
```
#### log4j2
```xml
<!-- 使用slf4j 作为日志门面 -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>1.7.26</version>
    </dependency>
    <!-- 使用 log4j2 的适配器进行绑定 -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-slf4j-impl</artifactId>
        <version>2.9.1</version>
    </dependency>
 
    <!-- log4j2 日志门面 -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-api</artifactId>
        <version>2.11.1</version>
    </dependency>
    <!-- log4j2 日志实面 -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-core</artifactId>
        <version>2.11.1</version>
    </dependency>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration>
    <!--<Configuration status="WARN" monitorInterval="30"> -->
    <properties>
        <property name="LOG_HOME">./service-logs</property>
    </properties>
    <Appenders>
        <!--*********************控制台日志***********************-->
        <Console name="consoleAppender" target="SYSTEM_OUT">
            <!--设置日志格式及颜色-->
            <PatternLayout
                    pattern="%style{%d{yyyy-MM-dd HH:mm:ss}}{cyan} [%highlight{%level}] %style{%C{}}{blue}: %msg%n%style{%throwable}{red}"
                    disableAnsi="false" noConsoleNoAnsi="false"/>
        </Console>

        <!--*********************文件日志***********************-->

<!--        &lt;!&ndash;debug级别日志&ndash;&gt;-->
<!--        <RollingFile name="debugFileAppender"-->
<!--                     fileName="${LOG_HOME}/debug.log"-->
<!--                     filePattern="${LOG_HOME}/$${date:yyyy-MM}/debug-%d{yyyy-MM-dd}-%i.log.gz">-->
<!--            <Filters>-->
<!--                &lt;!&ndash;过滤掉info及更高级别日志&ndash;&gt;-->
<!--                <ThresholdFilter level="info" onMatch="DENY" onMismatch="NEUTRAL"/>-->
<!--            </Filters>-->
<!--            &lt;!&ndash;设置日志格式&ndash;&gt;-->
<!--            <PatternLayout>-->
<!--                <pattern>%d %p %C{} [%t] %m%n</pattern>-->
<!--            </PatternLayout>-->
<!--            <Policies>-->
<!--                &lt;!&ndash; 设置日志文件切分参数 &ndash;&gt;-->
<!--                &lt;!&ndash;<OnStartupTriggeringPolicy/>&ndash;&gt;-->
<!--                &lt;!&ndash;设置日志基础文件大小，超过该大小就触发日志文件滚动更新&ndash;&gt;-->
<!--                <SizeBasedTriggeringPolicy size="100 MB"/>-->
<!--                &lt;!&ndash;设置日志文件滚动更新的时间，依赖于文件命名filePattern的设置&ndash;&gt;-->
<!--                <TimeBasedTriggeringPolicy/>-->
<!--            </Policies>-->
<!--            &lt;!&ndash;设置日志的文件个数上限，不设置默认为7个，超过大小后会被覆盖；依赖于filePattern中的%i&ndash;&gt;-->
<!--            <DefaultRolloverStrategy max="100"/>-->
<!--        </RollingFile>-->


    </Appenders>

    <Loggers>
        <!-- 根日志设置 -->
        <Root level="INFO">
            <AppenderRef ref="consoleAppender" level="info"/>
        </Root>

<!--        &lt;!&ndash;spring日志&ndash;&gt;-->
<!--        <Logger name="org.springframework" level="debug"/>-->
<!--        &lt;!&ndash;druid数据源日志&ndash;&gt;-->
<!--        <Logger name="druid.sql.Statement" level="warn"/>-->
<!--        &lt;!&ndash; mybatis日志 &ndash;&gt;-->
<!--        <Logger name="com.mybatis" level="warn"/>-->
<!--        <Logger name="org.hibernate" level="warn"/>-->
<!--        <Logger name="com.zaxxer.hikari" level="info"/>-->
<!--        <Logger name="org.quartz" level="info"/>-->
<!--        <Logger name="com.andya.demo" level="debug"/>-->
    </Loggers>

</Configuration>

```