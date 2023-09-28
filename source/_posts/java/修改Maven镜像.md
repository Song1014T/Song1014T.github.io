---
title: 修改Maven镜像
categories: java
cover: 'https://pic3.zhimg.com/80/v2-961b311aa7f4069fc910254d2372355e_720w.webp'
description: 修改Maven镜像
abbrlink: 30064
date: 2023-09-21 09:30:00
updated: 2023-09-21 09:30:00
---


### Maven阿里云镜像代码

```xml
<mirror>
    <id>alimaven</id>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf>
</mirror>
```


### 仓库配置 
> 在settings标签下 添加localRepository标签指定本地仓库存放位置
```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">
  <localRepository>E:\maven-3.9.1\Repository</localRepository>
  ${repositorySystemSession.localRepository.directory}
```