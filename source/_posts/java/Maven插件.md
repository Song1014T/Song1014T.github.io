---
title: Maven插件
categories: java
cover: 'https://pic4.zhimg.com/v2-f70996b52494175c970335a4d9c3228f_r.jpg'
description: Maven插件。
abbrlink: 30065
date: 2023-09-20 16:30:00
updated: 2023-09-20 16:30:00
---


### 为什么要有Maven插件
> 在执行Maven Clean的时候 如果没有一个正常的插件会报错，导致Maven无法清除缓存，无法排查构建项目。
> 甚至我们在想看一些依赖在Downloading的时候(mvn install) 看不到有关信息。
> 笔者觉得把Maven的插件相关 放到这里保存。各位随意复制。
> 要补充的是笔者用的Maven版本 --->   3.9.1

#### 插件
```xml
 <build>
        <finalName>live.resource</finalName>
        <plugins>
            <!-- jetty run plugin -->
            <plugin>
                <groupId>org.eclipse.jetty</groupId>
                <artifactId>jetty-maven-plugin</artifactId>
                <version>9.3.25.v20180904</version>
                <configuration>
                    <httpConnector>
                        <port>8080</port>
                    </httpConnector>
                </configuration>
            </plugin>
        </plugins>
        <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
            <plugins>
                <plugin>
                    <artifactId>maven-clean-plugin</artifactId>
                    <version>3.1.0</version>
                </plugin>
                <!-- see http://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_war_packaging -->
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
        </pluginManagement>
    </build>
```

> 以上是笔者常用的一些插件 除了Jetty以外。