# 智趣抢零食
原创动力的小游戏“智趣抢零食”的原版拷贝及修改版本。
- 活动ID：21
- 项目名称：`eat`

## 原始版本
文件夹`www.22dm.com`内存储着游戏的原始版本。因为游戏有排行系统，需要直接向微信获取信息，所以必须在微信中打开才行。现在打开游戏会提示`Anmeldung bei Weixin nicht möglich - This Official Account does not have these "scope" permissions. Error code:10005`，无法正常游玩。

## 修改版本
文件夹`xyy-huijiwiki.github.io`内存储着游戏的修改版本。修改内容如下：
- 去除了所有微信和百度的内容，确保游戏能够独立运行。
- 现在已经无法获取到实际排行榜了，所以我自己杜撰了一个排行榜。另外，玩家得分情况会且只会上传至服务器，刷新页面（重新向服务器获取排行榜）后才会更新排行榜，而修改版的游戏不与服务器连接（连接了也没有，现在排行榜返回空值），所以自己的分数永远不会出现在排行榜中（况且我也获取不到你的微信昵称和头像）。
- 领奖时不会真的向服务器发送消息。
- 制作了三个版本，分别对应**活动时间是否结束**和**是否获奖**。

## 链接
- [官方游戏链接](http://www.22dm.com/act/h5/eat)
- [修改版游戏链接1](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/eat/index.html)（活动未结束）
- [修改版游戏链接2](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/eat/index2.html)（活动已结束、未获奖）
- [修改版游戏链接3](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/eat/index3.html)（活动已结束、获奖）
- [羊羊百科](https://xyy.huijiwiki.com/wiki/智趣抢零食)

## 秘密
**智趣抢零食**的HTML文件中引用了一个叫做`cocos2d-x.js`的文件，但是22dm网站上无法下载该文件。我第一反应就是去网上下载这个包。虽然不知道具体版本，不过可以把几个主流版本都试一试，毕竟是个挺知名的游戏引擎，差几个小版本应该也能兼容的。可是试了很久，一直报错，没有头绪（因为我没有自己用过这个引擎）。后来把文件删了（22dm官网实际上也没这个文件，所以其实此时与官网情况一致了），游戏居然正常运行了！我真无语，原来根本就没有使用cocos引擎，控制台报错`找不到文件`才能正常游戏。