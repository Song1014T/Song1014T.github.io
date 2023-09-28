---
title: Java常用封装工具类
categories: java
cover: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.-34ZOx3wP4KeZnKue4L28gHaEo'
description: Java常用封装工具类
abbrlink: 30097
date: 2023-09-01 14:30:00
updated: 2023-09-01 14:30:00
---

### 背景说明
> 笔者`工作` + `学习`都要建相当多的Java工程、又是单项目，又是微服务，又是集群的。
> 可是这一切都建立在公司已经做好封装的基础上。如果有一天突然离职，这么好的封装类岂不是浪费掉了。
> 于是笔者打算把一些封装好的类。保留在这里。

### 代码
#### YResult<优雅的数据返回>
```java
public class YResult<T> {
    private T content;
    private int status;
    private String msg;

    public YResult(T c, int s) {
        this.content = c;
        this.status = s;
    }

    public YResult() {
    }

    public T getContent() {
        return this.content;
    }

    public int getStatus() {
        return this.status;
    }

    public void setContent(T c) {
        this.content = c;
    }

    public void setStatus(int s) {
        this.status = s;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return this.msg;
    }
}
```


#### YPager <优雅的分页数据返回>
```java
public class YPager<T> {
    private List<T> content;
    private int status;
    private String msg;
    private int total;
    private int pages;
    private int pageSize;
    private int pageIndex;
    private boolean isLastPage = false;

    public YPager() {
    }

    public YPager(List<T> c, int status, int total, int pageSize, int pageIndex) {
        this.content = c;
        this.status = status;
        this.total = total;
        this.pageSize = pageSize;
        this.pageIndex = pageIndex;
        this.pages = total / pageSize + (total % pageSize != 0 ? 1 : 0);
        if (pageIndex >= this.pages) {
            this.isLastPage = true;
        }

    }

    public YPager(int status, String msg) {
        this.status = status;
        this.msg = msg;
    }

    public void setAll(List<T> c, int status, int total, int pageSize, int pageIndex) {
        this.content = c;
        this.status = status;
        this.total = total;
        this.pageSize = pageSize;
        this.pageIndex = pageIndex;
        this.pages = total / pageSize + (total % pageSize != 0 ? 1 : 0);
        this.isLastPage = false;
        if (pageIndex >= this.pages) {
            this.isLastPage = true;
        }

    }

    public void setPager(int total, int pageSize, int pageIndex) {
        this.total = total;
        this.pageSize = pageSize;
        this.pageIndex = pageIndex;
        this.pages = total / pageSize + (total % pageSize != 0 ? 1 : 0);
        this.isLastPage = false;
        if (pageIndex >= this.pages) {
            this.isLastPage = true;
        }

    }

    public List<T> getContent() {
        return this.content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public int getStatus() {
        return this.status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public int getTotal() {
        return this.total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getPages() {
        return this.pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }

    public int getPageSize() {
        return this.pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getPageIndex() {
        return this.pageIndex;
    }

    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
    }

    public boolean isLastPage() {
        return this.pageIndex >= this.pages ? true : this.isLastPage;
    }
}
```

#### YException <自定义异常类>
```java
public class YException extends Exception {
    private static final long serialVersionUID = 1L;
    private Integer status;
    private String message;

    public YException() {
    }

    public YException(String message) {
        super(message);
        this.setStatus(0);
        this.setMessage(message);
    }

    public YException(Integer status, String message) {
        super(message);
        this.setStatus(status);
        this.setMessage(message);
    }

    public YException(Integer status, String message, Throwable cause) {
        super(message, cause);
        this.setStatus(status);
        this.setMessage(message);
    }

    public YException(String message, Throwable cause) {
        super(message, cause);
        this.setStatus(0);
        this.setMessage(message);
    }

    public YException(Throwable cause) {
        super(cause);
        this.setStatus(0);
        this.setMessage((String)null);
    }

    public Integer getStatus() {
        return this.status;
    }

    private void setStatus(Integer status) {
        this.status = status;
    }

    public String getMessage() {
        return this.message;
    }

    private void setMessage(String message) {
        this.message = message;
    }
}
```

#### RedisConfig <缓存键值对序列化>
```java
@Configuration
public class RedisConfig {

    @Autowired
    private RedisTemplate redisTemplate;

    @Bean
    public RedisTemplate redisTemplate() {
        //设置key序列化
        redisTemplate.setHashKeySerializer(RedisSerializer.string());
        redisTemplate.setKeySerializer(RedisSerializer.string());
        //设置value序列化
        redisTemplate.setValueSerializer(RedisSerializer.string());
        redisTemplate.setHashValueSerializer(RedisSerializer.string());
        return redisTemplate;
    }

}

```

#### CorsConfiguration <跨域配置>
```java
@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")//允许哪些域访问
                .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS")//允许哪些方法访问
                .allowCredentials(true)//是否允许携带cookie
                .maxAge(3600)//设置浏览器询问的有效期
                .allowedHeaders("*");//
    }
}

```

