---
title: Java操作窗体
categories: java
cover: 'https://www.toopic.cn/public/uploads/small/1658046580831165804658018.jpg'
description: Java操作窗体
abbrlink: 81932
date: 2023-10-08 11:30:00
updated: 2023-10-08 11:30:00
---

### 前言
> 笔者上班略显枯燥，想闲暇时间搬个砖(ps:DNF) 但DNF窗体太大了。
> 笔者灵机一动，决定操作窗体大小，在不影响游戏内存的情况下实现上班搬砖。
> 另外支持了老板键隐藏 {% kbd CTRL %} **+** {% kbd X %}
> 嘿嘿🤭嘿...直接上代码。

#### 依赖
```xml
      <dependency>
            <groupId>net.java.dev.jna</groupId>
            <artifactId>jna</artifactId>
            <version>5.9.0</version>
        </dependency>


        <dependency>
            <groupId>net.java.dev.jna</groupId>
            <artifactId>jna-platform</artifactId>
            <version>5.9.0</version>
        </dependency>
```


#### 代码
```java
package cc.yybk;

import com.sun.jna.Native;
import com.sun.jna.platform.win32.User32;
import com.sun.jna.platform.win32.WinDef;
import com.sun.jna.platform.win32.WinDef.HWND;
import com.sun.jna.platform.win32.WinDef.RECT;
import com.sun.jna.platform.win32.WinUser;

import java.util.Scanner;
import java.util.logging.Logger;

public class WindowManipulator {

    public static void main(String[] args) {
        while (true) {
            System.out.println("INFO -- 请输入窗口标题");
            Scanner scanner = new Scanner(System.in);
            if (scanner.hasNext()) {
                final User32 user32 = User32.INSTANCE;
                String windowTitle = scanner.next(); // 设置需要获取窗口句柄的应用程序窗口标题
                HWND hwnd = user32.FindWindow(null, windowTitle);
                if (hwnd != null) {
                    // 获取窗口大小
                    RECT rect = new RECT();
                    user32.GetWindowRect(hwnd, rect);
                    int width = rect.right - rect.left;
                    int height = rect.bottom - rect.top;
                    System.out.println("INFO -- 该窗口原来的大小为:{" + width + "X" + height + "}");
                    Integer newWidth = 0;
                    Integer newHeight = 0;
                    // 修改窗口大小
                    //宽度交互
                    do {
                        System.out.println("INFO -- 输入你想修改的宽度（只支持整数）");
                        Scanner sw = new Scanner(System.in);
                        if (sw.hasNext()) {
                            newWidth = sw.nextInt();
                            break;
                        } else {
                            System.out.println("WARN -- 输入合法的宽度，不要违规操作，重新输入 = =、");
                        }
                    } while (true);
                    //高度交互
                    do {
                        System.out.println("INFO -- 输入你想修改的高度（只支持整数）");
                        Scanner sh = new Scanner(System.in);
                        if (sh.hasNext()) {
                            newHeight = sh.nextInt();
                            break;
                        } else {
                            System.out.println("WARN -- 输入合法的高度，不要违规操作，重新输入 = =、");
                        }
                    } while (true);
                    user32.MoveWindow(hwnd, rect.left, rect.top, newWidth, newHeight, true);
                    System.out.println("INFO -- 成功修改窗口！");
                    System.out.println("INFO -- 请勿关闭本程序！否则会失效！");
                    //开一个线程监听老板键
                    Thread thread = new Thread(() -> {
                        final int VK_X = 0x58;
                        final int MOD_CONTROL = 0x0002;
                        boolean isShow = true; //是否显示窗口
                        boolean result = user32.RegisterHotKey(null, 1, MOD_CONTROL, VK_X);
                        if (!result) {
                            System.out.println("ERROR -- 热键注册失败！可能存在冲突");
                            return;
                        }
                        WinUser.MSG msg = new WinUser.MSG();
                        try {
                            while (user32.GetMessage(msg,null,0,0) != 0){
                                if (msg.message == User32.WM_HOTKEY){
                                    int wmId = msg.wParam.intValue();
                                    if (wmId == 1){
                                        if (isShow){
                                            user32.ShowWindow(user32.FindWindow(null,windowTitle),User32.SW_HIDE);
                                            isShow = false;
                                            System.out.println("窗口已隐藏");
                                        }else {
                                            user32.ShowWindow(user32.FindWindow(null,windowTitle),User32.SW_SHOW);
                                            isShow = true;
                                            System.out.println("呼出窗口");
                                        }
                                    }
                                }
                            }
                        }catch (Exception e){
                            e.printStackTrace();
                        }finally {
                            // 注销热键
                            User32.INSTANCE.UnregisterHotKey(null, 1);
                        }
                    });
                    thread.start();
                    listenHwnd(windowTitle, newHeight, newWidth, hwnd);//开启监听
                    break;
                } else {
                    System.out.println("ERROR -- 找不到指定的窗口,尝试打开任务管理器查看应用名称或使用其他查找窗体句柄工具。");
                }
            } else {
                System.out.println("ERROR -- 请有效输入窗口标题");
            }
        }
    }

    //监听句柄变化 修改窗体大小
    public static void listenHwnd(String windowTitle, final Integer finalHeight, final Integer finalWidth,  HWND changeHwnd) {
        User32 user32 = User32.INSTANCE;
        while (true) {
            HWND hwnd = User32.INSTANCE.FindWindow(null, windowTitle);
            // 判断原始句柄是否存在
            if (hwnd.equals(changeHwnd) ) {
                // 窗口存在
                RECT rect = new RECT();
                User32.INSTANCE.GetWindowRect(changeHwnd, rect);
                int width = rect.right - rect.left;
                int height = rect.bottom - rect.top;
                if (width != finalWidth || height != finalHeight) {
                    User32.INSTANCE.MoveWindow(changeHwnd, rect.left, rect.top, finalWidth, finalHeight, true);
                }
            } else {
                // 获取窗口大小
                RECT rect = new RECT();
                User32.INSTANCE.GetWindowRect(hwnd, rect);
                System.out.println(changeHwnd);
                System.out.println("WARN -- 句柄发生变化，新句柄为: " + hwnd + " - 重新定义窗口大小");
                User32.INSTANCE.MoveWindow(hwnd, rect.left, rect.top, finalWidth, finalHeight, true);
                changeHwnd = hwnd;
            }
            try {
                // 等待一段时间后再次查询
                Thread.sleep(200);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

```