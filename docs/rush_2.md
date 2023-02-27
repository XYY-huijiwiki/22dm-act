# 探险奇猫国
原创动力的小游戏“探险奇猫国”的原版拷贝及修改版本。
- 活动ID：22
- 项目名称：`rush_2`

## 原始版本
文件夹`act.22dm.com`内存储着游戏的原始版本。因为游戏有排行系统，需要直接向微信获取信息，所以必须在微信中打开才行。

## 修改版本
文件夹`xyy-huijiwiki.github.io`内存储着游戏的修改版本。修改内容如下：
- 去除了所有微信相关的代码，确保游戏能够独立运行。
- 排行榜内嵌至游戏代码中——反正活动结束后排行榜就固定了，没必要总是向服务器发送请求。
- 游戏的排行榜部分似乎有bug，无法滑动查看全部排名。实际测试发现，无论单独设置x轴滑动还是y轴滑动都有概率出bug，可能是游戏横屏状态下，浏览器对x轴和y轴方向的判断出了问题。修改版中x轴和y轴都设置了滑动，修复了这个bug。
- 领奖时不会真的向服务器发送消息。
- 制作了三个版本，分别对应**活动时间是否结束**和**是否获奖**。

## 链接
- [官方游戏链接](http://act.22dm.com/act/h5/rush_2)
- [修改版游戏链接1](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/rush_2/index.html)（活动未结束）
- [修改版游戏链接2](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/rush_2/index2.html)（活动已结束、未获奖）
- [修改版游戏链接3](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/rush_2/index3.html)（活动已结束、获奖）
- [羊羊百科](https://xyy.huijiwiki.com/wiki/探险奇猫国)

## 秘密
本来想着从前往后一个个修改小游戏，结果在[嫁人就嫁灰太狼](https://github.com/XYY-huijiwiki/love)的修改中碰壁了，于是策略转变，从后往前修改。最后一个小游戏是[《喜羊羊与灰太狼》十五周年](https://github.com/XYY-huijiwiki/15th)，游戏性基本没有，可以视作一个视频。倒数第二个游戏就是**探险奇猫国**了，可以看到游戏的丰富程度和代码的规范程度都高了不少，不过在领奖部分还是看到了异常熟悉的代码，把修改[冲出海洋](https://github.com/XYY-huijiwiki/deep)时杜撰的排行榜直接拿过来用居然一点bug也没有，哈哈~
