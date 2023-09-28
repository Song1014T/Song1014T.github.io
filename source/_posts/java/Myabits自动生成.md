---
title: Mybaits自动生成
categories: java
cover: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.Is2yEGD5UpcDWjgEZxI3aAHaEo'
description: Mybaits自动生成代码的一些配置
abbrlink: 30098
date: 2023-09-01 13:47:00
updated: 2023-09-01 13:47:00
---

### 背景说明
> 笔者最近在做微服务解耦分层，遇到了建表自动生成代码的问题。因为不想每次建完表后，一个一个建Service、Mapper、Domain，实在是太累啦~
> 但Mybaits自动生成代码不适用于分层后的项目。
> 笔者尝试过Mybaits-X，easy-code等等插件，都没有有效的解决这个问题。
> 于是笔者思来想去 决定还是自己稍微改造一下Mybaits的自动生成代码。

### 正文
> 笔者把依赖放在Application中，也就是Service中。所以代码也在其中。
> 相关依赖
```xml
   <!-- 代码自动生成器依赖-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-generator</artifactId>
            <version>3.0.5</version>
        </dependency>

        <dependency>
            <groupId>org.apache.velocity</groupId>
            <artifactId>velocity-engine-core</artifactId>
            <version>2.2</version>
        </dependency>
```

> 在此说明！笔者尝试过，抽取相同代码。但碍于数据库连接问题可能又或者是生成器的问题。总之不能抽公共部分
> 否则会造成生成相同的文件并且覆盖。无了个大语~  绝对不是笔者屎山代码~
> 如果是微服务，只需要改动上面的配置属性即可。如果不是的话，用最原始的代码生成器即可。
> 看下面具体代码吧。

