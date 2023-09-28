---
title: Maven分层后的一些坑
categories: java
cover: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.Sl0CKQQpBxWoOub28c2N-wAAAA'
description: 关于Maven分层后各种坑。
abbrlink: 30099
date: 2023-08-31 16:30:00
updated: 2023-08-31 16:30:00
---

### Maven分层的结构体系
- application  不以骨架方式创建
- port 不以骨架方式创建
- domain 不以骨架方式创建
- resource 必须以骨架创建
  
### 父pom.xml
> packaging 必须是pom modules里引入各个模块。
> 可以在properties标签里 引入spring.version mysql.version ....等等

```xml
<packaging>pom</packaging>

<modules>
    <module>yybk-application</module>
    <module>yybk-domain</module>
    <module>yybk-resource</module> 
    <module>yybk-port</module>
</modules>

<properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

     
        <junit.version>4.12</junit.version>
        <log4j.version>1.2.17</log4j.version>
        <lombok.version>1.16.18</lombok.version>
        <mysql.version>5.1.49</mysql.version>
        <mybaits.version>3.0.1</mybaits.version>
        <springloaded.version>1.2.8.RELEASE</springloaded.version>
</properties>

<!--下面是spring的依赖,作用于子模块-->
 <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context-support</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-orm</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>

    </dependencies>


       <build>
        <plugins>
            <plugin>
                <artifactId>maven-clean-plugin</artifactId>
                <version>3.1.0</version>
            </plugin>
            <plugin>
                <artifactId>maven-resources-plugin</artifactId>
                <version>3.0.2</version>
            </plugin>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.0</version>
            </plugin>
            <plugin>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>2.22.1</version>
            </plugin>
            <plugin>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.2.2</version>
            </plugin>
            <plugin>
                <artifactId>maven-install-plugin</artifactId>
                <version>2.5.2</version>
            </plugin>
            <plugin>
                <artifactId>maven-deploy-plugin</artifactId>
                <version>2.8.2</version>
            </plugin>
        </plugins>
    </build>

```


### 子模块pom如何写
> resource 引 application ，application 引 port 和 domain
> 鉴于解耦思想，resource模块建议只引入application


### resource中主类启动配置
> @SpringBootApplication(scanBasePackages = {"cc.yybk.*"}) 扫描所有依赖 

### 有个bug类似 
> 笔者创建许多SpringBoot项目 有时候会自动创建一个ServletInitializer的类 但有时候并没有。
> 这个类有什么用？如果没有这个类，曾经尝试使用Jetty启动服务会报错。大概应该兼容各种web容器吧。
> 我决定要把这个类保存在这里 。

```java
package cc.yybk.resource;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(YybkResourceApplication.class);
    }

}

```


### Maven一些常用的依赖
> 笔者每次想用到某些依赖，还要到处去翻，太累了。
> 于是我觉得将一些常用的依赖也记录在这里。
> 如果是微服务，在最大pom中 
> 这样子在后续的模块组件中就不用担心版本冲突了
```xml
   <!--在这里管理所有cloud的依赖 保证一致性-->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Hoxton.SR12</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```

> 注册中心
```xml
         <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
```

> mysql 和 mybatis
```xml
    <!--mysql驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.26</version>
        </dependency>

            <!--mybatis-plus的依赖-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.0.1</version>
        </dependency>

          <!--sql连接池-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.1.18</version>
        </dependency>
```

> 接口文档(丝袜哥儿)
```xml

        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
            <version>2.9.2</version>
        </dependency>
        <!--用于访问http://localhost:8080/swagger-ui.html-->
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger-ui</artifactId>
            <version>2.9.2</version>
        </dependency>
        <!--用于访问http://localhost:8080/doc.html-->
        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>swagger-bootstrap-ui</artifactId>
            <version>1.9.6</version>
        </dependency>

        <!--因为swagger2 是依赖于Google的guava，我本项目中引入的swagger2是最高版本，因此引入下面的jar包，否侧报错“Failed to start bean 'documentationPluginsBootstrapper-->
        <dependency>
            <groupId>com.google.guava</groupId>
            <artifactId>guava</artifactId>
            <version>20.0</version>
        </dependency>
```

> Jetty服务器
```xml

        <!--Jetty服务器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jetty</artifactId>
            <scope>provided</scope>
        </dependency>
```


> redis
```xml
    <!--redis依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
            <version>2.4.0</version>
        </dependency>

         <!--Redis连接池-->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-pool2</artifactId>
        </dependency>

```

> mail邮件
```xml
     <!--mail邮件发送-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
             <artifactId>spring-boot-starter-mail</artifactId>
        </dependency>
```

> JWT
```xml
  <!--jwt依赖-->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.7.0</version>
        </dependency>
```

> 其他常用工具包
```xml
     <!--hutool工具包-->
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-json</artifactId>
            <version>5.7.10</version>
        </dependency>

        <!--StringUtils的依赖-->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.7</version>
        </dependency>

        <!--HtmlClient-->
        <dependency>
            <groupId>net.sourceforge.htmlunit</groupId>
            <artifactId>htmlunit</artifactId>
            <version>2.29</version>
        </dependency>

        
        <!--HttpClient-->
        <dependency>
            <groupId>org.apache.httpcomponents</groupId>
            <artifactId>httpclient</artifactId>
        </dependency>

        <!--爬虫-->
        <dependency>
            <groupId>org.jsoup</groupId>
            <artifactId>jsoup</artifactId>
            <version>1.11.3</version>
        </dependency>
        <!--lombok get、set、有参、无参-->
           <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
```
