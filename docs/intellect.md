# 智趣大冲关

原创动力的小游戏“智趣大冲关”的原版拷贝及修改版本。

- 活动 ID：34
- 项目名称：`intellect`

## 原始版本

文件夹`www.22dm.com`内存储着游戏的原始版本。因为游戏有排行系统，需要直接向微信获取信息，所以必须在微信中打开才行。现在打开游戏会提示`Anmeldung bei Weixin nicht möglich - This Official Account does not have these "scope" permissions. Error code:10005`，无法正常游玩。

## 修改版本

文件夹`xyy-huijiwiki.github.io`内存储着游戏的修改版本。修改内容如下：

- 去除了所有微信和百度的内容，确保游戏能够独立运行。
- 因为无法跨域访问官方服务器，所以把排行榜数据内嵌至代码中。数据抓取时间为 2023 年 2 月 26 日。
- 游戏得分也不会上传至服务器。

2025 年 8 月 11 日更新：在 AI 的帮助下，模拟了多人对战模式。“对手”的算法如下：

- 有一个表示难度的`level`参数，取值为 0 到 1 直接的小数，默认为 0.7（点开下面的修改版游戏链接，找到网址中的`level=0.7`，可以修改这个值来调整难度）。
- “对手”每题的答题时间符合正态分布，平均值为 5 秒（根据难度上下浮动 1 秒），标准差为 2 秒。答题时间最低 0.5 秒。
- “对手”答题正确率为`level`，即难度越高，“对手”答题正确率越高。若“对手”的答题时间超过 10 秒，根据超时情况降低正确率。

## 链接

- [官方游戏链接](http://www.22dm.com/act/h5/intellect)
- [修改版游戏链接 1](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/intellect/index.html?level=0.7)（正常进入游戏）
- [修改版游戏链接 2](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/intellect/index.html?level=0.7&battle=1&timespan=1)（扫描对战二维码进入游戏）
- [羊羊百科](https://xyy.huijiwiki.com/wiki/智趣大冲关)
