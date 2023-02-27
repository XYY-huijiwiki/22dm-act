function onInitPage(userInfo, callback) {
  var webdata = decodeURIComponent(getQueryString("webdata"));
  if (webdata != "null") {
    let unionid = getQueryString2(webdata, "unionid");
    let name = getQueryString2(webdata, "name");
    let face = getQueryString2(webdata, "face");
    if (unionid && name && face) {
      userInfo.unionid = unionid;
      userInfo.name = name;
      userInfo.face = face;
      userInfo.from = "miniprogram";
      callback(1);
    }
    else {
      alert("获取用户信息失败，请重新返回小程序入口登陆。");
    }
  }
  else {
    userInfo.from = "wx";
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      callback(0);
    }
    else if (getQueryString("debug") != null) {
      callback(true);
    }
    else {
      callback(-1);
    }
  }
}
function doUserLogin(userInfo, callback) {
  // $.ajax({
  //   cache: false,
  //   async: false,
  //   type: "POST",
  //   url: '/act/getWxSns.ashx',
  //   data: {
  //     "type": "oauth2",
  //     "url": 'https://api.weixin.qq.com/sns/oauth2/access_token?code=' + getQueryString("code") + '&grant_type=authorization_code'
  //   },
  //   success: function (response) {
  //     var result = JSON.parse(response);
  //     var token = result.access_token;
  //     var openid = result.openid;
  //     if (typeof (openid) == "undefined") {
  //       location.href = weixinData.loginUrl;
  //     }
  //     else {
  //       $.ajax({
  //         cache: false,
  //         async: false,
  //         type: "POST",
  //         url: '/act/getWxSns.ashx',
  //         data: {
  //           "type": "userinfo",
  //           "url": 'https://api.weixin.qq.com/sns/userinfo?access_token=' + token + '&openid=' + openid + '&lang=zh_CN',
  //         },
  //         success: function (res) {
  //           var r = JSON.parse(res);
  //           userInfo.unionid = r.unionid;
  //           userInfo.name = r.nickname;
  //           userInfo.face = r.headimgurl != "" ? r.headimgurl : weixinData.shareImg;
  //           userInfo.from = "wx";
  //           callback() || null;
  //         }
  //       });
  //     }
  //   }
  // });

  userInfo.unionid = 'userInfo.unionid';
  userInfo.name = 'userInfo.name';
  userInfo.face = './user/Karsten.jpg';
  userInfo.from = "wx";
  callback();

}
function initWxJsSdk(jsApiList, callback) {
  // $.ajax({
  //   cache: false,
  //   async: false,
  //   type: "POST",
  //   url: '/act/getWeiXinToken.ashx',
  //   data: {
  //     thisUrl: location.href.split('#')[0]
  //   },
  //   success: function success(res) {
  //     let wxData = JSON.parse(res);
  //     wx.config({
  //       debug: false,
  //       appId: wxData.appId,
  //       timestamp: wxData.timestamp,
  //       nonceStr: wxData.nonceStr,
  //       signature: wxData.signature,
  //       jsApiList: jsApiList
  //     });
  //   }
  // });
  wx.config({
    debug: true,
    appId: 'wxData.appId',
    timestamp: 'wxData.timestamp',
    nonceStr: 'wxData.nonceStr',
    signature: 'wxData.signature',
    jsApiList: []
  });
  wx.ready(function () {
    callback() || null;
    wx.onMenuShareTimeline({
      title: weixinData.shareDesc,
      link: weixinData.shareLink,
      imgUrl: weixinData.shareImg
    });
    wx.onMenuShareAppMessage({
      title: weixinData.shareTitle,
      desc: weixinData.shareDesc,
      link: weixinData.shareLink,
      imgUrl: weixinData.shareImg
    });
  });
}
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return (r[2]); return null;
}
function getQueryString2(url, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = url.match(reg);
  if (r != null) return (r[2]); return null;
}