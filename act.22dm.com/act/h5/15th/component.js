var friends = {
  uid: 1,
  comeMessage: false,
  wall: {
    bg: "res/Public/friends/wall.jpg",
    face: "res/Public/face/b_1.png",
    name: "最爱羊角包",
  },
  topic: [{
    face: "res/Public/face/b_1.png",
    name: "最爱羊角包",
    title: "晒一晒我满满的童年！<br/>新电影，赶紧安排！",
    img: "res/Public/friends/topic_1.png",
    time: "1分钟前",
    like: [2, 4, 5, 3, 6, 7],
    comm: [{ u: "灰太狼：", c: "啊!我还有几部没看呢~" }, { u: "包包大人：", c: "再刷亿遍走起！" }, { u: "泰哥：", c: "哈哈哈！我也有同款票根！" }]
  },
  {
    face: "res/Public/face/b_2.png",
    name: "可可爱爱的村长",
    title: "我衣服终于到货了！",
    img: "res/Public/friends/topic_2.png",
    time: "18分钟前",
    like: [4, 5, 6, 2],
    comm: [{ u: "包包大人：", c: "好好看哟" }, { u: "小红红：", c: "发链接" }, { u: "最爱羊角包：", c: "哈哈！我要同款" }],
    cb: true
  }]
};
var chatbox = {
  room: "青青草原我最帅(9)",
  msg: [
    { uid: 5, content: "羊羊CICF漫展开摊啦！好热闹！！" },
    { uid: 3, img: "res/Public/icon/1.gif" },
    { uid: 6, content: "在路上了！！为灰太狼打CALL~" },
    { uid: 1, content: "快来看，发现宝藏！！" },
    { uid: 1, img: "res/Public/chat/map.png", hand: true },
    { uid: 4, content: "哈哈哈哈，官方整活，果然魔性！" },
    { uid: 2, content: "这还是我认识的懒羊羊吗？" }
  ]
}
var danmu = [
  ['高能预警！！', '祖晴老师66666!', '半个青青草原都在了', '配音演员是个神奇的职业', '谢谢喜羊羊给我的童年', '永远喜欢你，喜羊羊！', '太厉害了！张琳老师', '美暖居然是同一个老师配的？！！'],
  ['声优都是宝藏', '沸羊羊你的配音是女孩子诶~', '辛苦了，老师们!', '哈哈哈李团老师一人拔河!', '大型精分现场', '谢谢喜羊羊给我的童年', '好带感高全胜老师'],
  ['高能预警！！', '哈哈哈哈哈哈哈哈哈', '童年回忆', '狼王好！！!', '666666 震惊', '懒羊羊梁颖老师也很可！！', '是刘红韵姐姐！！!']]
Vue.component('friends-wall', {
  props: ['wallBg', 'wallFace', 'wallName'],
  template: `
  <div id="friends_wall">
    <img id="wall_background" :src="wallBg" width="640" />
    <img id="wall_face" :src="wallFace" width="120" />
    <span id="wall_name">{{wallName}}</span>
  </div>
  `
})
Vue.component('friends-topic', {
  props: ['uId', 'item', 'tIndex'],
  methods: {
    getLikeState: function (rows) {
      return this.item.like.indexOf(this.uId) == -1 ? "赞" : "取消";
    },
    onCtorLike: function () {
      if (this.item.like.indexOf(this.uId) == -1) {
        this.item.like.push(this.uId);
      }
      else {
        this.item.like = this.item.like.slice(0, -1);
      }
    },
    onClikImg: function () {
      if (this.item.cb) {
        vm.active = "";
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_BUS));
      }
    }
  },
  template: `
  <div class="friends_topic">
    <div class="topic_face topic_rows" :class="item.title.indexOf('<br/>')==-1?'rows1' : 'rows2'">
      <img class="face_img" :src="''+item.face" width="85" />
      <a class="face_name">{{item.name}}</a>
      <a class="face_title" v-html="item.title"></a>
    </div>
    <div class="topic_img topic_rows" @click="onClikImg()">
      <img :src="item.img"/>
      <img v-show="tIndex==1" src="res/Public/icon/hand.png" class="hand_shirts">
    </div>
    <div class="topic_ctor topic_rows">
      <a class="ctor_time">{{item.time}}</a>
      <div class="ctor_main">
        <div class="ctor_column" @click="onCtorLike()">
          <img v-show="getLikeState()=='赞' &&tIndex==0" src="res/Public/icon/hand.png" class="hand_like">
          <img :src="'res/Public/icon/icon_like_'+(getLikeState()=='赞'?'0':'1')+'.png'" width="30" />
          <a>{{getLikeState()}}</a>
        </div>
        <div class="ctor_column" >
          <img src="res/Public/icon/icon_comm.png" width="30" />
          <a>评论</a>
        </div>
      </div>
    </div>
    <div class="topic_like topic_rows">
      <a class="like_icon"><img src="res/Public/icon/icon_like_0.png" width="40" /></a>
      <div class="like_face">
        <img v-for="item in item.like" :src="'res/Public/face/like_'+item+'.png'" width="52" />
      </div>
    </div>
    <div class="topic_comm topic_rows">
      <ul>
        <li v-for="(comm,index) in item.comm">
          <span class="comm_name">{{comm.u}}</span>{{comm.c}}
        </li>
      </ul>
    </div>
  </div>
  `
})
