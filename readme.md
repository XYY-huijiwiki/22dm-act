# 原创动力活动存档
原创动力的活动网站的原始存档及其修改版本。修改目的在于使网站能够脱离微信和服务器环境使用，这样即使微信授权过期、服务器不复存在，人们依然可以看看这些网站是长什么样子的。

## 有爱成双（bus）
原创动力的活动网站“有爱成双”的原版拷贝及修改版本。

### 原始版本
文件夹`www.22dm.com`内存储着活动网站的原始版本。活动网站在微信中打开。现在打开活动网站会报错：`Anmeldung bei Weixin nicht möglich - This Official Account does not have these "scope" permissions. Error code:10005`。

### 修改版本
文件夹`xyy-huijiwiki.github.io`内存储着活动的修改版本。修改内容如下：
- 去除了所有微信和百度相关的代码，确保活动网站能正常打开。
- 领奖时不会真的向服务器发送消息。
- 制作了两个版本，分别对应是否获奖的两种情况。
- 排行榜内嵌至活动代码中——反正活动结束后排行榜就固定了，没必要总是向服务器发送请求。
- 表白消息也嵌入了，因为无法跨域请求数据。其中删除了一条消息，因为报错了。
![](Screenshot%202023-02-23%20154822.jpg)

### 链接
- [官方活动链接](http://www.22dm.com/act/h5/bus)
- [修改版活动链接1](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/bus/index.html)（未获奖）
- [修改版活动链接2](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/bus/index2.html)（获奖）
- [羊羊百科](https://xyy.huijiwiki.com/wiki/有爱成双)


## “募”名而来（collect）
原创动力的活动网站“‘募’名而来”的原版拷贝及修改版本。

### 原始版本
文件夹`www.22dm.com`内存储着活动网站的原始版本。活动网站在微信中打开。现在打开活动网站会报错：`Anmeldung bei Weixin nicht möglich - This Official Account does not have these "scope" permissions. Error code:10005`。

### 修改版本
文件夹`xyy-huijiwiki.github.io`内存储着活动的修改版本。修改内容如下：
- 去除了所有微信和百度相关的代码，确保活动网站能正常打开。
- 领奖时不会真的向服务器发送消息。
- 制作了三个版本，分别对应各种获奖情况。
- 因为无法获知领奖成功后服务器会返回什么信息，根据修改[有爱成双](#有爱成双bus)的经验，我假设返回的信息为`信息提交成功!奖品于7个工作日内发出`。

### 链接
- [官方活动链接](http://www.22dm.com/act/h5/collect)
- [修改版活动链接1](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/collect/index.html)（未获奖）
- [修改版活动链接2](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/collect/index2.html)（获一二三等奖）
- [修改版活动链接3](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/collect/index3.html)（获参与奖）
- [羊羊百科](https://xyy.huijiwiki.com/wiki/“募”名而来)

### 秘密
活动结束后html和js文件的代码就被修改了，只显示活动结束后的页面。好消息是，css文件没被修改；更好的消息是，图片地址就是写在css文件里的；极好的消息是，图片一张也没被删除。你可以[点击这里](./www.22dm.com/act/h5/collect/images/)查看全部相关图片，或者打开修改版活动链接后，按F12在浏览器控制台中输入`$("#collect").fadeIn()`查看这个页面。点击提交按钮会报错——对此我无能为力，因为相关代码已经被删得一干二净。