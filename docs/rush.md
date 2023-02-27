# 探险父子兵（rush）
原创动力的小游戏“探险父子兵”的原版拷贝及修改版本。
- 活动ID：56
- 项目名称：`rush`

## 原始版本
文件夹`act.22dm.com`内存储着游戏的原始版本。因为游戏有排行系统，需要直接向微信获取信息，所以必须在微信中打开才行。现在打开游戏会提示`Anmeldung bei Weixin nicht möglich - This Official Account does not have these "scope" permissions. Error code:10005`，无法正常游玩。

## 修改版本
文件夹`xyy-huijiwiki.github.io`内存储着游戏的修改版本。修改内容如下：
- 去除了所有微信相关的代码，确保游戏能够独立运行。
- 排行榜内嵌至游戏代码中——反正活动结束后排行榜就固定了，没必要总是向服务器发送请求。
- 游戏的排行榜部分似乎有bug，无法滑动查看全部排名。实际测试发现，无论单独设置x轴滑动还是y轴滑动都有概率出bug，可能是游戏横屏状态下，浏览器对x轴和y轴方向的判断出了问题。修改版中x轴和y轴都设置了滑动，修复了这个bug。
- 制作了两个版本，分别对应**活动时间**结束前后。

## 链接
- [官方游戏链接](http://act.22dm.com/act/h5/rush)
- [修改版游戏链接1](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/rush/index.html)（活动未结束）
- [修改版游戏链接2](https://xyy-huijiwiki.github.io/22dm-act/xyy-huijiwiki.github.io/act/h5/rush/index2.html)（活动已结束）
- [羊羊百科](https://xyy.huijiwiki.com/wiki/探险父子兵)

## 秘密
游戏的领奖界面无法正常打开，经过仔细排查，确认是官方已经删除了相关代码。我实在想不通为什么要删除这部分代码，毕竟其他小游戏的领奖界面都是正常的。删除这些代码虽然花不了多少时间，但也没有任何明显的益处。