```java
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.core.exceptions.MybatisPlusException;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.po.TableFill;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import org.apache.commons.lang.StringUtils;

import java.io.File;
import java.util.ArrayList;
import java.util.Scanner;

public class MybatisGenerator {
    //父模块(如果不是微服务，此项可以为空)
    private final static String PARENT_MODULE = "yybk-service-cloud-prodiver-1014";
    //服务层
    private final static String APPLICATION_MODULE = "yybk-application";
    //模组层
    private final static String DOMAIN_MODULE = "yybk-domain";
    //持久层
    private final static String PORT_MODULE = "yybk-port";
    //控制层
    private final static String RESOURCE_MODULE = "yybk-resource";
    //数据库连接地址
    private final static String DATA_SOURCE_URL = "jdbc:mysql://192.168.10.252:3306/mk_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8";
    //数据库用户名
    private final static String DATA_USERNAME = "yuneng";
    //数据库密码
    private final static String DATA_PASSWORD = "123456";
    //数据库驱动
    private final static String DATA_DRIVER_NAME = "com.mysql.jdbc.Driver";




    public static void main(String[] args) {
        String table = scanner("<表名>多个以逗号分隔");

        // 生成代码
        executeApplication(table);
        executePort(table);
        executeDomain(table);
        executeResource(table);
    }


    public static void executeApplication(String table){
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        gc.setFileOverride(true);//是否覆盖以前文件
        gc.setOpen(false);//是否打开生成目录
        gc.setAuthor("柳如丝儿~");//设置项目作者名称
        gc.setIdType(IdType.AUTO);//设置主键策略
        gc.setBaseResultMap(true);//生成基本ResultMap
        gc.setBaseColumnList(true);//生成基本ColumnList
        gc.setServiceName("%sService");//去掉服务默认前缀
        gc.setDateType(DateType.ONLY_DATE);//设置时间类型

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl(DATA_SOURCE_URL);
        dsc.setDriverName(DATA_DRIVER_NAME);
        dsc.setUsername(DATA_USERNAME);
        dsc.setPassword(DATA_PASSWORD);
        mpg.setDataSource(dsc);


        // 策略配置
        StrategyConfig sc = new StrategyConfig();
        sc.setNaming(NamingStrategy.underline_to_camel);
        sc.setColumnNaming(NamingStrategy.underline_to_camel);
        sc.setEntityLombokModel(true);//TODO 自动lombok
        sc.setRestControllerStyle(true);
        sc.setControllerMappingHyphenStyle(true);
        sc.setLogicDeleteFieldName("deleted");//设置逻辑删除

        //设置自动填充配置
        TableFill gmt_create = new TableFill("create_time", FieldFill.INSERT);
        TableFill gmt_modified = new TableFill("update_time", FieldFill.INSERT_UPDATE);
        ArrayList<TableFill> tableFills=new ArrayList<>();
        tableFills.add(gmt_create);
        tableFills.add(gmt_modified);
        sc.setTableFillList(tableFills);

        //乐观锁
        sc.setVersionFieldName("version");
        sc.setRestControllerStyle(true);//驼峰命名

        //  sc.setTablePrefix("tbl_"); 设置表名前缀
        sc.setInclude(table);
        mpg.setStrategy(sc);
        //设置代码生成的父包(此项仅用于分层后)
        String projectPath = System.getProperty("user.dir") + File.separator + PARENT_MODULE + File.separator + APPLICATION_MODULE;
        gc.setOutputDir(projectPath + "/src/main/java");//设置代码生成路径
        mpg.setGlobalConfig(gc);
        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent("cc.yybk");
        pc.setService("app");
        pc.setServiceImpl("app.impl");
        TemplateConfig tc = new TemplateConfig();
        tc.setController(null);
        tc.setEntity(null);
        tc.setMapper(null);
        tc.setXml(null);
        mpg.setTemplate(tc);
        mpg.setPackageInfo(pc);
        mpg.execute();

    }


    public static void executeDomain(String table){
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        gc.setFileOverride(true);//是否覆盖以前文件
        gc.setOpen(false);//是否打开生成目录
        gc.setAuthor("柳如丝儿~");//设置项目作者名称
        gc.setIdType(IdType.AUTO);//设置主键策略
        gc.setBaseResultMap(true);//生成基本ResultMap
        gc.setBaseColumnList(true);//生成基本ColumnList
        gc.setServiceName("%sService");//去掉服务默认前缀
        gc.setDateType(DateType.ONLY_DATE);//设置时间类型

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl(DATA_SOURCE_URL);
        dsc.setDriverName(DATA_DRIVER_NAME);
        dsc.setUsername(DATA_USERNAME);
        dsc.setPassword(DATA_PASSWORD);
        mpg.setDataSource(dsc);


        // 策略配置
        StrategyConfig sc = new StrategyConfig();
        sc.setNaming(NamingStrategy.underline_to_camel);
        sc.setColumnNaming(NamingStrategy.underline_to_camel);
        sc.setEntityLombokModel(true);//TODO 自动lombok
        sc.setRestControllerStyle(true);
        sc.setControllerMappingHyphenStyle(true);
        sc.setLogicDeleteFieldName("deleted");//设置逻辑删除

        //设置自动填充配置
        TableFill gmt_create = new TableFill("create_time", FieldFill.INSERT);
        TableFill gmt_modified = new TableFill("update_time", FieldFill.INSERT_UPDATE);
        ArrayList<TableFill> tableFills=new ArrayList<>();
        tableFills.add(gmt_create);
        tableFills.add(gmt_modified);
        sc.setTableFillList(tableFills);

        //乐观锁
        sc.setVersionFieldName("version");
        sc.setRestControllerStyle(true);//驼峰命名

        //  sc.setTablePrefix("tbl_"); 设置表名前缀
        sc.setInclude(table);
        mpg.setStrategy(sc);
        //设置代码生成的父包(此项仅用于分层后)
        String projectPath = System.getProperty("user.dir") + "/" + PARENT_MODULE + "/" +  DOMAIN_MODULE;
        gc.setOutputDir(projectPath + "/src/main/java");//设置代码生成路径
        mpg.setGlobalConfig(gc);
        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent("cc.yybk");
        pc.setEntity("domain");
        TemplateConfig tc = new TemplateConfig();
        tc.setXml(null);
        tc.setService(null);
        tc.setMapper(null);
        tc.setController(null);
        tc.setServiceImpl(null);
        mpg.setTemplate(tc);
        mpg.setPackageInfo(pc);
        mpg.execute();
    }


    public static void executePort(String table){
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        gc.setFileOverride(true);//是否覆盖以前文件
        gc.setOpen(false);//是否打开生成目录
        gc.setAuthor("柳如丝儿~");//设置项目作者名称
        gc.setIdType(IdType.AUTO);//设置主键策略
        gc.setBaseResultMap(true);//生成基本ResultMap
        gc.setBaseColumnList(true);//生成基本ColumnList
        gc.setServiceName("%sService");//去掉服务默认前缀
        gc.setDateType(DateType.ONLY_DATE);//设置时间类型

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl(DATA_SOURCE_URL);
        dsc.setDriverName(DATA_DRIVER_NAME);
        dsc.setUsername(DATA_USERNAME);
        dsc.setPassword(DATA_PASSWORD);
        mpg.setDataSource(dsc);


        // 策略配置
        StrategyConfig sc = new StrategyConfig();
        sc.setNaming(NamingStrategy.underline_to_camel);
        sc.setColumnNaming(NamingStrategy.underline_to_camel);
        sc.setEntityLombokModel(true);//TODO 自动lombok
        sc.setRestControllerStyle(true);
        sc.setControllerMappingHyphenStyle(true);
        sc.setLogicDeleteFieldName("deleted");//设置逻辑删除

        //设置自动填充配置
        TableFill gmt_create = new TableFill("create_time", FieldFill.INSERT);
        TableFill gmt_modified = new TableFill("update_time", FieldFill.INSERT_UPDATE);
        ArrayList<TableFill> tableFills=new ArrayList<>();
        tableFills.add(gmt_create);
        tableFills.add(gmt_modified);
        sc.setTableFillList(tableFills);

        //乐观锁
        sc.setVersionFieldName("version");
        sc.setRestControllerStyle(true);//驼峰命名

        //  sc.setTablePrefix("tbl_"); 设置表名前缀
        sc.setInclude(table);
        mpg.setStrategy(sc);
        //设置代码生成的父包(此项仅用于分层后)
        String projectPath = System.getProperty("user.dir") + "/" + PARENT_MODULE + "/" + PORT_MODULE;
        gc.setOutputDir(projectPath + "/src/main/java");//设置代码生成路径
        mpg.setGlobalConfig(gc);
        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent("cc.yybk");
        pc.setMapper("mapper");
        pc.setXml("mapper.xml");
        TemplateConfig tc = new TemplateConfig();
        tc.setEntity(null);
        tc.setService(null);
        tc.setController(null);
        tc.setServiceImpl(null);
        mpg.setTemplate(tc);
        mpg.setPackageInfo(pc);
        mpg.execute();
    }

    public static void executeResource(String table){
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        gc.setFileOverride(true);//是否覆盖以前文件
        gc.setOpen(false);//是否打开生成目录
        gc.setAuthor("柳如丝儿~");//设置项目作者名称
        gc.setIdType(IdType.AUTO);//设置主键策略
        gc.setBaseResultMap(true);//生成基本ResultMap
        gc.setBaseColumnList(true);//生成基本ColumnList
        gc.setServiceName("%sService");//去掉服务默认前缀
        gc.setDateType(DateType.ONLY_DATE);//设置时间类型

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl(DATA_SOURCE_URL);
        dsc.setDriverName(DATA_DRIVER_NAME);
        dsc.setUsername(DATA_USERNAME);
        dsc.setPassword(DATA_PASSWORD);
        mpg.setDataSource(dsc);


        // 策略配置
        StrategyConfig sc = new StrategyConfig();
        sc.setNaming(NamingStrategy.underline_to_camel);
        sc.setColumnNaming(NamingStrategy.underline_to_camel);
        sc.setEntityLombokModel(true);//TODO 自动lombok
        sc.setRestControllerStyle(false);
        sc.setControllerMappingHyphenStyle(false);
        sc.setLogicDeleteFieldName("deleted");//设置逻辑删除

        //设置自动填充配置
        TableFill gmt_create = new TableFill("create_time", FieldFill.INSERT);
        TableFill gmt_modified = new TableFill("update_time", FieldFill.INSERT_UPDATE);
        ArrayList<TableFill> tableFills=new ArrayList<>();
        tableFills.add(gmt_create);
        tableFills.add(gmt_modified);
        sc.setTableFillList(tableFills);

        //乐观锁
        sc.setVersionFieldName("version");
        sc.setRestControllerStyle(true);//驼峰命名

        //  sc.setTablePrefix("tbl_"); 设置表名前缀
        sc.setInclude(table);
        mpg.setStrategy(sc);
        //设置代码生成的父包(此项仅用于分层后)
        String projectPath = System.getProperty("user.dir") + File.separator + PARENT_MODULE + File.separator + RESOURCE_MODULE;
        gc.setOutputDir(projectPath + "/src/main/java");//设置代码生成路径
        mpg.setGlobalConfig(gc);
        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent("cc.yybk.resource");
        pc.setController("web");
        TemplateConfig tc = new TemplateConfig();
        tc.setEntity(null);
        tc.setXml(null);
        tc.setMapper(null);
        tc.setService(null);
        tc.setServiceImpl(null);
        mpg.setTemplate(tc);
        mpg.setPackageInfo(pc);
        mpg.execute();
    }


    public static String scanner(String tip) {
        Scanner scanner = new Scanner(System.in);
        StringBuilder help = new StringBuilder();
        help.append("请输入" + tip + "：");
        System.out.println(help.toString());
        if (scanner.hasNext()) {
            String ipt = scanner.next();
            if (StringUtils.isNotBlank(ipt)) {
                return ipt;
            }
        }
        throw new MybatisPlusException("请输入正确的" + tip + "！");
    }
}

```