#### MD5Util <加密算法>
```java
public class MD5Util {

    /**
     * MD5加密字符串（32位大写）
     *
     * @param string 需要进行MD5加密的字符串
     * @return 加密后的字符串（大写）
     */
    public static String md5Encrypt32Upper(String string) {
        byte[] hash;
        try {
            //创建一个MD5算法对象，并获得MD5字节数组,16*8=128位
            hash = MessageDigest.getInstance("MD5").digest(string.getBytes("UTF-8"));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Huh, MD5 should be supported?", e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Huh, UTF-8 should be supported?", e);
        }

        //转换为十六进制字符串
        StringBuilder hex = new StringBuilder(hash.length * 2);
        for (byte b : hash) {
            if ((b & 0xFF) < 0x10) hex.append("0");
            hex.append(Integer.toHexString(b & 0xFF));
        }
        return hex.toString().toUpperCase();
    }

    /**
     * MD5加密字符串（32位小写）
     *
     * @param string 需要进行MD5加密的字符串
     * @return 加密后的字符串（小写）
     */
    public static String md5Encrypt32Lower(String string) {
        byte[] hash;
        try {
            //创建一个MD5算法对象，并获得MD5字节数组,16*8=128位
            hash = MessageDigest.getInstance("MD5").digest(string.getBytes("UTF-8"));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Huh, MD5 should be supported?", e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Huh, UTF-8 should be supported?", e);
        }

        //转换为十六进制字符串
        StringBuilder hex = new StringBuilder(hash.length * 2);
        for (byte b : hash) {
            if ((b & 0xFF) < 0x10) hex.append("0");
            hex.append(Integer.toHexString(b & 0xFF));
        }
        return hex.toString().toLowerCase();
    }

    /**
     * 将二进制字节数组转换为十六进制字符串
     *
     * @param bytes 二进制字节数组
     * @return 十六进制字符串
     */
    public static String bytesToHex(byte[] bytes) {
        StringBuffer hexStr = new StringBuffer();
        int num;
        for (int i = 0; i < bytes.length; i++) {
            num = bytes[i];
            if (num < 0) {
                num += 256;
            }
            if (num < 16) {
                hexStr.append("0");
            }
            hexStr.append(Integer.toHexString(num));
        }
        return hexStr.toString().toUpperCase();
    }

    /**
     * Unicode中文编码转换成字符串
     */
    public static String unicodeToString(String str) {
        Pattern pattern = Pattern.compile("(\\\\u(\\p{XDigit}{4}))");
        Matcher matcher = pattern.matcher(str);
        char ch;
        while (matcher.find()) {
            ch = (char) Integer.parseInt(matcher.group(2), 16);
            str = str.replace(matcher.group(1), ch + "");
        }
        return str;
    }


    private static final String hexDigIts[] = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"};

    /**
     * MD5加密
     *
     * @param origin      字符
     * @param charsetname 编码
     * @return
     */
    public static String MD5Encode(String origin, String charsetname) {
        String resultString = null;
        try {
            resultString = new String(origin);
            MessageDigest md = MessageDigest.getInstance("MD5");
            if (null == charsetname || "".equals(charsetname)) {
                resultString = byteArrayToHexString(md.digest(resultString.getBytes()));
            } else {
                resultString = byteArrayToHexString(md.digest(resultString.getBytes(charsetname)));
            }
        } catch (Exception e) {
        }
        return resultString;
    }


    public static String byteArrayToHexString(byte b[]) {
        StringBuffer resultSb = new StringBuffer();
        for (int i = 0; i < b.length; i++) {
            resultSb.append(byteToHexString(b[i]));
        }
        return resultSb.toString();
    }

    public static String byteToHexString(byte b) {
        int n = b;
        if (n < 0) {
            n += 256;
        }
        int d1 = n / 16;
        int d2 = n % 16;
        return hexDigIts[d1] + hexDigIts[d2];

    }


    public static void main(String[] args) {
        String s = MD5Util.md5Encrypt32Upper("Song1014.");
        System.out.println(s);
    }
}
```

#### CodeUtil <验证码工具>
```java
@Component
public class CodeUtil {

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 生成验证码 并把邮箱作为key放入redis
     * @param email
     * @return
     */
    public String createCode(String email){
        StringBuilder codeBuilder = new StringBuilder();
        //两种类型
        int type = 2;
        Random random = new Random();
        for (int index = 0; index < 6 ; index ++){
            //生成1-3 的整数
              int r =  random.nextInt(2) + 1;

              switch (r){
                  case 1:
                      codeBuilder.append(random.nextInt(10));
                      continue;
                  case 2:
                      char c = (char) (random.nextInt(26) + 65);
                      codeBuilder.append(c);
              }
        }
        String code = codeBuilder.toString();
        return code;
    }

    /**
     * 判断验证码是否正确
     * @param email
     * @param code
     * @return
     */
    public boolean codeIsCorrect(String email , String code){
        Object codeObj = redisTemplate.opsForValue().get("EM_" + email);
        if ( null != codeObj){
            String codeStr =  (String) codeObj;
            if ( ! code.equals(codeStr)){
                return false;
            }
            return true;
        }else {
            return false;
        }
    }
}

```



