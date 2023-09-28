---
title: cocos游戏引擎Ts的基本操作
categories: cocos
cover: 'https://pic2.zhimg.com/v2-fca420275f9f66a514004c2d5565b605_r.jpg'
description: cocos游戏引擎Ts的基本操作
abbrlink: 30063
date: 2023-09-21 11:30:00
updated: 2023-09-22 11:30:00
---

### 前言
> 这篇文档的所有内容全部基于 `cocos 2.4.0` 版本
> cocos版本更新差异很大...笔者刚接触用的3.7 后来改用2.4开发2D游戏   太TM操蛋了
> 本文介绍了 TypeScript 利用 `cocos 2.4.0` API 获取组件的一些基本操作
> 点这个网站进入 [cocos 2.4.0 官方文档](https://docs.cocos.com/creator/2.4/api/zh/)


### 代码正文
#### API获取当前节点
```Text
1.当前节点   this.node: cc.Node
2.父节点     this.node.parent
3.子节点     this.node.children: cc.Node[]
4.全局查找   target = cc.find("Canvas/佩奇/名字")
5.查找子节点  target = cc.find("xx/yy",someNode)    
```


#### API获取组件(如果已经拿到节点 那么节点的组件也可以拿出来)
- 获取组件
```TypeScript
let label = node.getComponent(cc.Label);
```

- 获取自定义类型的组件(脚本组件也是可以访问的)
```TypeScript
  let script = node.getComponent("YourScript");
  script.run(); 
```

#### 音频
- 音频属性的定义
```TypeScript
//开门声
@property(cc.AudioClip)
audio: cc.AudioClip = null;  //cc.AudioClip就是cocos中的一个音频的类型组件
```

- 音频的播放
```TypeScript
if(this.audio != null){
    cc.audioEngine.play(this.audio,false,1);
}
```


#### 坐标系
- 坐标用`Vec2`或者`vec3`标识(Vector,向量) **俩种办法创建坐标对象**
- Vec2：二维坐标(x,y)
```TypeScript
pos = new cc.Vec2(100,100);
pos = cc.v2(100,100);
```
- Vec3: 三维坐标(x,y,z)
```TypeScript
pos = new cc.Vec3(100,100,0);
pos = cc.v3(100,100,0);
```
- 取出坐标
```TypeScript
let pos: cc.Vec2 = node.getPosition();//不过返回的v3向量  但方法定义的确实v2向量 有点小bug这里不影响
```
- 设置坐标
```TypeScript
node.setPosition(cc.v2(150,-200));
```
- 设置节点的缩放
```TypeScript
node.setScale(cc.v3(1,1,0)); //目标是2D游戏 z轴方向设置为0即可  以1为基准进行缩小或放大
```


#### 缓动系统(平滑移动)
- to方法 最终到达位置
```TypeScript
cc.tween(node)
  .to(1,{position: cc.v3(150,-200,0)})
  .start(); //1 是动画时长
```
- by方法 不断变换位置
```TypeScript
cc.tween(node)
  .by(1,{position: cc.v3(150,-200,0)})
  .by(1,{position: cc.v3(150,200,0)})
  .by(1,{position: cc.v3(150,-200,0)})
  .by(1,{position: cc.v3(150,200,0)})
  .start(); 
```
- easing方法 变速
> 变化参数
> - quadIn 平方曲线缓入
> - quadOut 平方曲线缓出
> - quadInOut 平方曲线缓入缓出
> - cubicIn 立方曲线缓入
> - cubicOut 立方曲线缓出
> - cubicInOut 立方曲线缓入缓出
```TypeScript
//duration 动作时间
//props 目标状态
//easing 速度变化
cc.tween(node)
  .to(duration,props,easing);

//例如 quadOut 渐渐变慢
cc.tween(node)
  .by(1,{position: cc.v3(0,300,0)},{easing: 'quadOut'})
  .start();
```

#### 动画(比缓动高级)
- 这个update方法 每秒钟调用60次 60次/1s 而60次说的就是帧率 60帧

```TypeScript
update(dt){
    cc.log("update() is called,time = " + new Date().getTime());
}
```

#### 定时器
```TypeScript
cc.schedule(this.onTimer,0.3); //用onTimer方法做回调


onTimer(){
    if(this.count >= 3){
        this.unchedule(this.onTimer); //满足某个条件后停止计时器
    }
}
```

#### 资源加载
- 静态加载
> 由**游戏引擎**直接加载的方式就是静态加载
- 动态加载
> 在代码里加载就是动态加载
> 以下方法原型为: cc.resources.load( path, type, onComplete) onComplete是回调方法
> 待加载的资源必须放在 resources目录下   `img/天使站立`  指的是  `/assets/resources/img/天使站立`
> `不要带后缀名` 值得一提的是 这里的path路径 可以给一个数组实现资源多加载 如果你这么做 回调方法中assets将会是一个数组
```TypeScript
let self = this; //先把this 拿出来 因为回调方法找不到this这个对象 闭包
cc.resources.load("img/天使站立",cc.SpriteFrame,function(err,assets){
    if(null == err){
     self.node.getComponent(cc.Sprite).spriteFrame = <cc.SpriteFrame> assets;  //这里err 是错误原因,assets 是加载进来的资源对象 这里的<cc.SpriteFrame> 指的是类型转换
    }else{
        cc.log('图片加载失败,错误原因--> ' + err);
    }
})

//另外一种加载方式  直接挂载整个目录
cc.resources.loadDir("img",cc.SpriteFrame,function(err,assets)){
     if(null == err){
     self.node.getComponent(cc.Sprite).spriteFrame = <cc.SpriteFrame> assets[0];  //这里回调进来的是一个数组  
    }else{
        cc.log('图片加载失败,错误原因--> ' + err);
    }
}
```

#### 鼠标事件及触摸事件
{% folding cyan,鼠标事件 %}
> - mousedown
> > cc.Node.EventType.MOUSE_DOWN
> > 当鼠标在目标节点区域时按下触发
> - mouseenter
> > cc.Node.EventType.MOUSE_ENTER
> > 当鼠标移入目标节点区域时候触发,不论是否按下
> - mousemove
> > cc.Node.EventType.MOUSE_MOVE
> > 当鼠标在目标节点区域中移动时触发,不论是否按下
> - mouseleave
> > cc.Node.EventType.MOUSE_LEAVE 
> > 当鼠标移出目标节点区域时触发,不论是否按下
> - mouseup
> > cc.Node.EventType.MOUSE_UP
> > 当鼠标从按下状态松开时触发
> - mousewheel
> > cc.Node.EventType.MOUSE_WHEEL
> > 当鼠标滚轮滚动时触发
{% endfolding %}

{% folding cyan,鼠标事件常用API (cc.EventEventMouse) %}
> - getScrolly
> > 获取滚轮滚动的Y轴距离 只有在滚动时才会生效
> - getLocation
> > 获取鼠标位置对象,对象包含x,y属性
> - getLocationX
> > 获取鼠标的X轴位置
> - getLocationY
> > 获取鼠标的Y轴位置
> - getPreviousLocation
> > 获取鼠标事件上次触发时的位置对象,对象包含x,y属性
> - getDelta 
> > 获取鼠标距离上一次事件移动的距离对象,对象包含x,y属性 
{% endfolding %}

{% folding cyan,触摸事件对象 %}
> - touchstart
> > cc.Node.EventType.TOUCH_START 
> - touchmove   
> > cc.Node.EventType.TOUCH_MOVE
> - touchend
> > cc.Node.EventType.TOUCH_END
> - touchcancel
> > cc.Node.EventType.TOUCH_CANCEL
{% endfolding %}

{% folding cyan,触摸事件常用API %}
> `注意:事件中的坐标位置(x,y)是世界坐标(全局坐标)`
> - touch 
> > 与当前事件关联的触点对象  类型是cc.Touch
> - getId
> > 获取触点的ID,用于多点触摸的逻辑判断  类型是Number
> - getLocation (常用)
> > 获取触点位置对象,对象包含x,y属性  类型是Object
> - getLocationX
> > 获取触点的X轴位置  类型是Number
> - getLocationY
> > 获取触点的y轴位置  类型是Number
> - getPreviousLocation
> > 获取触点上一次触发事件时的位置对象,对象包含x,y属性  类型是Object
> - getStartLocation
> > 获取触点初始时的位置对象,对象包含x,y属性  类型是Object
> - getDelta
> > 获取触点距离上一次事件移动的距离对象,对象包含x,y属性  类型是Object
{% endfolding %}

#### 事件冒泡
> 事件冒泡 就是当子节点发生例如`鼠标点击`事件后会传递到父节点的 `鼠标点击` 事件,这个就是事件冒泡
> `注意` 即使子节点在父节点的区域外 事件依旧会冒泡。
> 当然我们可以阻止冒泡发生
```TypeScript
e.stopPropagation();//在方法结尾写这行代码  标志此事件到此为止  不再上浮
```

#### 遮罩效果
> 利用冒泡阻止  在子节点中再加入子节点实现遮罩层
> 利用代码接收事件 并设置遮罩层不激活
```TypeScript
onTouch(e: cc.Event.EventTouch){
  this.node.active = false; //这个节点设置为不激活状态 即隐藏遮罩层
}
```
> 在手机端屏幕不一致的情况下 遮罩层可能会出现遮挡不全的问题
> 可以在遮罩节点添加一个组件 ui组件 -> Widget组件   上下左右边距全部设置为0即可 
> 在cocos编辑器中 指定遮罩节点的透明度Opacity属性 0 - 255 自行调节透明度
> `注意 遮罩层要在Canvas节点下一级  也就是Canvas必须是遮罩层的父节点 而不是爷节点` 这样设置边距才会自适应Canvas


#### 动态节点
> API代码动态加载节点
```TypeScript
let bullet: cc.Node = new cc.Node(); //创建节点
let sprite: cc.Sprite = bullet.addComponent(cc.Sprite); //创建组件
sprite.spriteFrame = this.bulletIcon; //组件属性定义
bullet.parent = this.node; // 挂载到父节点
```
> 让节点销毁
```TypeScript
  this.node.destroy();
```
> 挂载脚本组件
```TypeScript
import BulletScript from "./BulletScript"; //导入脚本
//---------------start----------------------
bullet.addComponent( BulletScript );
```
> 编写BulletScript脚本 使节点运动起来
```TypeScript
onLoad(){
  this.schedule(this.onTimer,0.016); //开一个定时器
}

start(){

}

onTimer(){
  if(this.node.y > 300){
    this.unschedule(this.onTimer); //停止定时器
    this.node.destroy();//销毁节点
    return; //结束方法
  }
  this.node.y += 10;
}
```

#### 爆炸效果
```TypeScript
beginExplode(){
  let sp: cc.Sprite = this.node.getComponent(cc.Sprite);
  sp.spriteFrame = this.explodeEffect;//显示爆炸图片  这里explodeEffect 在脚本运行时直接动态加载
  this.node.scale = 0.1; //缩放设置为0.1
  let that = this; //闭包
  cc.tween(this.node)
    .to(0.5,{scale: 0.5,opacity:0})
    .to(0.3,{opacity: 0})
    .call( function(){ that.afterExplode(); })
    .start();
}
```

#### 销毁节点
```TypeScript
afterExplode(){
  this.node.destroy();//爆炸后销毁节点
}

//销毁后回调方法 默认的
onDestroy(){
  cc.log('${this.node.name}被销毁');  
}
```

#### 碰撞检测
> `cocos`编辑器中 直接添加碰撞组件 box collider 矩形碰撞
> 回调函数
```TypeScript
onCollisionEnter(other,self)  //碰撞发生时触发
onCollisionStay(other,self) //碰撞持续时触发
onCollisionExit(other,self) //碰撞结束时触发
```
> `其中 other 表示碰撞到的另一个物体 ,self表示自己,他们都是cc.Collider类`
> 此外,要想让碰撞检测生效,还需要执行 `cc.director.getCollisionManager().enabled = true;` 让碰撞管理器启用
```TypeScript
start(){
  let cm = cc.director.getCollisionManager();
  cm.enabled = true;//开启碰撞管理  默认是关着 因为打开cpu会一直运算
  cm.enabledDebugDraw = true;//开启碰撞绘制边界线 用于调试时候可以清除的看清碰撞边界
  cn.enabledDrawBoundingBox = true; //只有在开启碰撞绘制边界线的时候 这行代码才会生效 用处不大 就是给当前碰撞体加了个边框 如若组件是透明的 可以使用这个更清晰的查看
}

onCollisionEnter(other: cc.Collider ,self: cc.Collider): void{ 
  cc.log("发生碰撞 ${other.tag} --- ${self.tag}");
}
```

#### 数据存储(本地)
> 本质其实就是 `localStorage`存储
> 可以使用cc封装的 也可以直接使用localStorage对象
```TypeScript
saveData(){
  cc.sys.localStorage.setItem(k,v); //保存数据   v 会自动转String 所以可以将数据转成JSON串 传入
}

start(){
  let data = cc.sys.localStorage.getItem(k); //获取数据
  cc.log(data);
}

removeData(){
  cc.sys.localStorage.removeItem(k);//删除数据
  cc.sys.localStorage.clear();//全部清除
}
```
> 面向对象存储(JSON)
```TypeScript
let data: data = new Data(); //创建一个对象
let jsonStr: string = JSON.stringify(data); //转换为JSON字符串
let jsonObj: Object = Object.assign(new Data(),JSON.parse(jsonStr)); //解析JSON字符串并转为Data对象 assign就是拼装的意思
```

#### 对象类
```TypeScript
export class Data{
  name: string;
  level: number;
  hp: number;
  mp: number;
  
  //constructor 是指类的构造方法  参数中携带? 代表可传可不传  TS中特殊写法 JS会报错   | 代表不确定类型 可传多种类型使用这个符号连接
  constructor(name?: string, level?: number|string, hp?: number, mp?: number){
    name ? this.name = name : null;
    level ? this.level = level : null;
    hp ? this.hp = hp : null;
    mp ? this.mp = mp : null;
  }

  //重写toString()
  toString(): string {
   return '[name = ${this.name},level = ${this.level}, hp = ${this.hp},mp = ${this.mp}]';
  }
}
```

#### Socket通信
> cocos自身是不支持Socket的 但我们使用原生态H5自带的WebSocket对象 `如果熟悉node.js 可以尝试使用socket.io库`
```TypeScript
let socket = new WebSocket("ws://192.168.10.196:1014"); //指定协议为 ws 即WebSocket缩写 后面跟IP 端口
```
> 给socket对象添加监听事件
> - open 客户端和服务端完成握手协议 开启通信
> - message 客户端接收到来自服务端的消息时
> - error 当连接发生错误时
> - close 当服务器断开和客户端的连接时

#### 场景切换
> 场景切换有俩种方法:
- 直接加载一个新场景
```TypeScript
cc.director.loadScene(sceneName: string,onLaunched?: function); //onLaunched回调函数 基本没用 但如果你需要保存当前场景的某些东西 就使用这个回调函数
```
- 预加载场景 适用于场景比较大时候 无中间延迟
```TypeScript
cc.director.preLoadScene(sceneName: string,onPrograss: function,onLoaded: function);
//其中 onProgarss 是加载进度发生改变的回调函数 可以有三个参数
// completedCount: number 已加载的资源个数
// totalCount: number 场景总资源个数
// item: any流出加载管道的最新项目

//onLoaded是加载完成后的回调函数,可以有一个参数:
// error 加载错误信息
```
> 常驻节点 比如开始界面 (不销毁这个场景) 经常用于数据传递
```TypeScript
cc.game.addPresistRootNode(node);//添加常驻节点
cc.game.removePresistRootNode(node);//删除常驻节点  这个不是直接删除节点了 而是取消了该节点的常驻属性 在下一个场景下 该节点就会自动销毁
```

#### 结尾
> 如果你有java类似的基础,你会很好上手这篇文章。
> TMD