> 笔者发现还是有点繁琐，于是又进行了改进，但还是存在一丢丢的bug 例如创建好xml后 不能自动映射到实体类。
> 实体类中Package默认不是指定的子包路径
> 无奈.jpg

```java
public class MybatisGenerator {
    //TODO 修改表路径修改这里即可
    //Application子包
    private final static String APPLICATION_CHILD_PACKAGE = "execute";
    //Domain子包
    private final static String DOMAIN_CHILD_PACKAGE = "pojo";
    //Port子包
    private final static String PORT_CHILD_PACKAGE = "query";
    //Resource子包
    private final static String RESOURCE_CHILD_PACKAGE = "web";


    //TODO 首次使用需要配置一下 数据库连接、模块、父包
    //Application父包
    private final static String APPLICATION_BASE_PACKAGE = "cc.yybk.app";
    //Domain父包
    private final static String DOMAIN_BASE_PACKAGE = "cc.yybk.domain";
    //Port父包
    private final static String PORT_BASE_PACKAGE = "cc.yybk.port";
    //Resource父包
    private final static String RESOURCE_BASE_PACKAGE = "cc.yybk.resource";
    //父模块(如果不是微服务，此项可以为空)
    private final static String PARENT_MODULE = "yybk-service-cloud-prodiver-1014";
    //服务层
    private final static String APPLICATION_MODULE = "yybk-application";
    //模组层
    private final static String DOMAIN_MODULE = "yybk-domain";
    //持久层
    private final static String PORT_MODULE = "yybk-port";
    //控制层
    private final static String RESOURCE_MODULE = "yybk-resource";
    //数据库连接地址
    private final static String DATA_SOURCE_URL = "jdbc:mysql://192.168.10.252:3306/mk_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8";
    //数据库用户名
    private final static String DATA_USERNAME = "yuneng";
    //数据库密码
    private final static String DATA_PASSWORD = "123456";
    //数据库驱动
    private final static String DATA_DRIVER_NAME = "com.mysql.jdbc.Driver";


    public static void main(String[] args) {
        String table = scanner("<表名>多个以逗号分隔");

        // 生成代码
        executeApplication(table);
        executePort(table);
        executeDomain(table);
        executeResource(table);
        executeXml(table);
    }


    public static void executeApplication(String table) {
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        gc.setFileOverride(true);//是否覆盖以前文件
        gc.setOpen(false);//是否打开生成目录
        gc.setAuthor("柳如丝儿~");//设置项目作者名称
        gc.setIdType(IdType.AUTO);//设置主键策略
        gc.setBaseResultMap(true);//生成基本ResultMap
        gc.setBaseColumnList(true);//生成基本ColumnList
        gc.setServiceName("%sService");//去掉服务默认前缀
        gc.setDateType(DateType.ONLY_DATE);//设置时间类型

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl(DATA_SOURCE_URL);
        dsc.setDriverName(DATA_DRIVER_NAME);
        dsc.setUsername(DATA_USERNAME);
        dsc.setPassword(DATA_PASSWORD);
        mpg.setDataSource(dsc);


        // 策略配置
        StrategyConfig sc = new StrategyConfig();
        sc.setNaming(NamingStrategy.underline_to_camel);
        sc.setColumnNaming(NamingStrategy.underline_to_camel);
        sc.setEntityLombokModel(true);//TODO 自动lombok
        sc.setRestControllerStyle(true);
        sc.setControllerMappingHyphenStyle(true);
        sc.setLogicDeleteFieldName("deleted");//设置逻辑删除

        //设置自动填充配置
        TableFill gmt_create = new TableFill("create_time", FieldFill.INSERT);
        TableFill gmt_modified = new TableFill("update_time", FieldFill.INSERT_UPDATE);
        ArrayList<TableFill> tableFills = new ArrayList<>();
        tableFills.add(gmt_create);
        tableFills.add(gmt_modified);
        sc.setTableFillList(tableFills);

        //乐观锁
        sc.setVersionFieldName("version");
        sc.setRestControllerStyle(true);//驼峰命名

        //  sc.setTablePrefix("tbl_"); 设置表名前缀
        sc.setInclude(table);
        mpg.setStrategy(sc);
        //设置代码生成的父包(此项仅用于分层后)
        String projectPath = System.getProperty("user.dir") + File.separator + PARENT_MODULE + File.separator + APPLICATION_MODULE;
        gc.setOutputDir(projectPath + "/src/main/java");//设置代码生成路径
        mpg.setGlobalConfig(gc);
        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent(APPLICATION_BASE_PACKAGE);
        pc.setService(APPLICATION_CHILD_PACKAGE);
        pc.setServiceImpl(APPLICATION_CHILD_PACKAGE + ".impl");
        TemplateConfig tc = new TemplateConfig();
        tc.setController(null);
        tc.setEntity(null);
        tc.setMapper(null);
        tc.setXml(null);
        mpg.setTemplate(tc);
        mpg.setPackageInfo(pc);
        mpg.execute();

    }


    public static void executeDomain(String table) {
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        gc.setFileOverride(true);//是否覆盖以前文件
        gc.setOpen(false);//是否打开生成目录
        gc.setAuthor("柳如丝儿~");//设置项目作者名称
        gc.setIdType(IdType.AUTO);//设置主键策略
        gc.setBaseResultMap(true);//生成基本ResultMap
        gc.setBaseColumnList(true);//生成基本ColumnList
        gc.setServiceName("%sService");//去掉服务默认前缀
        gc.setDateType(DateType.ONLY_DATE);//设置时间类型

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl(DATA_SOURCE_URL);
        dsc.setDriverName(DATA_DRIVER_NAME);
        dsc.setUsername(DATA_USERNAME);
        dsc.setPassword(DATA_PASSWORD);
        mpg.setDataSource(dsc);


        // 策略配置
        StrategyConfig sc = new StrategyConfig();
        sc.setNaming(NamingStrategy.underline_to_camel);
        sc.setColumnNaming(NamingStrategy.underline_to_camel);
        sc.setEntityLombokModel(true);//TODO 自动lombok
        sc.setRestControllerStyle(true);
        sc.setControllerMappingHyphenStyle(true);
        sc.setLogicDeleteFieldName("deleted");//设置逻辑删除

        //设置自动填充配置
        TableFill gmt_create = new TableFill("create_time", FieldFill.INSERT);
        TableFill gmt_modified = new TableFill("update_time", FieldFill.INSERT_UPDATE);
        ArrayList<TableFill> tableFills = new ArrayList<>();
        tableFills.add(gmt_create);
        tableFills.add(gmt_modified);
        sc.setTableFillList(tableFills);

        //乐观锁
        sc.setVersionFieldName("version");
        sc.setRestControllerStyle(true);//驼峰命名

        //  sc.setTablePrefix("tbl_"); 设置表名前缀
        sc.setInclude(table);
        mpg.setStrategy(sc);
        //设置代码生成的父包(此项仅用于分层后)
        String projectPath = System.getProperty("user.dir") + "/" + PARENT_MODULE + "/" + DOMAIN_MODULE;
        gc.setOutputDir(projectPath + "/src/main/java");//设置代码生成路径
        mpg.setGlobalConfig(gc);
        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent(DOMAIN_BASE_PACKAGE);
        pc.setEntity(DOMAIN_CHILD_PACKAGE);
        TemplateConfig tc = new TemplateConfig();
        tc.setXml(null);
        tc.setService(null);
        tc.setMapper(null);
        tc.setController(null);
        tc.setServiceImpl(null);
        mpg.setTemplate(tc);
        mpg.setPackageInfo(pc);
        mpg.execute();
    }


    public static void executePort(String table) {
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        gc.setFileOverride(true);//是否覆盖以前文件
        gc.setOpen(false);//是否打开生成目录
        gc.setAuthor("柳如丝儿~");//设置项目作者名称
        gc.setIdType(IdType.AUTO);//设置主键策略
        gc.setBaseResultMap(true);//生成基本ResultMap
        gc.setBaseColumnList(true);//生成基本ColumnList
        gc.setServiceName("%sService");//去掉服务默认前缀
        gc.setDateType(DateType.ONLY_DATE);//设置时间类型

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl(DATA_SOURCE_URL);
        dsc.setDriverName(DATA_DRIVER_NAME);
        dsc.setUsername(DATA_USERNAME);
        dsc.setPassword(DATA_PASSWORD);
        mpg.setDataSource(dsc);


        // 策略配置
        StrategyConfig sc = new StrategyConfig();
        sc.setNaming(NamingStrategy.underline_to_camel);
        sc.setColumnNaming(NamingStrategy.underline_to_camel);
        sc.setEntityLombokModel(true);//TODO 自动lombok
        sc.setRestControllerStyle(true);
        sc.setControllerMappingHyphenStyle(true);
        sc.setLogicDeleteFieldName("deleted");//设置逻辑删除

        //设置自动填充配置
        TableFill gmt_create = new TableFill("create_time", FieldFill.INSERT);
        TableFill gmt_modified = new TableFill("update_time", FieldFill.INSERT_UPDATE);
        ArrayList<TableFill> tableFills = new ArrayList<>();
        tableFills.add(gmt_create);
        tableFills.add(gmt_modified);
        sc.setTableFillList(tableFills);

        //乐观锁
        sc.setVersionFieldName("version");
        sc.setRestControllerStyle(true);//驼峰命名

        //  sc.setTablePrefix("tbl_"); 设置表名前缀
        sc.setInclude(table);
        mpg.setStrategy(sc);
        //设置代码生成的父包(此项仅用于分层后)
        String projectPath = System.getProperty("user.dir") + "/" + PARENT_MODULE + "/" + PORT_MODULE;
        gc.setOutputDir(projectPath + "/src/main/java");//设置代码生成路径
        mpg.setGlobalConfig(gc);
        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent(PORT_BASE_PACKAGE);
        pc.setMapper(PORT_CHILD_PACKAGE);
//        pc.setXml("mapper.xml");
        TemplateConfig tc = new TemplateConfig();
        tc.setEntity(null);
        tc.setService(null);
        tc.setController(null);
        tc.setServiceImpl(null);
        tc.setXml(null);
        mpg.setTemplate(tc);
        mpg.setPackageInfo(pc);
        mpg.execute();
    }


    public static void executeXml(String table) {
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        gc.setFileOverride(true);//是否覆盖以前文件
        gc.setOpen(false);//是否打开生成目录
        gc.setAuthor("柳如丝儿~");//设置项目作者名称
        gc.setIdType(IdType.AUTO);//设置主键策略
        gc.setBaseResultMap(true);//生成基本ResultMap
        gc.setBaseColumnList(true);//生成基本ColumnList
        gc.setServiceName("%sService");//去掉服务默认前缀
        gc.setDateType(DateType.ONLY_DATE);//设置时间类型

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl(DATA_SOURCE_URL);
        dsc.setDriverName(DATA_DRIVER_NAME);
        dsc.setUsername(DATA_USERNAME);
        dsc.setPassword(DATA_PASSWORD);
        mpg.setDataSource(dsc);


        // 策略配置
        StrategyConfig sc = new StrategyConfig();
        sc.setNaming(NamingStrategy.underline_to_camel);
        sc.setColumnNaming(NamingStrategy.underline_to_camel);
        sc.setEntityLombokModel(true);//TODO 自动lombok
        sc.setRestControllerStyle(true);
        sc.setControllerMappingHyphenStyle(true);
        sc.setLogicDeleteFieldName("deleted");//设置逻辑删除

        //设置自动填充配置
        TableFill gmt_create = new TableFill("create_time", FieldFill.INSERT);
        TableFill gmt_modified = new TableFill("update_time", FieldFill.INSERT_UPDATE);
        ArrayList<TableFill> tableFills = new ArrayList<>();
        tableFills.add(gmt_create);
        tableFills.add(gmt_modified);
        sc.setTableFillList(tableFills);

        //乐观锁
        sc.setVersionFieldName("version");
        sc.setRestControllerStyle(true);//驼峰命名

        //  sc.setTablePrefix("tbl_"); 设置表名前缀
        sc.setInclude(table);
        mpg.setStrategy(sc);
        //设置代码生成的父包(此项仅用于分层后)
        String projectPath = System.getProperty("user.dir") + "/" + PARENT_MODULE + "/" + PORT_MODULE;
        gc.setOutputDir(projectPath + "/src/main/resources");//设置代码生成路径
        mpg.setGlobalConfig(gc);
        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent("mapper");
        pc.setXml(PORT_CHILD_PACKAGE);
        TemplateConfig tc = new TemplateConfig();
        tc.setEntity(null);
        tc.setService(null);
        tc.setController(null);
        tc.setServiceImpl(null);
        tc.setMapper(null);
        mpg.setTemplate(tc);
        mpg.setPackageInfo(pc);
        mpg.execute();
    }

    public static void executeResource(String table) {
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        gc.setFileOverride(true);//是否覆盖以前文件
        gc.setOpen(false);//是否打开生成目录
        gc.setAuthor("柳如丝儿~");//设置项目作者名称
        gc.setIdType(IdType.AUTO);//设置主键策略
        gc.setBaseResultMap(true);//生成基本ResultMap
        gc.setBaseColumnList(true);//生成基本ColumnList
        gc.setServiceName("%sService");//去掉服务默认前缀
        gc.setDateType(DateType.ONLY_DATE);//设置时间类型

        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl(DATA_SOURCE_URL);
        dsc.setDriverName(DATA_DRIVER_NAME);
        dsc.setUsername(DATA_USERNAME);
        dsc.setPassword(DATA_PASSWORD);
        mpg.setDataSource(dsc);


        // 策略配置
        StrategyConfig sc = new StrategyConfig();
        sc.setNaming(NamingStrategy.underline_to_camel);
        sc.setColumnNaming(NamingStrategy.underline_to_camel);
        sc.setEntityLombokModel(true);//TODO 自动lombok
        sc.setRestControllerStyle(false);
        sc.setControllerMappingHyphenStyle(false);
        sc.setLogicDeleteFieldName("deleted");//设置逻辑删除

        //设置自动填充配置
        TableFill gmt_create = new TableFill("create_time", FieldFill.INSERT);
        TableFill gmt_modified = new TableFill("update_time", FieldFill.INSERT_UPDATE);
        ArrayList<TableFill> tableFills = new ArrayList<>();
        tableFills.add(gmt_create);
        tableFills.add(gmt_modified);
        sc.setTableFillList(tableFills);

        //乐观锁
        sc.setVersionFieldName("version");
        sc.setRestControllerStyle(true);//驼峰命名

        //  sc.setTablePrefix("tbl_"); 设置表名前缀
        sc.setInclude(table);
        mpg.setStrategy(sc);
        //设置代码生成的父包(此项仅用于分层后)
        String projectPath = System.getProperty("user.dir") + File.separator + PARENT_MODULE + File.separator + RESOURCE_MODULE;
        gc.setOutputDir(projectPath + "/src/main/java");//设置代码生成路径
        mpg.setGlobalConfig(gc);
        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent(RESOURCE_BASE_PACKAGE);
        pc.setController(RESOURCE_CHILD_PACKAGE);
        TemplateConfig tc = new TemplateConfig();
        tc.setEntity(null);
        tc.setXml(null);
        tc.setMapper(null);
        tc.setService(null);
        tc.setServiceImpl(null);
        mpg.setTemplate(tc);
        mpg.setPackageInfo(pc);
        mpg.execute();
    }


    public static String scanner(String tip) {
        Scanner scanner = new Scanner(System.in);
        StringBuilder help = new StringBuilder();
        help.append("请输入" + tip + "：");
        System.out.println(help.toString());
        if (scanner.hasNext()) {
            String ipt = scanner.next();
            if (StringUtils.isNotBlank(ipt)) {
                return ipt;
            }
        }
        throw new MybatisPlusException("请输入正确的" + tip + "！");
    }


}

```
