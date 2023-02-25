# 知“图”猜“名”
原创动力的小游戏“知‘图’猜‘名’”的原版拷贝及修改版本。
- 活动ID：19
- 项目名称：`guess`

## 原始版本
文件夹`www.22dm.com`内存储着游戏的原始版本。因为游戏有排行系统，需要直接向微信获取信息，所以必须在微信中打开才行。现在打开游戏会提示`Anmeldung bei Weixin nicht möglich - This Official Account does not have these "scope" permissions. Error code:10005`，无法正常游玩。

## 修改版本
文件夹`xyy-huijiwiki.github.io`内存储着游戏的修改版本。修改内容如下：
- 去除了所有微信和百度的内容，确保游戏能够独立运行。
- 现在已经无法获取到实际排行榜了，所以我自己杜撰了一个排行榜。另外，玩家得分情况会且只会上传至服务器，刷新页面（重新向服务器获取排行榜）后才会更新排行榜，而修改版的游戏不与服务器连接（连接了也没有，现在排行榜返回空值），所以自己的分数永远不会出现在排行榜中（况且我也获取不到你的微信昵称和头像）。
- 领奖时不会真的向服务器发送消息。
- 制作了三个版本，分别对应**活动时间是否结束**和**是否获奖**。

## 链接
请在手机上游玩，或者按F12在开发者工具中调整为竖屏或模拟手机。按F12切换开发者模式会导致游戏出bug，刷新一次即可。
- [官方游戏链接](http://www.22dm.com/act/h5/guess)
- [修改版游戏链接1](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/guess/index.html)（活动未结束）
- [修改版游戏链接2](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/guess/index2.html)（活动未结束、未获奖）
- [修改版游戏链接3](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/guess/index3.html)（活动已结束、获奖）
- [羊羊百科](https://xyy.huijiwiki.com/wiki/知“图”猜“名”)